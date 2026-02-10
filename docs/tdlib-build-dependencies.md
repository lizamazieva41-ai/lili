# TDLib Build Dependencies and Configuration

## Overview

This document describes the dependencies, build configuration, and optimal CMake flags for building TDLib from `tools-tele/td-master`.

## System Requirements

### Operating System
- **Recommended**: Ubuntu 22.04 LTS (x86_64)
- **Minimum**: Linux with glibc 2.31+
- **Alternative**: macOS 12+ (for development)

### Build Tools

| Tool | Minimum Version | Recommended Version | Package Name (Ubuntu) |
|------|-----------------|---------------------|----------------------|
| CMake | 3.10 | 3.24+ | `cmake` |
| C++ Compiler | GCC 7+ or Clang 10+ | GCC 11+ or Clang 14+ | `build-essential`, `g++` |
| Make | 4.0+ | 4.3+ | `make` |
| Ninja (optional) | 1.8+ | 1.11+ | `ninja-build` |
| ccache (optional) | 3.4+ | 4.8+ | `ccache` |

### Runtime Dependencies

| Library | Minimum Version | Package Name (Ubuntu) |
|---------|----------------|----------------------|
| OpenSSL | 1.1.1 | `libssl3`, `libssl-dev` |
| zlib | 1.2.11 | `zlib1g`, `zlib1g-dev` |
| gperf | 3.0+ | `gperf` |

### Development Dependencies

- Git (for cloning and version detection)
- ca-certificates (for HTTPS connections)

## CMake Configuration

### Recommended CMake Flags

```bash
cmake \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_INSTALL_PREFIX=/path/to/install \
  -DTD_ENABLE_LTO=OFF \
  -DTD_INSTALL_STATIC_LIBRARIES=OFF \
  -DTD_INSTALL_SHARED_LIBRARIES=ON \
  ..
```

### Flag Descriptions

| Flag | Value | Description |
|------|-------|-------------|
| `CMAKE_BUILD_TYPE` | `Release` | Optimized build for production |
| `CMAKE_INSTALL_PREFIX` | Custom path | Installation directory |
| `TD_ENABLE_LTO` | `OFF` | Disable Link Time Optimization (faster builds) |
| `TD_INSTALL_STATIC_LIBRARIES` | `OFF` | Don't install static libraries |
| `TD_INSTALL_SHARED_LIBRARIES` | `ON` | Install shared library (libtdjson.so) |

### Build Targets

- **tdjson**: Shared library (`libtdjson.so`) - **Primary target**
- **tdjson_static**: Static library (`libtdjson.a`) - Optional
- **td_client_json**: Example client - Optional

### Build Command

```bash
cmake --build . --target tdjson --config Release -- -j$(nproc)
```

## Build Process

### Step 1: Validate Environment

```bash
cd tools-tele/telegram-platform-backend
./scripts/validate-build-environment.sh
```

### Step 2: Build TDLib

**Option A: Using build script**
```bash
cd tools-tele/telegram-platform-backend
./scripts/build-tdlib.sh
```

**Option B: Using Docker**
```bash
cd tools-tele
docker build -f telegram-platform-backend/Dockerfile.tdlib-build -t tdlib-builder .
```

**Option C: Manual build**
```bash
cd tools-tele/td-master
mkdir -p build && cd build
cmake -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_INSTALL_PREFIX=../../telegram-platform-backend/native/vendor/tdlib \
      -DTD_ENABLE_LTO=OFF \
      -DTD_INSTALL_STATIC_LIBRARIES=OFF \
      -DTD_INSTALL_SHARED_LIBRARIES=ON \
      ..
cmake --build . --target tdjson --config Release -- -j$(nproc)
cp libtdjson.so ../../telegram-platform-backend/native/vendor/tdlib/lib/
```

### Step 3: Verify Build

```bash
cd tools-tele/telegram-platform-backend
./scripts/verify-tdlib-build.sh
```

## Build Output

### Expected Files

After successful build, the following files should exist:

```
tools-tele/telegram-platform-backend/native/vendor/tdlib/
└── lib/
    └── libtdjson.so  # Shared library (~10-50MB)
```

### Library Information

- **File size**: ~10-50 MB (depending on build options)
- **Architecture**: x86_64 (Linux) or arm64/x86_64 (macOS)
- **Dependencies**: OpenSSL, zlib
- **Symbols**: Exports `td_json_client_*` functions

## Build Optimization

### Using ccache

ccache can significantly speed up rebuilds:

```bash
# Install ccache
sudo apt-get install ccache

# CMake will automatically detect and use ccache
cmake ...
```

### Parallel Builds

Use `-j` flag to utilize all CPU cores:

```bash
cmake --build . --target tdjson --config Release -- -j$(nproc)
```

### Build Time Estimates

| Configuration | Build Time (First Build) | Build Time (Rebuild) |
|--------------|-------------------------|---------------------|
| Without ccache | 20-40 minutes | 20-40 minutes |
| With ccache | 20-40 minutes | 2-5 minutes |
| Docker (cached) | 5-10 minutes | 1-2 minutes |

## Troubleshooting

### Common Issues

#### 1. CMake version too old
```
Error: CMake 3.10 or higher is required
```
**Solution**: Upgrade CMake
```bash
sudo apt-get update
sudo apt-get install cmake
```

#### 2. Missing OpenSSL development headers
```
Error: Could not find OpenSSL
```
**Solution**: Install OpenSSL development package
```bash
sudo apt-get install libssl-dev
```

#### 3. Missing zlib development headers
```
Error: Could not find zlib
```
**Solution**: Install zlib development package
```bash
sudo apt-get install zlib1g-dev
```

#### 4. Out of memory during build
```
Error: g++: fatal error: Killed signal terminated program cc1plus
```
**Solution**: Reduce parallel jobs or increase swap
```bash
cmake --build . --target tdjson --config Release -- -j2
```

#### 5. Library not found at runtime
```
Error: libtdjson.so: cannot open shared object file
```
**Solution**: Set LD_LIBRARY_PATH
```bash
export LD_LIBRARY_PATH=/path/to/lib:$LD_LIBRARY_PATH
```

## Version Management

### Checking TDLib Version

```bash
cd tools-tele/td-master
cat tdlib-version.json
```

### Version File Format

```json
{
  "version": "1.8.60",
  "commit": "abc123def456..."
}
```

## CI/CD Integration

### GitHub Actions

The build is automated via `.github/workflows/build-tdlib.yml`:

- Triggers on changes to `td-master/` or build scripts
- Builds Docker image with TDLib
- Publishes artifacts
- Sends notifications on failure

### Artifact Storage

- **Docker Registry**: `ghcr.io/<org>/tdlib-builder`
- **GitHub Artifacts**: `libtdjson.so` and `tdlib.node`
- **Retention**: 30 days

## References

- [TDLib Documentation](https://core.telegram.org/tdlib)
- [CMake Documentation](https://cmake.org/documentation/)
- [TDLib Build Instructions](https://github.com/tdlib/td#building)
