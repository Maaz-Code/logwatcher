// Import utility function for reading last lines of a file
const { getLast10Lines } = require("../utils/readLastLines");

/**
 * Handle incoming HTTP requests
 * @param {http.IncomingMessage} req - HTTP request object
 * @param {http.ServerResponse} res - HTTP response object
 * @param {string} logFilePath - Path to the log file
 */
function handleHttpRequest(req, res, logFilePath) {
  // Serve the main page with WebSocket connection
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<!DOCTYPE html><html><head><title>Live Logs</title></head><body>
      <pre id="log" style="background:#111;color:#0f0;padding:20px;height:90vh;overflow:auto;"></pre>
      <script>
        // Initialize WebSocket connection
        const socket = new WebSocket("ws://" + location.host);
        const log = document.getElementById("log");
        
        // Handle incoming WebSocket messages
        socket.onmessage = (event) => {
          log.textContent += event.data;
          log.scrollTop = log.scrollHeight;  // Auto-scroll to bottom
        };
        
        // Fetch initial last 10 lines
        fetch('/last10')
          .then(res => res.text())
          .then(data => log.textContent = data);
      </script></body></html>`);
  } 
  // Endpoint to get last 10 lines of the log file
  else if (req.url === "/last10") {
    getLast10Lines(logFilePath, 10).then(data => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    }).catch(() => {
      res.writeHead(500);
      res.end("Error reading log file");
    });
  } 
  // Handle 404 for unknown routes
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
}

module.exports = { handleHttpRequest };
