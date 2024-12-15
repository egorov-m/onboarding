from .client import client


class AnalyticsRepository:

    @classmethod
    def get_funnel_board_steps_by_board(cls, board_id: str):
        result = client.query(
            """WITH user_counts AS (
                SELECT COUNT(DISTINCT session_id) AS total_users
                FROM events
                WHERE board_id = %s
            ), sync_step_counts AS (
                SELECT sync_step_id,
                       sync_step_index,
                       sync_step_title,
                       COUNT(DISTINCT session_id) AS user_count
                FROM events
                WHERE board_id = %s
                GROUP BY sync_step_id,
                         sync_step_index,
                         sync_step_title
            )
            SELECT s.sync_step_id,
                   s.sync_step_index,
                   s.sync_step_title,
                   s.user_count,
                   (s.user_count * 100.0 / u.total_users) AS percentage
            FROM sync_step_counts s
            CROSS JOIN user_counts u
            ORDER BY s.sync_step_index;""",
            (board_id, board_id,)
        )
        return result.result_rows
