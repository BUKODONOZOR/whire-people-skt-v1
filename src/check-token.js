/**
 * Script to check JWT token validity
 */

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxNTdlYTdlMi0wYjdkLTRmYTMtYTlmOC1iYzEwYWU2NjkyZWUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE1N2VhN2UyLTBiN2QtNGZhMy1hOWY4LWJjMTBhZTY2OTJlZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQGV4YW1wbGUuY29tIiwiYXVkIjoiZGV2ZWxvcGVycyIsImlzcyI6InRhbGVudC1oZXhhZ29uYWwtYXJjaGl0ZWN0dXJlIiwiZXhwIjoxNzU0Nzg0OTQ5LCJpYXQiOjE3NTQ2NjQ5NDksIm5iZiI6MTc1NDY2NDk0OX0.TrsDHiOUgbQj2FiHJXDHy_f_aHNCuWhTulaeHCQb4Z0';

// Decode JWT (without verification)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            Buffer.from(base64, 'base64')
                .toString()
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding token:', e);
        return null;
    }
}

const decoded = parseJwt(token);

if (decoded) {
    console.log('🔍 Token Information:');
    console.log('================================');
    console.log('Email:', decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
    console.log('User ID:', decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid']);
    console.log('Audience:', decoded.aud);
    console.log('Issuer:', decoded.iss);
    
    // Check expiration
    const exp = decoded.exp;
    const iat = decoded.iat;
    const now = Math.floor(Date.now() / 1000);
    
    console.log('\n⏰ Time Information:');
    console.log('Issued at:', new Date(iat * 1000).toLocaleString());
    console.log('Expires at:', new Date(exp * 1000).toLocaleString());
    console.log('Current time:', new Date(now * 1000).toLocaleString());
    
    if (exp < now) {
        console.log('\n❌ TOKEN IS EXPIRED!');
        console.log(`Expired ${Math.floor((now - exp) / 3600)} hours ago`);
    } else {
        console.log('\n✅ Token is still valid');
        console.log(`Expires in ${Math.floor((exp - now) / 3600)} hours`);
    }
} else {
    console.log('❌ Could not decode token');
}

// Test a simple endpoint
async function testAuth() {
    console.log('\n🧪 Testing Authentication...');
    console.log('================================');
    
    try {
        const response = await fetch('http://localhost:5162/api/v1/panel/processes/status', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response Status:', response.status);
        
        if (response.status === 401) {
            const error = await response.json();
            console.log('❌ Authentication Failed:', error.message || 'Unauthorized');
            console.log('\n🔑 You need to get a new token from the backend');
            console.log('Try logging in with the Riwi Talent frontend or use the auth endpoint');
        } else if (response.ok) {
            console.log('✅ Authentication successful!');
            const data = await response.json();
            console.log('Data received:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ Network error:', error.message);
    }
}

testAuth();
