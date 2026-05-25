#!/bin/sh
# Runs as part of the nginx official image's /docker-entrypoint.d/ sequence,
# before nginx starts. Copies a mounted secrets file to config.json if present.
#
# To change injection behaviour, override this file in docker-compose:
#   volumes:
#     - ./my-inject.sh:/docker-entrypoint.d/40-runtime-config.sh:ro
set -e

SECRET_CONFIG_PATH="${SECRET_CONFIG_PATH:-[[ secret_config_path ]]}"

if [ -f "$SECRET_CONFIG_PATH" ]; then
    echo "[runtime-config] Loading from $SECRET_CONFIG_PATH"
    cp "$SECRET_CONFIG_PATH" /usr/share/nginx/html/config.json
else
    echo "[runtime-config] No file at $SECRET_CONFIG_PATH — using default config"
fi
