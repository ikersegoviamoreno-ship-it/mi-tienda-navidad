#!/usr/bin/env bash
# Descarga un resultado de Monid (las URL caducan en ~24 h). Uso: fetch.sh <url> <destino>
set -euo pipefail
curl -fsSL --retry 4 --retry-delay 2 -o "$2" "$1"
echo "$(du -h "$2" | cut -f1)  $2"
