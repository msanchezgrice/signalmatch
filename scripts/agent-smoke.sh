#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"

echo "[1/5] public creators"
curl -fsS "$BASE_URL/api/public/creators" >/dev/null

echo "[2/5] public campaigns"
curl -fsS "$BASE_URL/api/public/campaigns" >/dev/null

echo "[3/5] protected resource metadata"
curl -fsS "$BASE_URL/.well-known/oauth-protected-resource/mcp" >/dev/null

echo "[4/5] auth server metadata"
curl -fsS "$BASE_URL/.well-known/oauth-authorization-server" >/dev/null

echo "[5/5] mcp route reachable"
curl -sS -o /dev/null -w "%{http_code}\n" "$BASE_URL/mcp"

echo "smoke checks complete"
