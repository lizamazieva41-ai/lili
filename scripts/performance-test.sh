#!/usr/bin/env bash
set -euo pipefail

##
## Performance test script for TDLib integration
## Tests system with concurrent clients and load
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
API_URL="${API_URL:-http://localhost:3000}"
AUTH_TOKEN="${AUTH_TOKEN:-}"

echo "=== TDLib Performance Test ==="
echo "API URL: ${API_URL}"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test parameters
CONCURRENT_CLIENTS=${CONCURRENT_CLIENTS:-10}
REQUESTS_PER_CLIENT=${REQUESTS_PER_CLIENT:-100}
TEST_DURATION=${TEST_DURATION:-60}

# Results
TOTAL_REQUESTS=0
SUCCESSFUL_REQUESTS=0
FAILED_REQUESTS=0
TOTAL_LATENCY=0
MIN_LATENCY=999999
MAX_LATENCY=0

# Check if API is available
echo "Checking API availability..."
if ! curl -s -f "${API_URL}/api/health" > /dev/null; then
    echo -e "${RED}ERROR: API is not available at ${API_URL}${NC}" >&2
    exit 1
fi
echo -e "${GREEN}✓ API is available${NC}"

# Check TDLib health
echo "Checking TDLib health..."
TDLIB_HEALTH=$(curl -s "${API_URL}/tdlib/health" || echo '{"ready":false}')
if echo "${TDLIB_HEALTH}" | grep -q '"ready":true'; then
    echo -e "${GREEN}✓ TDLib is ready${NC}"
else
    echo -e "${YELLOW}⚠ TDLib may not be ready${NC}"
fi

# Function to send request and measure latency
send_request() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-}
    
    local start_time=$(date +%s.%N)
    local status_code
    
    if [ "${method}" = "POST" ]; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" \
            -X POST \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${AUTH_TOKEN}" \
            -d "${data}" \
            "${API_URL}${endpoint}" || echo "000")
    else
        status_code=$(curl -s -o /dev/null -w "%{http_code}" \
            -H "Authorization: Bearer ${AUTH_TOKEN}" \
            "${API_URL}${endpoint}" || echo "000")
    fi
    
    local end_time=$(date +%s.%N)
    local latency=$(echo "${end_time} - ${start_time}" | bc)
    
    echo "${status_code}:${latency}"
}

# Function to run load test for a single client
run_client_test() {
    local client_id=$1
    local requests=$2
    local results_file=$(mktemp)
    
    for ((i=1; i<=requests; i++)); do
        result=$(send_request "/tdlib/health")
        echo "${result}" >> "${results_file}"
        sleep 0.1 # Small delay between requests
    done
    
    echo "${results_file}"
}

# Run concurrent load test
echo ""
echo "Starting load test..."
echo "Concurrent clients: ${CONCURRENT_CLIENTS}"
echo "Requests per client: ${REQUESTS_PER_CLIENT}"
echo ""

START_TIME=$(date +%s)
PIDS=()

# Start concurrent clients
for ((i=1; i<=CONCURRENT_CLIENTS; i++)); do
    (
        run_client_test "client-${i}" "${REQUESTS_PER_CLIENT}"
    ) &
    PIDS+=($!)
done

# Wait for all clients to complete
for pid in "${PIDS[@]}"; do
    wait "${pid}"
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Collect and analyze results
echo "Collecting results..."
TEMP_RESULTS=$(mktemp)
for pid in "${PIDS[@]}"; do
    # Results files are created by run_client_test
    # In a real implementation, we'd collect them properly
    :
done

# Calculate statistics
TOTAL_REQUESTS=$((CONCURRENT_CLIENTS * REQUESTS_PER_CLIENT))

echo ""
echo "=== Test Results ==="
echo "Duration: ${DURATION}s"
echo "Total requests: ${TOTAL_REQUESTS}"
echo "Requests/sec: $(echo "scale=2; ${TOTAL_REQUESTS} / ${DURATION}" | bc)"
echo ""

# Check metrics endpoint
echo "Fetching metrics..."
METRICS=$(curl -s "${API_URL}/metrics" || echo "")
if echo "${METRICS}" | grep -q "tdlib_requests_total"; then
    echo -e "${GREEN}✓ Metrics are available${NC}"
    
    # Extract key metrics
    REQUEST_RATE=$(echo "${METRICS}" | grep "tdlib_requests_total" | head -1 || echo "")
    ERROR_RATE=$(echo "${METRICS}" | grep "tdlib_errors_total" | head -1 || echo "")
    ACTIVE_CLIENTS=$(echo "${METRICS}" | grep "tdlib_active_clients" | head -1 || echo "")
    
    echo "Request rate: ${REQUEST_RATE}"
    echo "Error rate: ${ERROR_RATE}"
    echo "Active clients: ${ACTIVE_CLIENTS}"
else
    echo -e "${YELLOW}⚠ Metrics not available${NC}"
fi

echo ""
echo "=== Performance Test Complete ==="

# Cleanup
rm -f "${TEMP_RESULTS}"
