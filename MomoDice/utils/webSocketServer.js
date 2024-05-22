const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('A new client connected.');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.on('close', function close() {
    console.log('Client disconnected.');
  });

  ws.on('error', function error(err) {
    console.error('WebSocket error observed:', err.stack);
  });
});

function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data, err => {
        if (err) {
          console.error('Broadcast error:', err.stack);
        }
      });
    }
  });
};

server.listen(process.env.WEBSOCKET_PORT || 8080, function listening() {
  console.log(`WebSocket server started on port ${server.address().port}`);
});

module.exports = { server, broadcast };