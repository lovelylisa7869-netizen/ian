// Virtual Closet AI — Local CORS Proxy for Claude API
// Run with: node proxy.js
// This forwards requests from the browser to the Anthropic API.

const http = require('http');
const https = require('https');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    if (req.method !== 'POST') { res.writeHead(405); res.end('POST only'); return; }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const { apiKey, ...requestBody } = JSON.parse(body);
            if (!apiKey) { res.writeHead(400); res.end('Missing apiKey'); return; }

            const postData = JSON.stringify(requestBody);
            const options = {
                hostname: 'api.anthropic.com',
                path: '/v1/messages',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const apiReq = https.request(options, (apiRes) => {
                res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
                apiRes.pipe(res);
            });

            apiReq.on('error', (err) => {
                res.writeHead(502);
                res.end(JSON.stringify({ error: err.message }));
            });

            apiReq.write(postData);
            apiReq.end();
        } catch (err) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid request: ' + err.message }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Virtual Closet AI proxy running on http://localhost:${PORT}`);
    console.log('Ready to forward requests to Claude API.');
});
