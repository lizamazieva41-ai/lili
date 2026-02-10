# Build TDLib native addon for Windows
# Requirements:
#   - Node.js 18+
#   - node-gyp
#   - Visual Studio 2019+ with C++ build tools
#   - Windows SDK

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$AddonDir = Join-Path $ProjectRoot "native\tdlib"

Write-Host "[build-tdlib-addon] Building native addon..."
Write-Host "[build-tdlib-addon] Addon directory: $AddonDir"

Push-Location $AddonDir

# Check if node-gyp is available
$nodeGyp = Get-Command node-gyp -ErrorAction SilentlyContinue
if (-not $nodeGyp) {
    Write-Host "[build-tdlib-addon] Installing node-gyp globally..." -ForegroundColor Yellow
    npm install -g node-gyp
}

# Configure and build
Write-Host "[build-tdlib-addon] Configuring..."
node-gyp configure

if ($LASTEXITCODE -ne 0) {
    Write-Host "[build-tdlib-addon] ERROR: Configuration failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "[build-tdlib-addon] Building..."
node-gyp build --release

if ($LASTEXITCODE -ne 0) {
    Write-Host "[build-tdlib-addon] ERROR: Build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

$OutputPath = Join-Path $AddonDir "build\Release\tdlib.node"
if (Test-Path $OutputPath) {
    Write-Host "[build-tdlib-addon] Done. Addon is at: $OutputPath"
} else {
    Write-Host "[build-tdlib-addon] ERROR: Addon not found at expected path" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
