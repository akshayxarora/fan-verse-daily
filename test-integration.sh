#!/bin/bash

# Integration Test Script for GTM Systems Hub
# Tests all major functionality

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  GTM Systems Hub - Integration Tests"
echo "=========================================="
echo ""

# Test counter
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local expected_status=$4
    local data=$5
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url")
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} $name: $response"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $name: Expected $expected_status, got $response"
        ((FAILED++))
        return 1
    fi
}

# Test function with content check
test_endpoint_content() {
    local name=$1
    local url=$2
    local expected_content=$3
    
    content=$(curl -s "$url")
    if echo "$content" | grep -q "$expected_content"; then
        echo -e "${GREEN}✓${NC} $name: Content found"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $name: Expected content not found"
        ((FAILED++))
        return 1
    fi
}

echo "1. Testing Frontend Pages..."
echo "----------------------------"
test_endpoint "Homepage" "GET" "$BASE_URL/" "200"
test_endpoint "Blog listing" "GET" "$BASE_URL/blog" "200"
test_endpoint "About page" "GET" "$BASE_URL/about" "200"
test_endpoint "Post detail (sample)" "GET" "$BASE_URL/post/getting-started-with-gtm-engineering" "200"
test_endpoint "404 page" "GET" "$BASE_URL/nonexistent" "404"
echo ""

echo "2. Testing Public API Endpoints..."
echo "-----------------------------------"
test_endpoint "Posts API (published)" "GET" "$BASE_URL/api/posts?status=published" "200"
test_endpoint "Posts API (all)" "GET" "$BASE_URL/api/posts" "200"
test_endpoint "Post by slug API" "GET" "$BASE_URL/api/posts/getting-started-with-gtm-engineering" "200"
test_endpoint "Sitemap" "GET" "$BASE_URL/api/sitemap.xml" "200"
test_endpoint "Robots.txt" "GET" "$BASE_URL/api/robots.txt" "200"
echo ""

echo "3. Testing SEO Features..."
echo "---------------------------"
test_endpoint_content "Sitemap XML format" "$BASE_URL/api/sitemap.xml" "<?xml"
test_endpoint_content "Robots.txt content" "$BASE_URL/api/robots.txt" "User-agent"
test_endpoint_content "Homepage has JSON-LD" "$BASE_URL/" "application/ld+json"
echo ""

echo "4. Testing Admin Endpoints (Unauthenticated)..."
echo "------------------------------------------------"
test_endpoint "Admin login (no credentials)" "POST" "$BASE_URL/api/auth/login" "400"
test_endpoint "Admin me (no token)" "GET" "$BASE_URL/api/auth/me" "401"
test_endpoint "Analytics (no token)" "GET" "$BASE_URL/api/analytics" "401"
test_endpoint "Newsletter subscribers (no token)" "GET" "$BASE_URL/api/newsletter/subscribers" "401"
echo ""

echo "5. Testing Newsletter Endpoints..."
echo "-----------------------------------"
# Use a unique email with timestamp to avoid conflicts
UNIQUE_EMAIL="test-$(date +%s)@example.com"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "{\"email\":\"$UNIQUE_EMAIL\"}" "$BASE_URL/api/newsletter/subscribe")
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓${NC} Newsletter subscribe (valid): $response"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Newsletter subscribe (valid): Expected 200, got $response"
    ((FAILED++))
fi
test_endpoint "Newsletter subscribe (invalid)" "POST" "$BASE_URL/api/newsletter/subscribe" "400" '{"email":"invalid"}'
echo ""

echo "6. Testing Admin Pages (Client-side)..."
echo "----------------------------------------"
test_endpoint "Admin login page" "GET" "$BASE_URL/login" "200"
test_endpoint "Admin dashboard (redirects to login)" "GET" "$BASE_URL/admin" "200"
test_endpoint "Admin posts page" "GET" "$BASE_URL/admin/posts" "200"
test_endpoint "Admin new post page" "GET" "$BASE_URL/admin/posts/new" "200"
test_endpoint "Admin newsletter page" "GET" "$BASE_URL/admin/newsletter" "200"
test_endpoint "Admin themes page" "GET" "$BASE_URL/admin/themes" "200"
test_endpoint "Admin settings page" "GET" "$BASE_URL/admin/settings" "200"
echo ""

echo "=========================================="
echo "  Test Results"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review above.${NC}"
    exit 1
fi

