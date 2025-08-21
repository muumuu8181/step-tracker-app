#!/usr/bin/env node

const http = require('http');

async function smokeTest() {
  console.log('🔍 Running smoke test...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 5000
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Smoke test passed - Server is responding');
        resolve(true);
      } else {
        console.log(`❌ Smoke test failed - Status: ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (e) => {
      console.log(`❌ Smoke test failed - Error: ${e.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Smoke test failed - Timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

if (require.main === module) {
  smokeTest();
}

module.exports = { smokeTest };