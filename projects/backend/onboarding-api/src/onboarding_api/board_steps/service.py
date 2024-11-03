from http import HTTPStatus
from typing import Optional, List

from onboarding_shared.exceptions import ApiException, ApiErrorCode
from onboarding_shared.schemas import protocol

from .repository import BoardStepsRepository
from ..database import database
from ..boards.repository import BoardRepository
from ..utils import enum_from_int


class BoardStepsApiService:

    _board_repo = BoardRepository
    _board_steps_repo = BoardStepsRepository

    @classmethod
    def _step_record_to_schema(cls, record, blobs_schema: Optional[List[protocol.Blob]] = None) -> protocol.BoardStep:
        return protocol.BoardStep(
            id=record["id"],
            type=enum_from_int(protocol.BoardStepType, record["type"]),
            title=record["title"],
            text=record["text"],
            index=record["index"],
            blobs=blobs_schema,
            created_at=record["created_at"],
            updated_at=record["updated_at"],
        )

    @classmethod
    def _prepare_new_index(cls, new_index, count_steps, p=0):
        if new_index < 0:
            new_index = 0
        elif new_index > count_steps:
            new_index = count_steps - p

        return new_index

    @classmethod
    async def create_board_step(cls, step: protocol.CreateBoardStepRequest, owner_id: str):
        board_id = str(step.board_id)
        new_index = step.index
        await cls._get_board_record(board_id, owner_id)
        count_steps = await cls._board_steps_repo.get_count_board_step(board_id)

        if count_steps >= protocol.INDEX_BOARD_STEPS_LIMIT + 1:
            raise ApiException(
                "The number of board steps has reached limit.",
                ApiErrorCode.BOARD_STEP_NOT_SPECIFIED,
                HTTPStatus.BAD_REQUEST,
            )

        new_index = cls._prepare_new_index(new_index, count_steps)
        async with database.transaction():
            await cls._board_steps_repo.rshift_indexes_board_step(board_id, new_index)
            step_record = await cls._board_steps_repo.create_step(step.type, step.title, step.text, new_index, board_id)
            return cls._step_record_to_schema(step_record)

    @classmethod
    async def get_steps(
            cls,
            board_id: str,
            owner_id: str,
            is_include_blobs: bool = False,
    ) -> protocol.BoardStepListResponse:
        await cls._get_board_record(board_id, owner_id)
        step_records_iterator = await cls._board_steps_repo.get_steps(board_id)
        step_list = [cls._step_record_to_schema(record) async for record in step_records_iterator]
        return protocol.BoardStepListResponse(items=step_list, next_cursor=None, has_more=False)

    @classmethod
    async def _get_board_record(cls, board_id: str, owner_id: str):
        board_record = await cls._board_repo.get_board_info(board_id, owner_id)
        if board_record is None:
            raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)

        return board_record

    @classmethod
    async def _get_step_record_by_index(
            cls,
            board_id: str,
            index: int,
            blobs_schema: Optional[List[protocol.Blob]] = None,
    ):
        step_record = await cls._board_steps_repo.get_step_by_index(board_id, index)
        if step_record is not None:
            return cls._step_record_to_schema(step_record, blobs_schema)
        else:
            raise ApiException("Board step not found.", ApiErrorCode.BOARD_STEP_NOT_FOUND, HTTPStatus.NOT_FOUND)

    @classmethod
    async def get_step_by_index(
            cls,
            board_id: str,
            index: int,
            owner_id: str,
            is_include_blobs: bool = False,
    ) -> protocol.BoardStep:
        await cls._get_board_record(board_id, owner_id)
        step = await cls._get_step_record_by_index(board_id, index=index)

        return step

    @classmethod
    async def _get_step_record_by_id(cls, step_id: str, owner_id: str):
        step_record = await cls._board_steps_repo.get_step_by_id(step_id)
        ex = None
        try:
            if step_record is not None:
                board_id = step_record["board_id"]
                await cls._get_board_record(board_id, owner_id)
        except ApiException as e:
            ex = e

        _e = ApiException("Board step not found.", ApiErrorCode.BOARD_STEP_NOT_FOUND, HTTPStatus.NOT_FOUND)
        if step_record is None:
            raise _e
        if ex is not None:
            raise _e from ex

        return step_record

    @classmethod
    async def get_step_by_id(
            cls,
            step_id: str,
            owner_id: str,
            is_include_blobs: bool = False,
    ) -> protocol.BoardStep:
        step_record = await cls._get_step_record_by_id(step_id, owner_id)

        return cls._step_record_to_schema(step_record)

    @classmethod
    async def move_step_by_index(
            cls,
            board_id: str,
            old_index: int,
            new_index: int,
            owner_id: str,
            is_include_blobs: bool = False,
    ) -> protocol.BoardStep:
        await cls._get_board_record(board_id, owner_id)
        step = await cls._get_step_record_by_index(board_id, index=old_index)
        count_steps = await cls._board_steps_repo.get_count_board_step(board_id)
        new_index = cls._prepare_new_index(new_index, count_steps, p=1)

        async with database.transaction():
            await cls._board_steps_repo.shift_indexes_step(board_id, old_index, new_index)
            step_record = await cls._board_steps_repo.update_step(str(step.id), index=new_index)
            return cls._step_record_to_schema(step_record)

    @classmethod
    async def update_step(
            cls,
            step_id: str,
            update: protocol.UpdateBoardStepRequest,
            owner_id: str,
            is_include_blobs: bool = False,
    ) -> protocol.BoardStep:
        await cls._get_step_record_by_id(step_id, owner_id)
        async with database.transaction():
            step_record = await cls._board_steps_repo.update_step(step_id, update.title, update.text)
            return cls._step_record_to_schema(step_record)

    @classmethod
    async def delete_step(
            cls,
            step_id: str,
            owner_id: str,
    ):
        step_record = await cls._get_step_record_by_id(step_id, owner_id)
        async with database.transaction():
            await cls._board_steps_repo.delete_step(step_id)
            await cls._board_steps_repo.lshift_indexes_board_step(step_record["board_id"], step_record["index"])
