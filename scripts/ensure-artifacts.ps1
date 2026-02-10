# Ensure TDLib artifacts are built (Windows version)
# This script checks for and builds required artifacts if missing

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

$TdlibLibPath = Join-Path $ProjectRoot "native\vendor\tdlib\lib\tdjson.dll"
$AddonPath = Join-Path $ProjectRoot "native\tdlib\build\Release\tdlib.node"

$AllPresent = $true

# Check TDLib library
if (-not (Test-Path $TdlibLibPath)) {
    Write-Host "[ensure-artifacts] TDLib library not found: $TdlibLibPath" -ForegroundColor Yellow
    Write-Host "[ensure-artifacts] Building TDLib library..." -ForegroundColor Yellow
    & (Join-Path $ScriptDir "build-tdlib.ps1")
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ensure-artifacts] ERROR: Failed to build TDLib library" -ForegroundColor Red
        $AllPresent = $false
    }
}

# Check native addon
if (-not (Test-Path $AddonPath)) {
    Write-Host "[ensure-artifacts] Native addon not found: $AddonPath" -ForegroundColor Yellow
    Write-Host "[ensure-artifacts] Building native addon..." -ForegroundColor Yellow
    & (Join-Path $ScriptDir "build-tdlib-addon.ps1")
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ensure-artifacts] ERROR: Failed to build native addon" -ForegroundColor Red
        $AllPresent = $false
    }
}

if ($AllPresent -and (Test-Path $TdlibLibPath) -and (Test-Path $AddonPath)) {
    Write-Host "[ensure-artifacts] All artifacts are present:" -ForegroundColor Green
    Write-Host "  - TDLib library: $TdlibLibPath" -ForegroundColor Green
    Write-Host "  - Native addon: $AddonPath" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[ensure-artifacts] ERROR: Some artifacts are missing" -ForegroundColor Red
    exit 1
}
