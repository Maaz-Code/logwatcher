// Import file system module
const fs = require("fs");

/**
 * Read the last N lines from a file efficiently
 * @param {string} filePath - Path to the file to read
 * @param {number} maxLines - Maximum number of lines to read
 * @returns {Promise<string>} Promise resolving to the last N lines of the file
 */
function getLast10Lines(filePath, maxLines) {
  return new Promise((resolve, reject) => {
    // Get file stats to determine size
    fs.stat(filePath, (err, stats) => {
      if (err) return reject(err);
      const fileSize = stats.size;
      const bufferSize = 4096;  // Read file in 4KB chunks
      const buffer = Buffer.alloc(bufferSize);

      // Open file for reading
      fs.open(filePath, "r", (err, fd) => {
        if (err) return reject(err);

        let position = fileSize;  // Start from end of file
        let data = "";
        let lineCount = 0;

        // Recursive function to read chunks from end of file
        (function readChunk() {
          // Calculate position for next chunk
          position = Math.max(0, position - bufferSize);

          // Read chunk of data
          fs.read(fd, buffer, 0, bufferSize, position, (err, bytesRead) => {
            if (err) return reject(err);
            
            // Prepend new chunk to existing data
            data = buffer.toString("utf8", 0, bytesRead) + data;
            lineCount = data.split("\n").length - 1;

            // If we have enough lines or reached start of file
            if (lineCount >= maxLines || position === 0) {
              const lines = data.trim().split("\n");
              // Return exactly maxLines number of lines
              resolve(lines.slice(-maxLines).join("\n") + "\n");
              fs.close(fd, () => {});
            } else {
              if (position === 0) return resolve(data);
              readChunk();  // Read next chunk
            }
          });
        })();
      });
    });
  });
}

module.exports = { getLast10Lines };
