from http import HTTPStatus
from typing import Optional
from uuid import uuid4

from fastapi import Security
from fastapi.security import APIKeyHeader
from pydantic import EmailStr

from onboarding_shared.exceptions import ApiException, ApiErrorCode

from .data import AuthUserData
from ..config import AUTH_USER_EMAIL_HEADER_NAME
from ..database import database, queries
from ..utils import generate_id

auth_user_email_header = APIKeyHeader(
    name=AUTH_USER_EMAIL_HEADER_NAME,
    scheme_name="AuthUserEmail",
    auto_error=False,
    description="Proxy forwarded email of an authenticated user.",
)


class get_auth_user:

    async def __call__(self, auth_user_email: Optional[str] = Security(auth_user_email_header)):
        exc = ApiException("", ApiErrorCode.INVALID_AUTHENTICATION, HTTPStatus.FORBIDDEN)

        if auth_user_email is None:
            raise exc
        try:
            EmailStr._validate(auth_user_email)
        except ValueError:
            raise exc

        get_query = queries.get_user_by_email_query(auth_user_email)

        async with database.transaction():
            auth_user = await database.fetch_one(query=get_query)
            if auth_user is None:
                user_id = generate_id()
                auth_user = await database.fetch_one(query=queries.create_user_query(user_id, auth_user_email))

            if auth_user is not None:
                return AuthUserData(str(auth_user["id"]), auth_user["email"])

        raise ApiException("", ApiErrorCode.GENERIC_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR)
