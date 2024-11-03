from enum import Enum
from http import HTTPStatus
from typing import Optional


class ApiErrorCode(int, Enum):
    GENERIC_ERROR = 0
    INVALID_AUTHENTICATION = 1

    BOARD_NOT_FOUND = 1004

    BOARD_STEP_NOT_SPECIFIED = 2000
    BOARD_STEP_NOT_FOUND = 2004


class ApiException(Exception):
    message: Optional[str] = None
    error_code: int
    http_status_code: HTTPStatus

    def __init__(
            self,
            message: str,
            error_code: ApiErrorCode,
            http_status_code: HTTPStatus = HTTPStatus.BAD_REQUEST,
            *args,
    ):
        super().__init__(message, *args)
        self.message = message
        self.error_code = error_code
        self.http_status_code = http_status_code

    def __repr__(self) -> str:
        class_name = self.__class__.__name__
        return (
            f"{class_name}(message='{self.message or ''}', "
            f"error_code={self.error_code}, "
            f"http_status_code={self.http_status_code})"
        )
