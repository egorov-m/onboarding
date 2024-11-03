from typing import Optional

from sqlalchemy import Select, Insert, Update, Delete, func, select

from onboarding_api.database.tables import user_table, board_table, board_step_table


def get_user_by_email_query(email: str) -> Select:
    return user_table.select().where(user_table.c.email == email)


def create_user_query(_id: str, email: str) -> Insert:
    return user_table.insert().values({"id": _id, "email": email}).returning(user_table)


def get_list_boards_query(owner_id: Optional[str]) -> Select:
    whereclause = []
    if owner_id is not None:
        whereclause.append(board_table.c.owner_id == owner_id)
    return board_table.select().where(*whereclause).order_by(board_table.c.updated_at)


def create_board_query(
        _id: str,
        *,
        name: str,
        status: int,
        owner_id: str,
        average_rating: float = 0.0,
        _is_deleted: bool = False,
) -> Insert:
    return board_table.insert().values({
            "id": _id,
            "name": name,
            "status": status,
            "owner_id": owner_id,
            "average_rating": average_rating,
            "is_deleted": _is_deleted
        }).returning(board_table)


def get_board_by_id_query(board_id: str, owner_id: Optional[str], *, _is_deleted: bool = False) -> Select:
    whereclause = [board_table.c.id == board_id, board_table.c.is_deleted == _is_deleted]
    if owner_id is not None:
        whereclause.append(board_table.c.owner_id == owner_id)
    return board_table.select().where(*whereclause)


def update_board_query(
        board_id: str,
        owner_id: Optional[str],
        *,
        name: Optional[str] = None,
        status: Optional[int] = None,
        is_deleted: Optional[bool] = None,
        _is_deleted: bool = False,
) -> Update:
    whereclause = [board_table.c.id == board_id, board_table.c.is_deleted == _is_deleted]
    if owner_id is not None:
        whereclause.append(board_table.c.owner_id == owner_id)
    values = {}
    if name is not None:
        values["name"] = name
    if status is not None:
        values["status"] = status
    if is_deleted is not None:
        values["is_deleted"] = is_deleted

    values["updated_at"] = func.now()
    return board_table.update().values(values).where(*whereclause).returning(board_table)


def delete_board_query(board_id: str, owner_id: Optional[str], *, _is_deleted: bool = False) -> Delete:
    whereclause = [board_table.c.id == board_id, board_table.c.is_deleted == _is_deleted]
    if owner_id is not None:
        whereclause.append(board_table.c.owner_id == owner_id)
    return board_table.delete().where(*whereclause).returning(board_table)


def create_board_step_query(
        _id: str,
        *,
        type: int,
        title: str,
        text: Optional[str],
        index: int,
        board_id: str,
) -> Insert:
    return board_step_table.insert().values({
        "id": _id,
        "type": type,
        "title": title,
        "text": text,
        "index": index,
        "board_id": board_id
    }).returning(board_step_table)


def rshift_indexes_board_step_query(board_id: str, key_index: int) -> Update:
    whereclause = [board_step_table.c.board_id == board_id, board_step_table.c.index >= key_index]
    return board_step_table.update().values({
        "index": board_step_table.c.index + 1
    }).where(*whereclause)


def lshift_indexes_board_step_query(board_id: str, key_index: int) -> Update:
    whereclause = [board_step_table.c.board_id == board_id, board_step_table.c.index > key_index]
    return board_step_table.update().values({
        "index": board_step_table.c.index - 1
    }).where(*whereclause)


def shift_indexes_board_step_query(board_id: str, old_index: int, new_index: int) -> Optional[Update]:
    whereclause = [board_step_table.c.board_id == board_id]

    direction = -1 if old_index < new_index else 1 if old_index > new_index else 0

    if direction != 0:
        whereclause.extend([
            board_step_table.c.index > old_index if direction == -1 else board_step_table.c.index >= new_index,
            board_step_table.c.index <= new_index if direction == -1 else board_step_table.c.index < old_index,
        ])

        return board_step_table.update().values({
            "index": board_step_table.c.index + direction
        }).where(*whereclause)

    return None


def get_board_step_by_id_query(board_step_id: str) -> Select:
    whereclause = [board_step_table.c.id == board_step_id]
    return board_step_table.select().where(*whereclause)


def get_board_step_by_index_query(board_id: str, index: int) -> Select:
    whereclause = [board_step_table.c.board_id == board_id, board_step_table.c.index == index]
    return board_step_table.select().where(*whereclause)


def get_list_board_steps_query(board_id: str) -> Select:
    whereclause = [board_step_table.c.board_id == board_id]
    return board_step_table.select().where(*whereclause).order_by(board_step_table.c.index)


def get_count_board_steps_query(board_id: str) -> Select:
    whereclause = [board_step_table.c.board_id == board_id]
    return select(func.count()).select_from(board_step_table).where(*whereclause)


def get_index_board_step_query(board_step_id: str) -> Select:
    whereclause = [board_step_table.c.id == board_step_id]
    return board_step_table.select(board_step_table.c.index).where(*whereclause)


def update_board_step_query(
        board_step_id: str,
        *,
        title: Optional[str] = None,
        text: Optional[str] = None,
        index: Optional[int] = None,
) -> Update:
    whereclause = [board_step_table.c.id == board_step_id]
    values = {}
    if title is not None:
        values["title"] = title
    if text is not None:
        values["text"] = text
    if index is not None:
        values["index"] = index

    values["updated_at"] = func.now()
    return board_step_table.update().values(values).where(*whereclause).returning(board_step_table)


def delete_board_step_query(board_step_id: str) -> Delete:
    return board_step_table.delete().where(board_step_table.c.id == board_step_id).returning(board_step_table)


def delete_board_steps_query(board_id: str) -> Delete:
    return board_step_table.delete().where(board_step_table.c.board_id == board_id)
