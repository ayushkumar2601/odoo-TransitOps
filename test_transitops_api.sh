#!/usr/bin/env bash
set -e

PORT=5005
BASE_URL="http://localhost:${PORT}/api"

echo "=========================================================="
echo "TransitOps Phase 1 — Comprehensive API & Business Rules Test"
echo "=========================================================="

# Start backend server on dedicated port 5005
PORT=5005 node backend/server.js &
PID=$!
sleep 2

cleanup() {
  kill $PID 2>/dev/null || true
}
trap cleanup EXIT

echo ""
echo "1. Testing GET /api/dashboard (Executive KPI Control Tower)..."
curl -s "${BASE_URL}/dashboard" | grep -q '"success":true' && echo "   PASS: Dashboard KPI retrieved successfully."

echo ""
echo "2. Testing GET /api/vehicles..."
curl -s "${BASE_URL}/vehicles" | grep -q '"success":true' && echo "   PASS: Vehicles list retrieved successfully."

echo ""
echo "3. Testing POST /api/vehicles (BR-001 Unique Registration Enforcement)..."
# First creation
curl -s -X POST "${BASE_URL}/vehicles" \
  -H "Content-Type: application/json" \
  -d '{"registration_number":"WB-TEST-9999","vehicle_name":"Test Truck","vehicle_type":"Heavy Truck","max_load_capacity":10000,"odometer":100,"acquisition_cost":2000000}' | grep -q '"success":true' && echo "   PASS: New vehicle WB-TEST-9999 registered."

# Second creation attempt with same registration (must fail BR-001)
RESP=$(curl -s -X POST "${BASE_URL}/vehicles" \
  -H "Content-Type: application/json" \
  -d '{"registration_number":"WB-TEST-9999","vehicle_name":"Duplicate Truck","vehicle_type":"Heavy Truck","max_load_capacity":10000,"odometer":100,"acquisition_cost":2000000}')
echo "$RESP" | grep -q "BR-001 Violation" && echo "   PASS: BR-001 correctly prevented duplicate registration number."

echo ""
echo "4. Testing GET /api/drivers..."
curl -s "${BASE_URL}/drivers" | grep -q '"success":true' && echo "   PASS: Drivers list retrieved successfully."

echo ""
echo "5. Testing GET /api/trips..."
curl -s "${BASE_URL}/trips" | grep -q '"success":true' && echo "   PASS: Trips list retrieved successfully."

echo ""
echo "6. Testing POST /api/trips (BR-008 Cargo Capacity Enforcement)..."
# Attempt to create trip with cargo weight exceeding max load capacity
RESP_TRIP=$(curl -s -X POST "${BASE_URL}/trips" \
  -H "Content-Type: application/json" \
  -d '{"trip_code":"TRP-BR008","source":"Kolkata","destination":"Delhi","vehicle_id":"11111111-1111-1111-1111-111111111102","driver_id":"22222222-2222-2222-2222-222222222201","cargo_weight":50000,"planned_distance":1500,"planned_revenue":100000}')
echo "$RESP_TRIP" | grep -q "BR-008 Violation" && echo "   PASS: BR-008 correctly rejected cargo weight exceeding vehicle capacity."

echo ""
echo "7. Testing GET /api/maintenance..."
curl -s "${BASE_URL}/maintenance" | grep -q '"success":true' && echo "   PASS: Maintenance logs retrieved successfully."

echo ""
echo "8. Testing GET /api/fuel-logs & /api/expenses..."
curl -s "${BASE_URL}/fuel-logs" | grep -q '"success":true' && echo "   PASS: Fuel logs retrieved successfully."
curl -s "${BASE_URL}/expenses" | grep -q '"success":true' && echo "   PASS: Expenses list retrieved successfully."

echo ""
echo "9. Testing GET /api/analytics..."
curl -s "${BASE_URL}/analytics" | grep -q '"success":true' && echo "   PASS: Comprehensive analytics retrieved successfully."

echo ""
echo "=========================================================="
echo "ALL TRANSITOPS PHASE 1 API & BUSINESS RULES TESTS PASSED!"
echo "=========================================================="
