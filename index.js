// Import required modules
const { createServer } = require("http");  // Node.js built-in HTTP server
const { WebSocketServer } = require("ws"); // WebSocket server for real-time communication
const { handleHttpRequest } = require("./routes/httpHandler");  // HTTP request handler
const { setupWebSocketServer } = require("./services/webSocketService");  // WebSocket setup
const { initLogWatcher } = require("./services/logWatcherService");  // Log file watcher
const path = require("path");  // Path utilities for file handling

// Configuration constants
const PORT = 3000;  // Server port number
const LOG_FILE_PATH = path.join(__dirname, "sample.log");  // Path to the log file

// Create HTTP server and WebSocket server
const server = createServer((req, res) => handleHttpRequest(req, res, LOG_FILE_PATH));  // HTTP server with request handler
const wss = new WebSocketServer({ server });  // WebSocket server attached to HTTP server

// Initialize services
setupWebSocketServer(wss);  // Setup WebSocket event handlers
initLogWatcher(LOG_FILE_PATH);  // Start watching the log file for changes

// Start the server
server.listen(PORT, () => {
  console.log(`Log Watcher running at http://localhost:${PORT}`);  // Server startup message
});
