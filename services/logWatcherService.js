// Import required modules
const fs = require("fs");  // File system module for file operations
const { broadcastToClients } = require("./webSocketService");  // WebSocket broadcast function

// Track the last read position in the log file
let lastReadPosition = 0;

/**
 * Initialize the log file watcher
 * @param {string} filePath - Path to the log file to watch
 */
function initLogWatcher(filePath) {
  // Get initial file size when starting the watcher
  fs.stat(filePath, (err, stats) => {
    if (!err) lastReadPosition = stats.size;
  });

  // Watch for changes in the log file
  fs.watch(filePath, (eventType) => {
    if (eventType === "change") {
      // When file changes, get its new size
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        const newSize = stats.size;
        
        // Only process if file has grown
        if (newSize > lastReadPosition) {
          const diff = newSize - lastReadPosition;
          const buffer = Buffer.alloc(diff);

          // Open file and read new content
          fs.open(filePath, "r", (err, fd) => {
            if (err) return;
            fs.read(fd, buffer, 0, diff, lastReadPosition, (err, bytesRead) => {
              if (bytesRead > 0) {
                // Broadcast new content to all connected WebSocket clients
                broadcastToClients(buffer.toString("utf8", 0, bytesRead));
                lastReadPosition = newSize;
              }
              fs.close(fd, () => {});
            });
          });
        }
      });
    }
  });
}

module.exports = { initLogWatcher };
