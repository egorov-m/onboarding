from http import HTTPStatus
from typing import List

from fastapi import BackgroundTasks

from onboarding_shared.exceptions import ApiException, ApiErrorCode
from onboarding_shared.schemas import protocol

from .repository import BoardStepsRepository
from ..config import MAX_COUNT_ATTACHED_BLOB_BY_BOARD_STEP
from ..database import database
from ..boards.repository import BoardRepository
from ..blobs.repository import BlobRepository
from .. import storage
from ..utils import enum_from_int


class BoardStepsApiService:

    _board_repo = BoardRepository
    _board_steps_repo = BoardStepsRepository
    _blob_repo = BlobRepository

    @classmethod
    async def _step_record_to_schema(cls, record, is_include_blobs, is_include_link) -> protocol.BoardStep:

        blobs_schema = None
        if is_include_blobs:
            blobs_schema = await cls._get_blobs_schema(is_include_link, record["id"])

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
    def _blob_record_to_schema(cls, record, link=None) -> protocol.Blob:
        return protocol.Blob(
            id=record["id"],
            type=enum_from_int(protocol.BlobType, record["type"]),
            link=link,
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
    async def create_board_step(cls, step: protocol.CreateBoardStepRequest, owner_id: str) -> protocol.BoardStep:
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
            return await cls._step_record_to_schema(step_record, False, False)

    @classmethod
    async def get_steps(
            cls,
            board_id: str,
            owner_id: str,
            is_include_blobs: bool = False,
            is_include_link: bool = True,
    ) -> protocol.BoardStepListResponse:
        await cls._get_board_record(board_id, owner_id)
        step_records_iterator = await cls._board_steps_repo.get_steps(board_id)

        step_list = []
        async for record in step_records_iterator:
            step_list.append(record)

        step_list = [
            await cls._step_record_to_schema(
                record,
                is_include_blobs,
                is_include_link
            ) for record in step_list]

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
            is_include_blobs: bool = False,
            is_include_link: bool = True,
    ):
        step_record = await cls._board_steps_repo.get_step_by_index(board_id, index)
        if step_record is not None:
            return await cls._step_record_to_schema(step_record, is_include_blobs, is_include_link)
        else:
            raise ApiException("Board step not found.", ApiErrorCode.BOARD_STEP_NOT_FOUND, HTTPStatus.NOT_FOUND)

    @classmethod
    async def get_step_by_index(
            cls,
            board_id: str,
            index: int,
            owner_id: str,
            is_include_blobs: bool = False,
            is_include_link: bool = True,
    ) -> protocol.BoardStep:
        await cls._get_board_record(board_id, owner_id)
        step = await cls._get_step_record_by_index(
            board_id,
            index=index,
            is_include_blobs=is_include_blobs,
            is_include_link=is_include_link
        )

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
    async def _get_blob_record(cls, step_id, blob_id):
        is_attached = await cls._blob_repo.check_attached_blob(step_id, blob_id)
        if not is_attached:
            raise ApiException("Blob not found.", ApiErrorCode.BLOB_NOT_FOUND, HTTPStatus.NOT_FOUND)
        blob_record = await cls._blob_repo.get_blob(blob_id)

        return blob_record

    @classmethod
    async def _get_blobs_schema(cls, is_include_link: bool, step_id) -> List[protocol.Blob]:
        blob_records_iterator = await cls._blob_repo.get_blobs(step_id)
        blob_list = []
        async for record in blob_records_iterator:
            link = None
            if is_include_link:
                blob_type = enum_from_int(protocol.BlobType, record["type"])
                link = storage.presigned_get_object(step_id, record["id"], blob_type)
            blob_list.append(cls._blob_record_to_schema(record, link))

        return blob_list

    @classmethod
    async def get_step_by_id(
            cls,
            step_id: str,
            owner_id: str,
            is_include_blobs: bool = False,
            is_include_link: bool = True,
    ) -> protocol.BoardStep:
        step_record = await cls._get_step_record_by_id(step_id, owner_id)
        step = await cls._step_record_to_schema(step_record, is_include_blobs, is_include_link)

        return step

    @classmethod
    async def move_step_by_index(
            cls,
            board_id: str,
            old_index: int,
            new_index: int,
            owner_id: str,
            is_include_blobs: bool = False,
            is_include_link: bool = True,
    ) -> protocol.BoardStep:
        await cls._get_board_record(board_id, owner_id)
        step = await cls._get_step_record_by_index(board_id, index=old_index)
        count_steps = await cls._board_steps_repo.get_count_board_step(board_id)
        new_index = cls._prepare_new_index(new_index, count_steps, p=1)

        async with database.transaction():
            await cls._board_steps_repo.shift_indexes_step(board_id, old_index, new_index)
            step_record = await cls._board_steps_repo.update_step(str(step.id), index=new_index)

        return await cls._step_record_to_schema(step_record, is_include_blobs, is_include_link)

    @classmethod
    async def update_step(
            cls,
            step_id: str,
            update: protocol.UpdateBoardStepRequest,
            owner_id: str,
            is_include_blobs: bool = False,
            is_include_link: bool = True,
    ) -> protocol.BoardStep:
        await cls._get_step_record_by_id(step_id, owner_id)
        async with database.transaction():
            step_record = await cls._board_steps_repo.update_step(step_id, update.title, update.text)
            return await cls._step_record_to_schema(step_record, is_include_blobs, is_include_link)

    @classmethod
    async def delete_step(
            cls,
            step_id: str,
            owner_id: str,
            background_tasks: BackgroundTasks,
    ):
        step_record = await cls._get_step_record_by_id(step_id, owner_id)
        async with database.transaction():
            await cls._blob_repo.delete_blobs_by_board_step(step_id)
            await cls._board_steps_repo.delete_step(step_id)
            await cls._board_steps_repo.lshift_indexes_board_step(step_record["board_id"], step_record["index"])

        background_tasks.add_task(
            storage.remove_objects_by_prefix,
            step_id=step_record["id"],
            blob_type=protocol.BlobType.image,  # TODO: redesign the logic for deletion in different buckets
        )

    @classmethod
    async def get_attach_blob_to_step(
            cls,
            step_id: str,
            owner_id: str,
            blob_type: protocol.BlobType,
    ) -> protocol.ActionBlobToStepResponse:
        step_record = await cls._get_step_record_by_id(step_id, owner_id)
        current_attached_count = await cls._blob_repo.get_count_attached_blob(step_id)
        if current_attached_count >= MAX_COUNT_ATTACHED_BLOB_BY_BOARD_STEP:
            raise ApiException(
                "The board step already has the maximum number of blobs attached to it.",
                ApiErrorCode.BOARD_STEP_ALREADY_HAS_MAX_COUNT_ATTACHED_BLOB,
                HTTPStatus.BAD_REQUEST
            )
        async with database.transaction():
            blob_record = await cls._blob_repo.create_blob(step_record["id"], blob_type)

        action_link = storage.presigned_put_object(step_record["id"], blob_record["id"], blob_type)

        return protocol.ActionBlobToStepResponse(
            blob_id=blob_record["id"],
            blob_type=blob_type,
            action_link=action_link,
            action_type=protocol.ActionBlobType.attach,
        )

    @classmethod
    async def get_update_blob_to_step(
            cls,
            step_id: str,
            owner_id: str,
            blob_id: str,
    ) -> protocol.ActionBlobToStepResponse:
        step_record = await cls._get_step_record_by_id(step_id, owner_id)
        blob_record = await cls._get_blob_record(step_id, blob_id)

        blob_type = enum_from_int(protocol.BlobType, blob_record["type"])
        action_link = storage.presigned_put_object(step_record["id"], blob_record["id"], blob_type)

        return protocol.ActionBlobToStepResponse(
            blob_id=blob_record["id"],
            blob_type=blob_type,
            action_link=action_link,
            action_type=protocol.ActionBlobType.update,
        )

    @classmethod
    async def get_blobs_step(
            cls,
            step_id: str,
            owner_id: str,
            is_include_link: bool,
    ) -> protocol.BlobListResponse:
        step_record = await cls._get_step_record_by_id(step_id, owner_id)
        blob_list = await cls._get_blobs_schema(is_include_link, step_record["id"])

        return protocol.BlobListResponse(items=blob_list, next_cursor=None, has_more=False)

    @classmethod
    async def get_blob_step(
            cls,
            step_id: str,
            owner_id: str,
            blob_id: str,
            is_include_link: bool,
    ) -> protocol.Blob:
        step_record = await cls._get_step_record_by_id(step_id, owner_id)
        blob_record = await cls._get_blob_record(step_id, blob_id)

        link = None
        if is_include_link:
            blob_type = enum_from_int(protocol.BlobType, blob_record["type"])
            link = storage.presigned_get_object(step_record["id"], blob_record["id"], blob_type)

        return cls._blob_record_to_schema(blob_record, link)

    @classmethod
    async def delete_blob_step(cls, step_id: str, owner_id: str, blob_id: str, background_tasks: BackgroundTasks):
        step_record = await cls._get_step_record_by_id(step_id, owner_id)
        blob_record = await cls._get_blob_record(step_id, blob_id)
        async with database.transaction():
            await cls._blob_repo.delete_blob(blob_record["id"])

        background_tasks.add_task(
            storage.remove_object,
            step_id=step_record["id"],
            blob_id=blob_record["id"],
            blob_type=enum_from_int(protocol.BlobType, blob_record["type"]),
        )
