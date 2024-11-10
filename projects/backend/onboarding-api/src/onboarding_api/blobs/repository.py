from typing import Optional, AsyncGenerator

from onboarding_shared.schemas import protocol
from onboarding_shared import utils

from ..config import S3_BUCKETS
from ..database import database, queries


class BlobRepository:

    @classmethod
    async def create_blob(cls, board_step_id: str, type: protocol.BlobType):
        blob_id = utils.generate_id()
        bucket_name = utils.get_bucket_name(type, S3_BUCKETS)
        s3_link = utils.canonical_s3_link(
            bucket_name=bucket_name,
            step_id=board_step_id,
            blob_id=blob_id,
            type=type
        )
        create_query = queries.create_blob_query(
            blob_id,
            type=utils.int_from_enum(type),
            s3_link=s3_link,
        )
        blob_record = await database.fetch_one(query=create_query)
        attach_query = queries.attach_blob_board_step_query(board_step_id, blob_id)
        await database.fetch_one(query=attach_query)

        return blob_record

    @classmethod
    async def update_blob(
            cls,
            blob_id: str,
            *,
            type: Optional[protocol.BlobType] = None,
            s3_link: Optional[str] = None,
    ):
        update_query = queries.update_blob_query(blob_id, type=type, s3_link=s3_link)
        blob_record = await database.fetch_one(query=update_query)

        return blob_record

    @classmethod
    async def delete_blob(cls, blob_id: str):
        detach_query = queries.detach_blob_by_id_board_step_query(blob_id)
        await database.fetch_one(query=detach_query)
        delete_query = queries.delete_blob_query(blob_id)
        blob_record = await database.fetch_one(query=delete_query)

        return blob_record

    @classmethod
    async def reattach(cls, blob_id: str, old_board_step_id: str, new_board_step_id: str):
        detach_query = queries.detach_blob_board_step_query(old_board_step_id, blob_id)
        await database.fetch_one(query=detach_query)
        attach_query = queries.attach_blob_board_step_query(new_board_step_id, blob_id)
        await database.fetch_one(query=attach_query)

    @classmethod
    async def delete_blobs_by_board_step(cls, board_step_id: int):
        batch_size = 100
        blobs_iterator = await cls.get_blobs(board_step_id)
        blobs_list = []
        async for blob in blobs_iterator:
            blobs_list.append(blob)
        delete_attach_query = queries.detach_all_blobs_for_board_step_query(board_step_id)
        await database.execute(delete_attach_query)
        for i in range(0, len(blobs_list), batch_size):
            batch = (blob["id"] for blob in blobs_list[i: i + batch_size])
            delete_batch_query = queries.delete_blobs_board_step_query(batch)
            await database.execute(delete_batch_query)

        return blobs_list

    @classmethod
    async def get_blobs(cls, board_step_id: str) -> AsyncGenerator:
        get_query = queries.get_list_blobs_query(board_step_id)
        blob_records_iterator = database.iterate(query=get_query)

        return blob_records_iterator

    @classmethod
    async def get_blob(cls, blob_id: str):
        get_query = queries.get_blob_by_id_query(blob_id)
        blob_record = await database.fetch_one(query=get_query)

        return blob_record

    @classmethod
    async def get_count_attached_blob(cls, board_step_id: str) -> int:
        get_query = queries.count_attached_blob_board_step_query(board_step_id)
        val = await database.fetch_val(query=get_query)

        return val

    @classmethod
    async def check_attached_blob(cls, board_step_id: str, blob_id: str) -> bool:
        get_query = queries.get_attached_blob_board_step_query(board_step_id, blob_id)
        record = await database.fetch_one(get_query)

        return bool(record)
