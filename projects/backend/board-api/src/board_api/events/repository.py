from datetime import datetime
from typing import Optional

from onboarding_shared.schemas import protocol

from .client import client


class EventsRepository:

    _default_scope = protocol.BoardEventScope.board

    @classmethod
    def insert_event(
            cls,
            *,
            session_id: str,
            board_id: str,
            board_owner_id: str,
            board_name: str,
            sync_step_id: str,
            sync_step_index: str,
            sync_step_title: str,
            sync_at: datetime,
            rating: Optional[int],
            finalized: Optional[bool],
            scope: str = _default_scope,
    ):
        client.insert(
            "events",
            ((scope,
              session_id,
              board_id,
              board_owner_id,
              board_name,
              sync_step_id,
              sync_step_index,
              sync_step_title,
              sync_at,
              rating,
              finalized),),
            column_names=(
                "scope",
                "session_id",
                "board_id",
                "board_owner_id",
                "board_name",
                "sync_step_id",
                "sync_step_index",
                "sync_step_title",
                "sync_at",
                "rating",
                "finalized"
            )
        )

    @classmethod
    def get_average_rating(cls, board_id: str):
        result = client.query(
            """SELECT AVG(last_rating) AS average_rating
            FROM (
                SELECT board_id, session_id, rating AS last_rating
                FROM (
                    SELECT board_id, session_id, rating,
                           ROW_NUMBER() OVER (PARTITION BY board_id, session_id ORDER BY sync_at DESC) AS rn
                    FROM events
                    WHERE board_id = %s
                ) 
                WHERE rn = 1
            )""",
            (board_id,)
        )
        return result.result_rows[0][0]
