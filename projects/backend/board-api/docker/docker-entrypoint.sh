#!/bin/sh

set -e

. /opt/pysetup/.venv/bin/activate
gunicorn -c=/usr/onboarding/board-api/bin/run.py board_api.main:router
