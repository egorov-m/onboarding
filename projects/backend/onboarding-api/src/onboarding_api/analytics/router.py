from http import HTTPStatus
from uuid import UUID

from fastapi import APIRouter, Depends

from onboarding_shared.schemas import protocol

from ..iam import get_auth_user, AuthUserData
from .service import AnalyticsService


analytics_api = APIRouter()


@analytics_api.get("/funnel_board_steps", status_code=HTTPStatus.OK)
async def funnel_board_steps(
        board_id: UUID,
        user: AuthUserData = Depends(get_auth_user())
) -> protocol.AnalyticsFunnelBoardStepsListResponse:
    return await AnalyticsService.funnel_board_steps(str(board_id), user.id)
