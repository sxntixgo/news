#!/bin/bash
# news devcontainer setup, run on create by the shared /opt/devcontainer/install.sh. Idempotent.
set -euo pipefail
# .venv is a Docker volume (devcontainer.json): the host folder's venv stays untouched.
sudo chown "$(id -u):$(id -g)" .venv
uv venv --allow-existing --python 3.11 .venv          # the Dockerfile's and CI's Python
uv pip install --python .venv/bin/python -q -r requirements.txt
# Tests need a real Postgres 16 (CI: postgres:16-alpine service); TEST_DATABASE_URL is set in devcontainer.json.
/opt/devcontainer/bin/pg-setup 16 betterread betterread betterread
echo "news: ready — tests: .venv/bin/pytest tests/"
