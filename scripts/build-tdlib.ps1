# Build TDLib (tdjson.dll) from tools-tele/td-master for Windows runtime
# Requirements:
#   - Windows 10+
#   - CMake >= 3.0
#   - Visual Studio 2019+ with C++ build tools
#   - Git for Windows

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Try to detect layout: monorepo vs standalone
$TdSourceDir = $null
$InstallDir = Join-Path $ProjectRoot "vendor\tdlib"

# Check vendored source (unified layout)
if (Test-Path (Join-Path $ProjectRoot "vendor\tdlib\source")) {
    $TdSourceDir = Join-Path $ProjectRoot "vendor\tdlib\source"
} elseif ($env:TDLIB_SOURCE_DIR) {
    $TdSourceDir = $env:TDLIB_SOURCE_DIR
} else {
    Write-Host "[build-tdlib] ERROR: Could not locate TDLib source directory" -ForegroundColor Red
    Write-Host "[build-tdlib] Expected at vendor\tdlib\source" -ForegroundColor Red
    Write-Host "[build-tdlib] Set TDLIB_SOURCE_DIR environment variable to specify custom path" -ForegroundColor Red
    exit 1
}

$BuildDir = Join-Path $TdSourceDir "build"

Write-Host "[build-tdlib] Project root:    $ProjectRoot"
Write-Host "[build-tdlib] TDLib source:    $TdSourceDir"
Write-Host "[build-tdlib] Build directory: $BuildDir"
Write-Host "[build-tdlib] Install to:      $InstallDir"

if (-not (Test-Path $TdSourceDir)) {
    Write-Host "[build-tdlib] ERROR: TDLib source directory not found at $TdSourceDir" -ForegroundColor Red
    exit 1
}

# Create directories
New-Item -ItemType Directory -Force -Path $BuildDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $InstallDir "lib") | Out-Null

Push-Location $BuildDir

Write-Host "[build-tdlib] Configuring CMake..."
cmake `
    -DCMAKE_BUILD_TYPE=Release `
    -DCMAKE_INSTALL_PREFIX="$InstallDir" `
    -DTD_ENABLE_LTO=OFF `
    -DTD_INSTALL_STATIC_LIBRARIES=OFF `
    -DTD_INSTALL_SHARED_LIBRARIES=ON `
    -G "Visual Studio 17 2022" `
    -A x64 `
    ..

if ($LASTEXITCODE -ne 0) {
    Write-Host "[build-tdlib] ERROR: CMake configuration failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "[build-tdlib] Building TDLib..."
cmake --build . --config Release --target tdjson

if ($LASTEXITCODE -ne 0) {
    Write-Host "[build-tdlib] ERROR: Build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "[build-tdlib] Copying tdjson.dll to vendor directory..."
$DllPath = Join-Path $BuildDir "Release\tdjson.dll"
if (Test-Path $DllPath) {
    Copy-Item $DllPath (Join-Path $InstallDir "lib\tdjson.dll") -Force
    Write-Host "[build-tdlib] Done. Shared library is in: $(Join-Path $InstallDir 'lib')"
} else {
    Write-Host "[build-tdlib] ERROR: tdjson.dll not found in build directory." -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
