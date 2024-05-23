const http = require('http');
const url = require('url');

// Function to get the current timestamp
function getTimestamp() {
    return new Date().toISOString();
}



function generateString(sizeInKB) {
    const bytesPerCharacter = 2; // Each character is 2 bytes
    const targetSizeInBytes = sizeInKB * 1024; // Convert KB to bytes
    const targetLength = targetSizeInBytes / bytesPerCharacter;

    // Create a base string to repeat
    const baseString = 'a'; // You can use any character(s)
    let resultString = '';

    // Repeat the base string to reach the target length
    while (resultString.length < targetLength) {
        resultString += baseString;
    }

    // Trim the result string to the exact target length
    resultString = resultString.substring(0, targetLength);

    return resultString;
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    console.log (`-----------------> new request ${getTimestamp()}`)
    const parsedUrl = url.parse(req.url, true);

    // Get the underlying socket
    const socket = req.socket;

    // Log when the client connects
    console.log(`[${getTimestamp()}] Client connected`);

    // Log socket events
    socket.on('data', (chunk) => {
        console.log(`[${getTimestamp()}] Socket received data: ${chunk}`);
    });

    socket.on('end', () => {
        console.log(`[${getTimestamp()}] Socket end event`);
    });

    socket.on('timeout', () => {
        console.log(`[${getTimestamp()}] Socket timeout`);
    });

    socket.on('error', (err) => {
        console.log(`[${getTimestamp()}] Socket error: ${err.message}`);
    });

    socket.on('close', (hadError) => {
        console.log(`[${getTimestamp()}] Socket close event, hadError=${hadError}`);
    });

    // Handle REST endpoint
    
        console.log(`[${getTimestamp()}] Received request path: ${parsedUrl.pathname} method: ${req.method} headers: ${JSON.stringify(req.headers)}`);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'This is a REST endpoint for timestamps', data: generateString(2000) }));
    

    // Log when data is sent (in this case, after the response ends)
    res.on('finish', () => {
        console.log(`[${getTimestamp()}] Response sent to client`);
    });

    // Log when the request is closed
    req.on('close', () => {
        console.log(`[${getTimestamp()}] Request closed`);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`[${getTimestamp()}] Server is listening on http://localhost:${PORT}`);
});
