/**
 * Test script for Panel API endpoints
 * Run with: node src/test-panel-endpoints.js
 */

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxNTdlYTdlMi0wYjdkLTRmYTMtYTlmOC1iYzEwYWU2NjkyZWUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE1N2VhN2UyLTBiN2QtNGZhMy1hOWY4LWJjMTBhZTY2OTJlZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQGV4YW1wbGUuY29tIiwiYXVkIjoiZGV2ZWxvcGVycyIsImlzcyI6InRhbGVudC1oZXhhZ29uYWwtYXJjaGl0ZWN0dXJlIiwiZXhwIjoxNzU0Nzg0OTQ5LCJpYXQiOjE3NTQ2NjQ5NDksIm5iZiI6MTc1NDY2NDk0OX0.TrsDHiOUgbQj2FiHJXDHy_f_aHNCuWhTulaeHCQb4Z0';
const baseUrl = 'http://localhost:5162/api';

const endpoints = [
  { name: 'Process Status', url: '/v1/panel/processes/status' },
  { name: 'Monthly Processes', url: '/v1/panel/processes/monthly?Month=1&Year=2025' },
  { name: 'Student Status', url: '/v1/panel/students/status' },
  { name: 'Recent Processes', url: '/v1/panel/processes/recent?PageSize=5' },
  { name: 'Most Active Companies', url: '/v1/panel/companies/most-active?PageSize=5' },
];

async function testEndpoint(name, url) {
  try {
    console.log(`\n📍 Testing: ${name}`);
    console.log(`   URL: ${baseUrl}${url}`);
    
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Success! Data:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
    } else {
      const error = await response.text();
      console.log(`   ❌ Failed! Error:`, error.substring(0, 200));
    }
  } catch (error) {
    console.log(`   ❌ Network Error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Testing Panel API Endpoints');
  console.log('================================');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.name, endpoint.url);
  }
  
  console.log('\n================================');
  console.log('✨ Tests completed!');
}

runTests();
