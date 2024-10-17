from typing import Optional

from sqlalchemy import Select, Insert, Update, Delete

from onboarding_api.database.tables import user_table, board_table


def get_user_by_email_query(email: str) -> Select:
    return user_table.select().where(user_table.c.email == email)


def create_user_query(_id: str, email: str) -> Insert:
    return user_table.insert().values({"id": _id, "email": email}).returning(user_table)


def get_list_boards_query(owner_id: Optional[str]) -> Select:
    whereclause = []
    if owner_id is not None:
        whereclause.append(board_table.c.owner_id == owner_id)
    return board_table.select().where()


def create_board_query(
        _id: str,
        *,
        name: str,
        status: int,
        owner_id: str,
        average_rating: float = 0.0,
        is_deleted: bool = False,
) -> Insert:
    return board_table.insert().values({
            "id": _id,
            "name": name,
            "status": status,
            "owner_id": owner_id,
            "average_rating": average_rating,
            "is_deleted": is_deleted
        }).returning(board_table)


def get_board_by_id_query(board_id: str, owner_id: Optional[str], *, is_deleted: bool = False) -> Select:
    whereclause = [board_table.c.id == board_id, board_table.c.is_deleted == is_deleted]
    if owner_id is not None:
        whereclause.append(board_table.c.owner_id == owner_id)
    return board_table.select().where(*whereclause)


def update_board_query(
        board_id: str,
        owner_id: Optional[str],
        *,
        name: Optional[str],
        status: Optional[str],
        is_deleted: bool = False
) -> Update:
    whereclause = [board_table.c.id == board_id, board_table.c.is_deleted == is_deleted]
    if owner_id is not None:
        whereclause.append(board_table.c.owner_id == owner_id)
    values = {}
    if name is not None:
        values["name"] = name
    if status is not None:
        values["status"] = status
    return board_table.update().values(values).where(*whereclause).returning(board_table)


def delete_board_query(board_id: str, owner_id: Optional[str], *, is_deleted: bool = False) -> Delete:
    whereclause = [board_table.c.id == board_id, board_table.c.is_deleted == is_deleted]
    if owner_id is not None:
        whereclause.append(board_table.c.owner_id == owner_id)
    return board_table.delete().where(*whereclause).returning(board_table)
