// Store connected WebSocket clients
const clients = new Set();

/**
 * Setup WebSocket server with connection handling
 * @param {WebSocketServer} wss - WebSocket server instance
 */
function setupWebSocketServer(wss) {
  // Handle new client connections
  wss.on("connection", (ws) => {
    clients.add(ws);  // Add new client to the set
    ws.on("close", () => clients.delete(ws));  // Remove client when they disconnect
  });
}

/**
 * Broadcast data to all connected clients
 * @param {string} data - Data to broadcast to clients
 */
function broadcastToClients(data) {
  // Send data to each connected client
  for (const client of clients) {
    // Check if client connection is open (readyState 1 = OPEN)
    if (client.readyState === 1) {
      client.send(data);
    }
  }
}

module.exports = { setupWebSocketServer, broadcastToClients };
