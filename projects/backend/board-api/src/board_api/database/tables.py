from sqlalchemy import (
    Table,
    Column,
    func,
    Uuid,
    String,
    Float,
    SmallInteger,
    DateTime,
    Boolean,
    ForeignKey,
)

from .core import metadata


board_table = Table(
    "board", metadata,
    Column("id", Uuid, primary_key=True),
    Column("name", String(256), nullable=False),
    Column("average_rating", Float, nullable=False),
    Column("status", SmallInteger, nullable=False),
    Column("is_deleted", Boolean, nullable=False),
    Column("created_at", DateTime(timezone=False), server_default=func.now(), nullable=False),
    Column("updated_at", DateTime(timezone=False), server_default=func.now(), nullable=False),

    Column("owner_id", Uuid, nullable=False)
)

board_step_table = Table(
    "board_step", metadata,
    Column("id", Uuid, primary_key=True),
    Column("type", SmallInteger, nullable=False),
    Column("title", String(256), nullable=False),
    Column("text", String(4096), nullable=True),
    Column("created_at", DateTime(timezone=False), server_default=func.now(), nullable=False),
    Column("updated_at", DateTime(timezone=False), server_default=func.now(), nullable=False),
    Column("index", SmallInteger, nullable=False),

    Column("board_id", Uuid, ForeignKey("board.id"), nullable=False),
)

blob_table = Table(
    "blob", metadata,
    Column("id", Uuid, primary_key=True),
    Column("type", SmallInteger, nullable=False),
    Column("s3_link", String(2048), nullable=False),
    Column("created_at", DateTime(timezone=False), server_default=func.now(), nullable=False),
    Column("updated_at", DateTime(timezone=False), server_default=func.now(), nullable=False),
)

board_step_blob_table = Table(
    "board_step_blob", metadata,

    Column("board_step_id", Uuid, ForeignKey("board_step.id"), nullable=False),
    Column("blob_id", Uuid, ForeignKey("blob.id"), nullable=False),
)
