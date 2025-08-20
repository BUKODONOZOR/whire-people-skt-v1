/**
 * Script to get a new authentication token from Riwi Talent backend
 * Run with: node src/get-new-token.js
 */

const baseUrl = 'http://localhost:5162/api';

async function login(email, password) {
    try {
        console.log('🔐 Attempting to login...');
        console.log('   Email:', email);
        
        const response = await fetch(`${baseUrl}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        console.log('   Response Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            
            if (data.token || data.accessToken || data.data?.token) {
                const token = data.token || data.accessToken || data.data?.token;
                console.log('\n✅ Login successful!');
                console.log('================================');
                console.log('🔑 New Token (copy this to .env.local):');
                console.log('\nNEXT_PUBLIC_TEMP_TOKEN=' + token);
                console.log('\n================================');
                
                // Test the new token
                await testToken(token);
                
                return token;
            } else {
                console.log('❌ No token in response:', data);
            }
        } else {
            const error = await response.text();
            console.log('❌ Login failed:', error);
        }
    } catch (error) {
        console.log('❌ Network error:', error.message);
    }
    return null;
}

async function testToken(token) {
    console.log('\n🧪 Testing new token...');
    
    try {
        const response = await fetch(`${baseUrl}/v1/panel/processes/status`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Token works! Panel endpoints are accessible.');
        } else {
            console.log('⚠️ Token created but Panel endpoints return:', response.status);
        }
    } catch (error) {
        console.log('❌ Error testing token:', error.message);
    }
}

// Try different default credentials
async function tryDefaultCredentials() {
    const credentials = [
        { email: 'admin@example.com', password: 'Admin123!' },
        { email: 'admin@riwi.com', password: 'Admin123!' },
        { email: 'admin@wiredpeople.com', password: 'Admin123!' },
        { email: 'test@example.com', password: 'Test123!' },
    ];

    console.log('🔍 Trying default credentials...\n');

    for (const cred of credentials) {
        const token = await login(cred.email, cred.password);
        if (token) {
            return token;
        }
        console.log('---');
    }

    console.log('\n❌ None of the default credentials worked.');
    console.log('\n📝 Instructions:');
    console.log('1. Check the backend configuration for valid users');
    console.log('2. Or create a new user using the backend API');
    console.log('3. Or check if the backend has a seed/development user');
}

// Run the script
tryDefaultCredentials().then(() => {
    console.log('\n✨ Script completed');
});
