const http = require('http');

function testAPI(path) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`✅ ${path}:`);
            console.log(JSON.parse(data));
        });
    });

    req.on('error', (error) => {
        console.error(`❌ Error: ${error.message}`);
    });

    req.end();
}

console.log('Testing Backend APIs...\n');
testAPI('/api/test');
setTimeout(() => testAPI('/api/health'), 500);
