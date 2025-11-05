#!/bin/bash

# 🧪 Testing Script for E-commerce Admin
# Usage: ./test.sh [test-type]
# Test types: all, health, api, performance, security

set -e

TEST_TYPE=${1:-all}
BASE_URL=${2:-http://localhost}

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Counter for test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_status "Running: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ "$expected_result" = "pass" ] || [ -z "$expected_result" ]; then
            print_success "$test_name"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            print_error "$test_name (unexpected pass)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        if [ "$expected_result" = "fail" ]; then
            print_success "$test_name (expected failure)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            print_error "$test_name"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    fi
}

# Function to test HTTP endpoint
test_endpoint() {
    local endpoint="$1"
    local expected_status="${2:-200}"
    local test_name="$3"
    
    if [ -z "$test_name" ]; then
        test_name="GET $endpoint"
    fi
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" || echo "000")
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$test_name (HTTP $status_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        print_error "$test_name (HTTP $status_code, expected $expected_status)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Health Tests
health_tests() {
    echo ""
    print_status "=== HEALTH TESTS ==="
    
    test_endpoint "/api/health" "200" "Health Check"
    test_endpoint "/" "200" "Home Page"
    test_endpoint "/robots.txt" "200" "Robots.txt"
    test_endpoint "/favicon.ico" "200" "Favicon"
}

# API Tests
api_tests() {
    echo ""
    print_status "=== API TESTS ==="
    
    # Public API endpoints
    test_endpoint "/api/categories" "200" "Categories API"
    test_endpoint "/api/products" "200" "Products API"
    test_endpoint "/api/banners" "200" "Banners API"
    
    # Check API response content
    print_status "Testing API response content..."
    
    # Test categories API response structure
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    categories_response=$(curl -s "$BASE_URL/api/categories" | jq -r 'type' 2>/dev/null || echo "invalid")
    if [ "$categories_response" = "array" ] || [ "$categories_response" = "object" ]; then
        print_success "Categories API returns valid JSON"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_error "Categories API returns invalid JSON"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Test products API response structure
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    products_response=$(curl -s "$BASE_URL/api/products" | jq -r 'type' 2>/dev/null || echo "invalid")
    if [ "$products_response" = "array" ] || [ "$products_response" = "object" ]; then
        print_success "Products API returns valid JSON"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_error "Products API returns invalid JSON"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Test protected endpoints (should return 401 without auth)
    test_endpoint "/api/profile" "401" "Profile API (unauthenticated)"
    test_endpoint "/api/users" "401" "Users API (unauthenticated)"
    test_endpoint "/api/wishlist" "401" "Wishlist API (unauthenticated)"
}

# Page Tests
page_tests() {
    echo ""
    print_status "=== PAGE TESTS ==="
    
    # Test all the footer pages we created
    test_endpoint "/customer-service" "200" "Customer Service Page"
    test_endpoint "/contact-us" "200" "Contact Us Page"
    test_endpoint "/faqs" "200" "FAQs Page"
    test_endpoint "/shipping-policy" "200" "Shipping Policy Page"
    test_endpoint "/returns-exchanges" "200" "Returns & Exchanges Page"
    test_endpoint "/order-tracking" "200" "Order Tracking Page"
    test_endpoint "/size-guide" "200" "Size Guide Page"
    test_endpoint "/gift-cards" "200" "Gift Cards Page"
    
    # Test other pages
    test_endpoint "/products" "200" "Products Page"
    test_endpoint "/Authentication" "200" "Authentication Page"
    test_endpoint "/profile" "200" "Profile Page"
    test_endpoint "/wishlist" "200" "Wishlist Page"
    
    # Test 404 page
    test_endpoint "/this-page-does-not-exist" "404" "404 Page"
}

# Performance Tests
performance_tests() {
    echo ""
    print_status "=== PERFORMANCE TESTS ==="
    
    # Test response times
    print_status "Testing response times..."
    
    endpoints=("/" "/api/health" "/api/products" "/api/categories")
    
    for endpoint in "${endpoints[@]}"; do
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        response_time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL$endpoint")
        response_time_ms=$(echo "$response_time * 1000" | bc)
        
        if (( $(echo "$response_time < 2.0" | bc -l) )); then
            print_success "$endpoint (${response_time_ms%.*}ms)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_warning "$endpoint (${response_time_ms%.*}ms - slow)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    done
    
    # Test concurrent requests
    print_status "Testing concurrent requests..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    start_time=$(date +%s.%N)
    for i in {1..5}; do
        curl -s "$BASE_URL/api/health" > /dev/null &
    done
    wait
    end_time=$(date +%s.%N)
    
    duration=$(echo "$end_time - $start_time" | bc)
    if (( $(echo "$duration < 3.0" | bc -l) )); then
        print_success "Concurrent requests handled in ${duration}s"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_warning "Concurrent requests took ${duration}s"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Security Tests
security_tests() {
    echo ""
    print_status "=== SECURITY TESTS ==="
    
    # Test security headers
    print_status "Testing security headers..."
    
    headers_response=$(curl -s -I "$BASE_URL/" || echo "")
    
    security_headers=("X-Frame-Options" "X-Content-Type-Options" "X-XSS-Protection")
    
    for header in "${security_headers[@]}"; do
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        if echo "$headers_response" | grep -i "$header" > /dev/null; then
            print_success "$header header present"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_warning "$header header missing"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    done
    
    # Test rate limiting (if configured)
    print_status "Testing rate limiting..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    rate_limit_hit=false
    for i in {1..20}; do
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/products")
        if [ "$status_code" = "429" ]; then
            rate_limit_hit=true
            break
        fi
        sleep 0.1
    done
    
    if [ "$rate_limit_hit" = true ]; then
        print_success "Rate limiting is working"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_warning "Rate limiting not detected (may not be configured)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Docker Tests
docker_tests() {
    echo ""
    print_status "=== DOCKER TESTS ==="
    
    # Check if containers are running
    containers=("ecom-admin-app" "ecom-admin-nginx" "ecom-admin-redis")
    
    for container in "${containers[@]}"; do
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        if docker ps --format "table {{.Names}}" | grep -q "$container"; then
            print_success "$container is running"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_error "$container is not running"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    done
    
    # Check container health
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    app_health=$(docker inspect --format='{{.State.Health.Status}}' ecom-admin-app 2>/dev/null || echo "no-health-check")
    if [ "$app_health" = "healthy" ]; then
        print_success "App container is healthy"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    elif [ "$app_health" = "no-health-check" ]; then
        print_warning "App container has no health check"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    else
        print_error "App container is unhealthy: $app_health"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Test Redis connection
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if docker exec ecom-admin-redis redis-cli ping > /dev/null 2>&1; then
        print_success "Redis is responding"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_error "Redis is not responding"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to print test summary
print_summary() {
    echo ""
    echo "=============================================="
    print_status "TEST SUMMARY"
    echo "=============================================="
    echo "Total Tests: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_success "ALL TESTS PASSED! 🎉"
        exit 0
    else
        print_error "SOME TESTS FAILED! ❌"
        echo ""
        echo "Please check the failed tests above and:"
        echo "1. Verify all services are running"
        echo "2. Check container logs: docker-compose logs"
        echo "3. Verify environment configuration"
        echo "4. Check network connectivity"
        exit 1
    fi
}

# Main execution
echo "🧪 Testing E-commerce Admin Application"
echo "Base URL: $BASE_URL"
echo "Test Type: $TEST_TYPE"
echo ""

# Check if the base URL is accessible
if ! curl -s "$BASE_URL" > /dev/null; then
    print_error "Cannot connect to $BASE_URL"
    print_status "Please ensure the application is running and accessible"
    exit 1
fi

# Run tests based on type
case $TEST_TYPE in
    "health")
        health_tests
        ;;
    "api")
        api_tests
        ;;
    "pages")
        page_tests
        ;;
    "performance")
        performance_tests
        ;;
    "security")
        security_tests
        ;;
    "docker")
        docker_tests
        ;;
    "all")
        health_tests
        api_tests
        page_tests
        performance_tests
        security_tests
        docker_tests
        ;;
    *)
        echo "Invalid test type: $TEST_TYPE"
        echo "Available types: all, health, api, pages, performance, security, docker"
        exit 1
        ;;
esac

print_summary