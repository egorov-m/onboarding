from typing import AsyncGenerator, Optional

from onboarding_shared.schemas import protocol
from onboarding_shared import utils

from ..database import database, queries


class BoardStepsRepository:

    @classmethod
    async def get_steps(cls, board_id: str) -> AsyncGenerator:
        get_query = queries.get_list_board_steps_query(board_id)
        step_records_iterator = database.iterate(query=get_query)

        return step_records_iterator

    @classmethod
    async def get_step_by_index(cls, board_id: str, index: int):
        get_query = queries.get_board_step_by_index_query(board_id, index)
        step_record = await database.fetch_one(query=get_query)

        return step_record

    @classmethod
    async def get_step_by_id(cls, step_id: str):
        get_query = queries.get_board_step_by_id_query(step_id)
        step_record = await database.fetch_one(query=get_query)

        return step_record

    @classmethod
    async def get_count_board_step(cls, board_id: str):
        get_query = queries.get_count_board_steps_query(board_id)
        val = await database.fetch_val(query=get_query)

        return val

    @classmethod
    async def shift_indexes_step(cls, board_id: str, old_index: int, new_index: int):
        move_query = queries.shift_indexes_board_step_query(board_id, old_index, new_index)
        if move_query is not None:
            step_record = await database.fetch_one(query=move_query)
        else:
            step_record = None

        return step_record

    @classmethod
    async def rshift_indexes_board_step(cls, board_id: str, index: int):
        query = queries.rshift_indexes_board_step_query(board_id, index)
        step_record = await database.fetch_one(query=query)

        return step_record

    @classmethod
    async def lshift_indexes_board_step(cls, board_id: str, index: int):
        query = queries.lshift_indexes_board_step_query(board_id, index)
        step_record = await database.fetch_one(query=query)

        return step_record

    @classmethod
    async def create_step(
            cls,
            type: protocol.BoardStepType,
            title: str,
            text: Optional[str],
            index: int,
            board_id: str,
    ):
        step_id = utils.generate_id()
        create_query = queries.create_board_step_query(
            step_id,
            type=utils.int_from_enum(type),
            title=title,
            text=text,
            index=index,
            board_id=board_id,
        )
        step_record = await database.fetch_one(query=create_query)

        return step_record

    @classmethod
    async def update_step(
            cls,
            step_id: str,
            title: Optional[str] = None,
            text: Optional[str] = None,
            index: Optional[int] = None,
    ):
        update_query = queries.update_board_step_query(step_id, title=title, text=text, index=index)
        step_record = await database.fetch_one(query=update_query)

        return step_record

    @classmethod
    async def delete_step(cls, step_id: str):
        delete_query = queries.delete_board_step_query(step_id)
        step_record = await database.fetch_one(query=delete_query)

        return step_record

    @classmethod
    async def delete_steps(cls, board_id: str):
        delete_query = queries.delete_board_steps_query(board_id)
        await database.fetch_one(query=delete_query)
