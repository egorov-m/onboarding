from datetime import timedelta, datetime
from json import JSONEncoder
from logging import getLogger
from typing import Iterable, Dict, Any

from jwt import encode, decode, InvalidTokenError, ExpiredSignatureError

from onboarding_shared.utils import get_current_datetime

from ..config import (
    BOARD_SYNC_ISSUER,
    BOARD_SYNC_AUDIENCE,
    BOARD_SYNC_TOKEN_SECRET,
    BOARD_SYNC_TOKEN_ALGORITHM,
    BOARD_SYNC_TOKEN_EXPIRATION_DAYS,
)


logger = getLogger(__name__)


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.timestamp()
        return super().default(obj)


def create_token_by_payload(payload: Dict[str, Any]) -> str:
    ndf = get_current_datetime()
    exp = ndf + timedelta(days=BOARD_SYNC_TOKEN_EXPIRATION_DAYS)

    return encode(
        payload={
            **payload,
            "iss": BOARD_SYNC_ISSUER,
            "aud": BOARD_SYNC_AUDIENCE,
            "exp": exp
        },
        key=BOARD_SYNC_TOKEN_SECRET,
        algorithm=BOARD_SYNC_TOKEN_ALGORITHM,
        json_encoder=CustomJSONEncoder,
    )


def create_payload_token(session_id: str, boards: Iterable) -> Dict:
    return {
        "uuid": session_id,
        "boards": {
            board["id"]: {
                "sync_step": board["sync_step"],
                "sync_at": board.get("sync_at") or get_current_datetime(),
                "rating": board["rating"],
                "finalized": board["finalized"]
            } for board in boards
        }
    }


def update_payload_token(payload, board):
    payload["boards"][board["id"]] = {
        "sync_step": board["sync_step"],
        "sync_at": board.get("sync_at") or get_current_datetime(),
        "rating": board["rating"],
        "finalized": board["finalized"]
    }

    return payload


def create_token(session_id: str, boards: Iterable) -> str:
    return create_token_by_payload(
        create_payload_token(session_id, boards)
    )


def get_token_payload(token: str):
    try:
        return decode(
            token,
            key=BOARD_SYNC_TOKEN_SECRET,
            algorithms=(BOARD_SYNC_TOKEN_ALGORITHM,),
            verify=True,
            audience=BOARD_SYNC_AUDIENCE,
            issuer=BOARD_SYNC_ISSUER,
            leeway=timedelta(seconds=10)
        )
    except ExpiredSignatureError:
        ...
    except InvalidTokenError:
        logger.info(msg=f"Invalid token: {token}")

    return None
