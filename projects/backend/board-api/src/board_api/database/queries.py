from sqlalchemy import Select, select, join

from ..database.tables import board_table, board_step_table, blob_table, board_step_blob_table


def get_board_by_id_query(board_id: str, *, _is_deleted: bool = False) -> Select:
    whereclause = [board_table.c.id == board_id, board_table.c.is_deleted == _is_deleted]
    return board_table.select().where(*whereclause)


def get_board_step_by_id_query(board_step_id: str) -> Select:
    whereclause = [board_step_table.c.id == board_step_id]
    return board_step_table.select().where(*whereclause)


def get_board_step_by_index_query(board_id: str, index: int) -> Select:
    whereclause = [board_step_table.c.board_id == board_id, board_step_table.c.index == index]
    return board_step_table.select().where(*whereclause)


def get_list_board_steps_query(board_id: str) -> Select:
    whereclause = [board_step_table.c.board_id == board_id]
    return board_step_table.select().where(*whereclause).order_by(board_step_table.c.index)


def get_list_blobs_query(board_step_id: str) -> Select:
    return select(blob_table).select_from(
        join(
            board_step_blob_table, blob_table, board_step_blob_table.c.blob_id == blob_table.c.id
        )
    ).where(board_step_blob_table.c.board_step_id == board_step_id)
