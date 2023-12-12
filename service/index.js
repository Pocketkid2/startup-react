let express = require('express');
let cookie_parser = require('cookie-parser');
let app = express();

let api_router = require('./api_router');
let auth_router = require('./auth_router');

let { WebSocketServer } = require('ws');
let wss = new WebSocketServer({ noServer: true });

let data = require('./data');

let cookie = require('cookie');

let port = process.argv.length > 2 ? process.argv[2] : 4000;

// Express routing stuff --------------------------------------------------------------------------

app.use(cookie_parser());

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`\n\n\nRequest received (time = ${new Date(Date.now()).toLocaleString()})`);
    console.log(`\tMethod: ${req.method}`);
    console.log(`\tURL: ${req.originalUrl}`);
    console.log(`\tBody: ${JSON.stringify(req.body)}`);
    console.log(`\tCookies: ${JSON.stringify(req.cookies)}`);
    console.log(`\tProtocol: ${req.protocol}`);
    next();
});

app.use(express.json());

app.use('/api', api_router);
app.use('/auth', auth_router);

app.use((request, response) => {
    response.sendFile('index.html', { root: 'public' });
});

server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// WebSocket stuff --------------------------------------------------------------------------------

let connections = [];

// Tell the HTTP webserver what to do when a websocket tries to connect
server.on('upgrade', async (request, socket, head) => {

    // Read auth token from cookie
    const cookies = cookie.parse(request.headers.cookie || '');
    const token = cookies['auth_token'];

    console.log(`[WEBSOCKET] Receiving HTTP Upgrade Request, token is ${token}`);

    // Look up auth token in database
    const username = await data.authenticate_token(token);

    if (username) {

        console.log('[WEBSOCKET] User authenticated, accepting connection');

        // If authenticated user, accept connection
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, username);
        });

    } else {

        console.log('[WEBSOCKET] User not authenticated, rejecting connection');

        // If not authenticated user, reject connection
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
    }
});

// Tell the websocket server what to do when a new connection is received
wss.on('connection', (ws, request, username) => {

    console.log(`[WEBSOCKET] ${username} connected`);

    // Create a new connection for the given username
    const connection = { username: username, alive: true, ws: ws };

    // Send a list of currently connected users to the new connection
    const user_list = connections.map(connection => connection.username);
    connection.ws.send(JSON.stringify({ type: 'user_list', user_list: user_list }));

    // Add it to the list
    connections.push(connection);

    // Tell all connections about the new user
    connections.forEach(connection => {
        connection.ws.send(JSON.stringify({ type: 'new_user', username: username }));
    });



    // If we get a message, send it to all connections
    ws.on('message', (message) => {
        const message_object = JSON.parse(message);
        console.log(`[WEBSOCKET] Received message from ${username}: ${message}`);
        connections.forEach(connection => {
            connection.ws.send(JSON.stringify({ type: 'message', username: username, message: message_object.message }));
        });
    });

    // If we get a close notice, remove it from the list
    ws.on('close', () => {
        console.log(`[WEBSOCKET] ${username} disconnected`);
        
        connections.forEach(connection => {
            connection.ws.send(JSON.stringify({ type: 'user_left', username: username }));
        });

        connections.findIndex((o, i) => {
            if (o.username === username) {
                connections.splice(i, 1);
                return true;
            }
        });
    });

    // If the server receives a pong response from a ping it sent, mark the connection as alive
    ws.on('pong', () => {
        connection.alive = true;
    });

});

// Keep all websocket connections alive (by pinging every 10 seconds)
setInterval(() => {
    connections.forEach(connection => {
        if (connection.alive) {
            connection.alive = false;
            connection.ws.ping();
        } else {
            connection.ws.terminate();
        }
    });
}, 10000);