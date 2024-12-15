from http import HTTPStatus

from onboarding_shared.exceptions import ApiException, ApiErrorCode
from onboarding_shared.schemas import protocol

from ..boards.repository import BoardRepository
from .repository import AnalyticsRepository


class AnalyticsService:

    _board_repo = BoardRepository
    _analytics_repo = AnalyticsRepository

    @classmethod
    async def funnel_board_steps(cls, board_id: str, owner_id: str) -> protocol.AnalyticsFunnelBoardStepsListResponse:
        board_record = await cls._board_repo.get_board_info(board_id, owner_id)
        if board_record is not None:
            items = [protocol.AnalyticsFunnelBoardStepItem(
                step_id=item[0],
                step_index=item[1],
                step_title=item[2],
                step_count_users=item[3],
                step_percentage_users=item[4]
            ) for item in cls._analytics_repo.get_funnel_board_steps_by_board(board_id)]
            return protocol.AnalyticsFunnelBoardStepsListResponse(items=items, next_cursor=None, has_more=False)
        else:
            raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)
