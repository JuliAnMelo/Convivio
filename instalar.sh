#!/usr/bin/env bash
set -e

echo ""
echo "=== Convivio - Instalacion ==="
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js no esta instalado."
  echo "Descargalo desde: https://nodejs.org/"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm no esta disponible."
  exit 1
fi

echo "Node: $(node -v)"
echo "npm:  $(npm -v)"
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONT_DIR="$SCRIPT_DIR/front"

if [ ! -d "$FRONT_DIR" ]; then
  echo "ERROR: No se encuentra la carpeta 'front'."
  exit 1
fi

cd "$FRONT_DIR"
echo "Instalando dependencias en front/ ..."
npm install

echo ""
echo "Instalacion completada."
echo ""
echo "Para iniciar la app:"
echo "  cd front"
echo "  npm start"
echo ""
