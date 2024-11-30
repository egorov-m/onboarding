from datetime import timedelta

from onboarding_shared.schemas import protocol
from onboarding_shared import utils

from .s3_client import s3_client
from ..config import (
    ONBOARDING_S3_BUCKETS,
    ONBOARDING_S3_PRESIGNED_GET_OBJECT_EXPIRES_MINUTES,
)


def presigned_get_object(step_id: str, blob_id: str, blob_type: protocol.BlobType) -> str:
    return s3_client.presigned_get_object(
        bucket_name=utils.get_bucket_name(blob_type, ONBOARDING_S3_BUCKETS),
        object_name=utils.canonical_object_name(step_id, blob_id, blob_type),
        expires=timedelta(minutes=ONBOARDING_S3_PRESIGNED_GET_OBJECT_EXPIRES_MINUTES)
    )


__all__ = (s3_client, presigned_get_object,)
