#!/usr/bin/env pwsh
# PowerShell script to start PHP Email API server
Write-Host "Starting PHP Email API server..." -ForegroundColor Green
Set-Location email-api-php
Write-Host "Changed to email-api-php directory" -ForegroundColor Yellow
Write-Host "Starting PHP server on localhost:3001..." -ForegroundColor Yellow
php -S localhost:3001 public/index.php 