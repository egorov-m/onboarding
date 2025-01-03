from typing import Optional, Iterable

from sqlalchemy import Select, Insert, Update, Delete, func, select, join

from ..database.tables import user_table, board_table, board_step_table, blob_table, board_step_blob_table


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


def create_blob_query(
        _id: str,
        *,
        type: int,
        s3_link: Optional[str] = None,
) -> Insert:
    return blob_table.insert().values({
        "id": _id,
        "type": type,
        "s3_link": s3_link
    }).returning(blob_table)


def attach_blob_board_step_query(board_step_id: str, blob_id: str) -> Insert:
    return board_step_blob_table.insert().values({
        "board_step_id": board_step_id,
        "blob_id": blob_id
    })


def detach_blob_board_step_query(board_step_id: str, blob_id: str) -> Delete:
    return board_step_blob_table.delete().where(
        board_step_blob_table.c.board_step_id == board_step_id,
        board_step_blob_table.c.blob_id == blob_id
    )


def detach_blob_by_id_board_step_query(blob_id: str) -> Delete:
    return board_step_blob_table.delete().where(
        board_step_blob_table.c.blob_id == blob_id
    )


def delete_blobs_board_step_query(blob_ids: Iterable) -> Delete:
    return blob_table.delete().where(
        blob_table.c.id.in_(blob_ids)
    )


def detach_all_blobs_for_board_step_query(board_step_id: str) -> Delete:
    return board_step_blob_table.delete().where(
        board_step_blob_table.c.board_step_id == board_step_id,
    )


def count_attached_blob_board_step_query(board_step_id: str) -> Select:
    return select(func.count()).select_from(board_step_blob_table).where(
        board_step_blob_table.c.board_step_id == board_step_id
    )


def get_attached_blob_board_step_query(board_step_id: str, blob_id: str) -> Select:
    return board_step_blob_table.select().where(
        board_step_blob_table.c.board_step_id == board_step_id,
        board_step_blob_table.c.blob_id == blob_id,
    )


def get_list_blobs_query(board_step_id: str) -> Select:
    return select(blob_table).select_from(
        join(
            board_step_blob_table, blob_table, board_step_blob_table.c.blob_id == blob_table.c.id
        )
    ).where(board_step_blob_table.c.board_step_id == board_step_id)


def get_blob_by_id_query(blob_id: str) -> Select:
    return blob_table.select().where(blob_table.c.id == blob_id)


def delete_blob_query(blob_id: str) -> Delete:
    return blob_table.delete().where(blob_table.c.id == blob_id)


def update_blob_query(
        blob_id: str,
        *,
        type: Optional[int] = None,
        s3_link: Optional[str] = None,
) -> Update:
    values = {}
    if type is not None:
        values["type"] = type
    if s3_link is not None:
        values["s3_link"] = s3_link

    return blob_table.update().values(values).where(blob_table.c.id == blob_id).returning(blob_table)
