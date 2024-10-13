from http import HTTPStatus

from onboarding_shared.exceptions import ApiException, ApiErrorCode
from onboarding_shared.schemas import protocol

from ..database import database, queries
from ..utils import generate_id, int_from_enum, enum_from_int


class BoardsApiService:

    @classmethod
    def _board_record_to_schema(cls, record) -> protocol.BoardInfo:
        # TODO: needs refactoring
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
        get_query = queries.get_list_boards_query(owner_id)
        board_records_iterator = database.iterate(query=get_query)
        board_info_list = [cls._board_record_to_schema(record) async for record in board_records_iterator]
        return protocol.BoardInfoListResponse(items=board_info_list, next_cursor=None, has_more=False)

    @classmethod
    async def create_board(cls, board: protocol.CreateBoardRequest, owner_id: str) -> protocol.BoardInfo:
        board_id = generate_id()
        create_query = queries.create_board_query(
            board_id,
            name=board.name,
            status=int_from_enum(protocol.BoardStatus.unpublished),
            owner_id=owner_id,
        )
        async with database.transaction():
            board_record = await database.fetch_one(query=create_query)

            return cls._board_record_to_schema(board_record)

    @classmethod
    async def get_board_info(cls, board_id: str, owner_id: str) -> protocol.BoardInfo:
        get_query = queries.get_board_by_id_query(board_id, owner_id)
        board_record = await database.fetch_one(query=get_query)
        if board_record is not None:
            return cls._board_record_to_schema(board_record)
        else:
            raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)

    @classmethod
    async def update_board_info(cls, board_id: str, owner_id: str, board: protocol.UpdateBoardInfoRequest) -> protocol.BoardInfo:
        update_query = queries.update_board_query(board_id, owner_id, name=board.name, status=board.status)
        async with database.transaction():
            board_record = await database.fetch_one(query=update_query)
            if board_record is not None:
                return cls._board_record_to_schema(board_record)
            else:
                raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)

    @classmethod
    async def delete_board(cls, board_id: str, owner_id: str):
        # TODO: write the logic for deleting board steps
        delete_query = queries.delete_board_query(board_id, owner_id)
        async with database.transaction():
            res = await database.fetch_val(query=delete_query)
            if res is None:
                raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)
