from http import HTTPStatus

from fastapi import BackgroundTasks

from onboarding_shared.exceptions import ApiException, ApiErrorCode
from onboarding_shared.schemas import protocol

from .repository import BoardRepository
from .. import storage
from ..board_steps.repository import BoardStepsRepository
from ..blobs.repository import BlobRepository
from ..database import database
from ..utils import enum_from_int


class BoardsApiService:

    _board_repo = BoardRepository
    _board_steps_repo = BoardStepsRepository
    _blob_repo = BlobRepository

    @classmethod
    def _board_record_to_schema(cls, record) -> protocol.BoardInfo:
        return protocol.BoardInfo(
            id=record["id"],
            name=record["name"],
            created_at=record["created_at"],
            updated_at=record["updated_at"],
            average_rating=record["average_rating"],
            status=enum_from_int(protocol.BoardStatus, record["status"])
        )

    @classmethod
    async def get_boards_info(cls, owner_id: str):
        board_records_iterator = await cls._board_repo.get_boards_info(owner_id)
        board_info_list = [cls._board_record_to_schema(record) async for record in board_records_iterator]
        return protocol.BoardInfoListResponse(items=board_info_list, next_cursor=None, has_more=False)

    @classmethod
    async def create_board(cls, board: protocol.CreateBoardRequest, owner_id: str) -> protocol.BoardInfo:
        async with database.transaction():
            board_record = await cls._board_repo.create_board(board.name, owner_id)

            return cls._board_record_to_schema(board_record)

    @classmethod
    async def get_board_info(cls, board_id: str, owner_id: str) -> protocol.BoardInfo:
        board_record = await cls._board_repo.get_board_info(board_id, owner_id)
        if board_record is not None:
            return cls._board_record_to_schema(board_record)
        else:
            raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)

    @classmethod
    async def update_board_info(
            cls,
            board_id: str,
            owner_id: str,
            board: protocol.UpdateBoardInfoRequest,
    ) -> protocol.BoardInfo:
        async with database.transaction():
            board_record = await cls._board_repo.update_board_info(board_id, owner_id, board.name, board.status)
            if board_record is not None:
                return cls._board_record_to_schema(board_record)
            else:
                raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)

    @classmethod
    async def delete_board(cls, board_id: str, owner_id: str, background_tasks: BackgroundTasks):
        async with database.transaction():
            board_record = await cls._board_repo.get_board_info(board_id, owner_id)
            res = None
            if board_record is not None:
                step_records_iterator = await cls._board_steps_repo.get_steps(board_id)
                step_records_list = []
                async for step in step_records_iterator:
                    step_records_list.append(step)
                for step in step_records_list:
                    await cls._blob_repo.delete_blobs_by_board_step(step["id"])
                await cls._board_steps_repo.delete_steps(board_id)
                res = await cls._board_repo.delete_board(board_id, owner_id)

                background_tasks.add_task(
                    cls._remove_objects_step_records_list,
                    step_records_list=step_records_list
                )
            if res is None:
                raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)

    @classmethod
    async def _remove_objects_step_records_list(cls, step_records_list):
        for record in step_records_list:
            # TODO: redesign the logic for deletion in different buckets
            storage.remove_objects_by_prefix(record["id"], protocol.BlobType.image)
