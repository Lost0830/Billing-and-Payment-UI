import fetch from 'node-fetch';

async function testLogin() {
  const testCases = [
    { email: 'admin@hims.com', password: 'admin123', expected: 'success' },
    { email: 'jane@hims.com', password: 'password123', expected: 'success' },
    { email: 'john@pharmacy.com', password: 'pharma123', expected: 'success' },
    { email: 'wrong@email.com', password: 'admin123', expected: 'fail' },
    { email: 'admin@hims.com', password: 'wrongpassword', expected: 'fail' },
  ];

  for (const test of testCases) {
    console.log(`\n🧪 Testing: ${test.email} / ${test.password}`);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: test.email, password: test.password }),
      });
      
      const data = await response.json();
      
      if (test.expected === 'success' && data.success) {
        console.log('✅ PASS: Login successful');
      } else if (test.expected === 'fail' && !data.success) {
        console.log('✅ PASS: Login failed as expected');
      } else {
        console.log('❌ FAIL: Unexpected result');
        console.log('Response:', data);
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  }
}

testLogin();