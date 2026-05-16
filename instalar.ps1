# Convivio - Instalador para Windows
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Convivio - Instalacion ===" -ForegroundColor Cyan
Write-Host ""

# Node en PATH habitual de Windows
$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    $env:Path = "$nodePath;$env:Path"
}

function Test-Command($name) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    return $null -ne $cmd
}

if (-not (Test-Command "node")) {
    Write-Host "ERROR: Node.js no esta instalado." -ForegroundColor Red
    Write-Host "Descargalo desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "ERROR: npm no esta disponible." -ForegroundColor Red
    exit 1
}

Write-Host "Node: $(node -v)" -ForegroundColor Green
Write-Host "npm:  $(npm -v)" -ForegroundColor Green
Write-Host ""

$frontDir = Join-Path $PSScriptRoot "front"
if (-not (Test-Path $frontDir)) {
    Write-Host "ERROR: No se encuentra la carpeta 'front'." -ForegroundColor Red
    exit 1
}

Set-Location $frontDir
Write-Host "Instalando dependencias en front/ ..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install fallo." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Instalacion completada." -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar la app:" -ForegroundColor Yellow
Write-Host "  cd front" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
