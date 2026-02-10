# Dockerfile for telegram-tool-backend (unified project)
# Build context: project root (.)

# Stage 1: Build TDLib from vendored source
FROM ubuntu:22.04 AS tdlib-builder

ENV DEBIAN_FRONTEND=noninteractive

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    g++ \
    libssl-dev \
    zlib1g-dev \
    gperf \
    make \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy TDLib source from vendored directory
COPY vendor/tdlib/source /build/tdlib-source

RUN mkdir -p /build/tdlib-source/build && \
    cd /build/tdlib-source/build && \
    cmake \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_INSTALL_PREFIX=/build/output \
        -DTD_ENABLE_LTO=OFF \
        -DTD_INSTALL_STATIC_LIBRARIES=OFF \
        -DTD_INSTALL_SHARED_LIBRARIES=ON \
        .. && \
    cmake --build . --target tdjson --config Release -- -j$(nproc || echo 4) && \
    mkdir -p /build/output/lib && \
    (cp libtdjson.so /build/output/lib/libtdjson.so 2>/dev/null || \
     cp libtdjson.dylib /build/output/lib/libtdjson.dylib 2>/dev/null || \
     (echo "ERROR: libtdjson not found" && exit 1))

# Stage 2: Node.js application builder
FROM node:20-slim AS app-builder

WORKDIR /app

# Install build dependencies for native addon
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY native ./native
COPY prisma ./prisma
COPY scripts ./scripts

# Copy TDLib library from builder for native addon linking
COPY --from=tdlib-builder /build/output/lib/libtdjson.so ./vendor/tdlib/lib/libtdjson.so

# Build native addon
RUN npm run build:tdlib-addon || echo "Warning: Native addon build failed, may need libtdjson.so"

# Build TypeScript
RUN npm run build

# Stage 3: Runtime
FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    zlib1g \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application
COPY --from=app-builder /app/dist ./dist
COPY --from=app-builder /app/node_modules ./node_modules
COPY --from=app-builder /app/package*.json ./
COPY --from=app-builder /app/native ./native
COPY --from=app-builder /app/prisma ./prisma

# Copy TDLib library from builder stage
COPY --from=tdlib-builder /build/output/lib/libtdjson.so /app/vendor/tdlib/lib/libtdjson.so

# Create directory structure
RUN mkdir -p /app/vendor/tdlib/lib

# Set environment variables
ENV LD_LIBRARY_PATH=/app/vendor/tdlib/lib:${LD_LIBRARY_PATH}
ENV TDLIB_LIBRARY_PATH=/app/vendor/tdlib/lib/libtdjson.so
ENV TDLIB_ADDON_PATH=/app/native/tdlib/build/Release/tdlib.node

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "run", "start:prod"]
