from typing import Optional

from sqlalchemy import Select, select, join, Update, func

from onboarding_shared import utils
from onboarding_shared.schemas import protocol
from ..database.tables import board_table, board_step_table, blob_table, board_step_blob_table


_board_published_status = utils.int_from_enum(protocol.BoardStatus.published)
_join_tables_board_board_step = join(
    board_step_table, board_table, board_step_table.c.board_id == board_table.c.id
)


def update_board_query(
        board_id: str,
        *,
        average_rating: Optional[float] = None
) -> Update:
    whereclause = [board_table.c.id == board_id]
    values = {}
    if average_rating is not None:
        values["average_rating"] = average_rating

    values["updated_at"] = func.now()
    return board_table.update().values(values).where(*whereclause).returning(board_table)


def get_board_by_id_query(board_id: str, *, _status: int = _board_published_status, _is_deleted: bool = False) -> Select:
    whereclause = [
        board_table.c.id == board_id,
        board_table.c.status == _status,
        board_table.c.is_deleted == _is_deleted
    ]
    return select(board_table).where(*whereclause)


def get_board_step_by_id_query(board_step_id: str, *, _status: int = _board_published_status) -> Select:
    whereclause = [
        board_step_table.c.id == board_step_id,
        board_table.c.status == _status,
    ]
    return select(board_step_table).select_from(_join_tables_board_board_step).where(*whereclause)


def get_board_step_by_index_query(board_id: str, index: int, *, _status: int = _board_published_status) -> Select:
    whereclause = [
        board_step_table.c.board_id == board_id,
        board_step_table.c.index == index,
        board_table.c.status == _status,
    ]
    return select(board_step_table).select_from(_join_tables_board_board_step).where(*whereclause)


def get_list_board_steps_query(board_id: str, *, _status: int = _board_published_status) -> Select:
    whereclause = [
        board_step_table.c.board_id == board_id,
        board_table.c.status == _status,
    ]
    return select(board_step_table).select_from(
        _join_tables_board_board_step
    ).where(*whereclause).order_by(board_step_table.c.index)


def get_list_blobs_query(board_step_id: str, _status: int = _board_published_status) -> Select:
    whereclause = [
        board_step_blob_table.c.board_step_id == board_step_id,
        board_table.c.status == _status,
    ]
    return select(blob_table).select_from(
        join(
            board_step_blob_table, blob_table, board_step_blob_table.c.blob_id == blob_table.c.id
        ),
        _join_tables_board_board_step
    ).where(*whereclause)
