# Inicia Expo en modo interactivo (muestra el QR en esta ventana)
$env:Path = "C:\Program Files\nodejs;" + $env:Path
$env:CI = ""
Set-Location $PSScriptRoot
Write-Host ""
Write-Host "=== Convivio - Expo ===" -ForegroundColor Cyan
Write-Host "Cuando arranque, veras el codigo QR en ESTA ventana." -ForegroundColor Yellow
Write-Host "Tambien puedes abrir en el navegador: http://localhost:8081" -ForegroundColor Gray
Write-Host ""
npm start
