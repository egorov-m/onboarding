from typing import AsyncGenerator, Optional

from onboarding_shared.schemas import protocol

from ..database import database, queries
from ..utils import generate_id, int_from_enum


class BoardRepository:

    @classmethod
    async def get_boards_info(cls, owner_id: str) -> AsyncGenerator:
        get_query = queries.get_list_boards_query(owner_id)
        board_records_iterator = database.iterate(query=get_query)

        return board_records_iterator

    @classmethod
    async def create_board(cls, board_name: str, owner_id: str):
        board_id = generate_id()
        create_query = queries.create_board_query(
            board_id,
            name=board_name,
            status=int_from_enum(protocol.BoardStatus.unpublished),
            owner_id=owner_id,
        )
        board_record = await database.fetch_one(query=create_query)

        return board_record

    @classmethod
    async def get_board_info(cls, board_id: str, owner_id: str):
        get_query = queries.get_board_by_id_query(board_id, owner_id)
        board_record = await database.fetch_one(query=get_query)

        return board_record

    @classmethod
    async def update_board_info(
            cls,
            board_id: str,
            owner_id: str,
            board_name: Optional[str] = None,
            board_status: Optional[protocol.BoardStatus] = None,
    ):
        status = int_from_enum(board_status) if board_status is not None else None
        update_query = queries.update_board_query(
            board_id,
            owner_id,
            name=board_name,
            status=status,
        )
        board_record = await database.fetch_one(query=update_query)

        return board_record

    @classmethod
    async def delete_board(cls, board_id: str, owner_id: str):
        delete_query = queries.delete_board_query(board_id, owner_id)
        res = await database.fetch_val(query=delete_query)

        return res
