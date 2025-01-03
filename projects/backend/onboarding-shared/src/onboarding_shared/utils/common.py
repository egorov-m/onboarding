from datetime import datetime
from uuid import uuid4


def generate_id() -> str:
    return str(uuid4())


def get_current_datetime() -> datetime:
    return datetime.utcnow()
