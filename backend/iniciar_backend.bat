@echo off
echo Preparando entorno del backend...

if not exist venv\Scripts\activate.bat (
    echo Creando entorno virtual...
    python -m venv venv
)

call venv\Scripts\activate
echo Instalando dependencias...
pip install -q -r requirements.txt
echo.
echo Iniciando servidor Flask...
python run.py
