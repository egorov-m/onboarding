from typing import Optional

from fastapi import Security
from fastapi.security import APIKeyCookie
from starlette.responses import Response

from .service import BoardSyncService
from ..config import BOARD_SYNC_TOKEN_COOKIE_NAME


board_sync_token_cookie = APIKeyCookie(
    name=BOARD_SYNC_TOKEN_COOKIE_NAME,
    scheme_name="BoardSyncToken",
    auto_error=False,
    description="Token in JWT format, stored in browser-side cookies. "
                "It is used for tracking/passage by the user of the built-in onboarding."
)


def sync_service(response: Response, token: Optional[str] = Security(board_sync_token_cookie)):
    service = BoardSyncService(response, sync_token=token)

    return service
