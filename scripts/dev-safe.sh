#!/usr/bin/env bash
set -euo pipefail

unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy
unset npm_config_http_proxy npm_config_https_proxy
unset YARN_HTTP_PROXY YARN_HTTPS_PROXY

echo "[reserveLink] Running npm install without proxy env vars..."
npm install

echo "[reserveLink] Starting dev server..."
npm run dev
