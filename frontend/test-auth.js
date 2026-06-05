import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    validateStatus: () => true
});

let cookieStr = '';

async function runTest() {
    console.log("🚀 Starting E2E Auth Validation...");

    // 1. Get CSRF Cookie
    console.log("1️⃣ Fetching CSRF Cookie...");
    let res = await api.get('/sanctum/csrf-cookie');
    let cookies = res.headers['set-cookie'];
    if (cookies) {
        cookieStr = cookies.map(c => c.split(';')[0]).join('; ');
        console.log("✅ CSRF Cookie obtained:", cookieStr.substring(0, 50) + "...");
    }

    // Prepare headers
    const headers = { 
        'Cookie': cookieStr,
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
        'Referer': 'http://localhost:3000/'
    };

    // 2. Register
    console.log("\n2️⃣ Registering new user...");
    const email = `test${Date.now()}@example.com`;
    res = await api.post('/api/v1/register', {
        name: 'Test User',
        email: email,
        password: 'password123',
        password_confirmation: 'password123',
        role: 'company'
    }, { headers });
    
    console.log(`Status: ${res.status}`);
    if (res.status === 201) {
        console.log("✅ Registration successful:", res.data.message);
        
        // Update cookies
        if (res.headers['set-cookie']) {
            const newCookies = res.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
            cookieStr = `${cookieStr}; ${newCookies}`;
            headers['Cookie'] = cookieStr;
        }
    } else {
        console.error("❌ Registration failed:", res.data);
    }

    // 3. Logout (to test login next)
    console.log("\n3️⃣ Logging out...");
    res = await api.post('/api/v1/logout', {}, { headers });
    console.log(`Status: ${res.status}`);

    // 4. Login
    console.log("\n4️⃣ Logging in...");
    res = await api.post('/api/v1/login', {
        email: email,
        password: 'password123'
    }, { headers });
    
    console.log(`Status: ${res.status}`);
    if (res.status === 200) {
        console.log("✅ Login successful:", res.data.message);
        if (res.headers['set-cookie']) {
            const newCookies = res.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
            cookieStr = `${cookieStr}; ${newCookies}`;
            headers['Cookie'] = cookieStr;
        }
    } else {
        console.error("❌ Login failed:", res.data);
    }

    // 5. Protected Route Access (/me)
    console.log("\n5️⃣ Accessing Protected Route (/me)...");
    res = await api.get('/api/v1/me', { headers });
    console.log(`Status: ${res.status}`);
    if (res.status === 200) {
        console.log("✅ Protected route accessed. User:", res.data.data.email);
    } else {
        console.error("❌ Protected route failed:", res.data);
    }

    // 6. Logout Again
    console.log("\n6️⃣ Logging out...");
    res = await api.post('/api/v1/logout', {}, { headers });
    console.log(`Status: ${res.status} - ${res.data.message || 'Success'}`);

    // 7. Guest State Verification
    console.log("\n7️⃣ Verifying Guest State (/me)...");
    res = await api.get('/api/v1/me', { headers });
    console.log(`Status: ${res.status}`);
    if (res.status === 401) {
        console.log("✅ Successfully verified guest state (401 Unauthenticated)");
    } else {
        console.error("❌ Expected 401 but got:", res.status);
    }

    console.log("\n🎉 End-to-End Validation Complete!");
}

runTest().catch(console.error);
