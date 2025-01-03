from typing import AsyncGenerator

from ..database import onboarding_database as database, queries


class BoardSyncRepository:

    @classmethod
    async def update_board_rating(cls, board_id: str, rating: float):
        update_query = queries.update_board_query(board_id, average_rating=rating)
        board_record = await database.fetch_one(query=update_query)

        return board_record

    @classmethod
    async def get_board(cls, board_id: str):
        get_query = queries.get_board_by_id_query(board_id)
        board_record = await database.fetch_one(query=get_query)

        return board_record

    @classmethod
    async def get_step_by_id(cls, step_id: str):
        get_query = queries.get_board_step_by_id_query(step_id)
        step_record = await database.fetch_one(query=get_query)

        return step_record

    @classmethod
    async def get_step_by_index(cls, board_id: str, index: int):
        get_query = queries.get_board_step_by_index_query(board_id, index)
        step_record = await database.fetch_one(query=get_query)

        return step_record

    @classmethod
    async def get_list_board_steps(cls, board_id: str):
        get_query = queries.get_list_board_steps_query(board_id)
        schema_records_iterator = database.iterate(query=get_query)

        return schema_records_iterator

    @classmethod
    async def get_blobs(cls, board_step_id: str) -> AsyncGenerator:
        get_query = queries.get_list_blobs_query(board_step_id)
        blob_records_iterator = database.iterate(query=get_query)

        return blob_records_iterator
