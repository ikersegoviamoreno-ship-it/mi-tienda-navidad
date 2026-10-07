#!/usr/bin/env bash
# Quita los puntitos blancos ("nieve"): apertura morfológica (erosión x2 + dilatación x2) y mediana suave, entrando poco a poco.
# Uso: clean_speckles.sh entrada.mp4 salida.mp4 <modo> <desde> <hasta>
#   modo in : el filtro entra de 0 a 100 % entre los fotogramas <desde> y <hasta> (final del clip limpio)
#   modo out: el filtro sale de 100 a 0 % entre <desde> y <hasta> (principio del clip limpio)
set -euo pipefail
in=$1; out=$2; mode=$3; a=$4; b=$5
if [ "$mode" = in ]; then k="clip((N-$a)/($b-$a),0,1)"; else k="1-clip((N-$a)/($b-$a),0,1)"; fi
ffmpeg -v error -y -i "$in" -filter_complex \
  "[0:v]split[a][b];[b]erosion,erosion,dilation,dilation,median=radius=1[m];[a][m]blend=all_expr='A*(1-($k))+B*($k)',format=yuv420p" \
  -c:v libx264 -crf 14 -preset slow -an "$out"
