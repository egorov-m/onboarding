#!/bin/sh

set -e

. /opt/pysetup/.venv/bin/activate
alembic -c /usr/onboarding/onboarding-api/alembic.ini upgrade head
gunicorn -c=/usr/onboarding/onboarding-api/bin/run.py onboarding_api.main:router
