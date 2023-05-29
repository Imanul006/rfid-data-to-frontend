const http = require('http');
const fs = require('fs');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

// Make an HTTP GET request to the stream URL
const url = 'http://impinj-15-22-aa.local/api/v1/data/stream';
const request = http.get(url, (response) => {
  // Check if the response is successful (HTTP 200 status code)
  if (response.statusCode === 200) {
    // Handle incoming data
    response.on('data', (chunk) => {
      // Convert the chunk buffer to a string
      const chunkString = chunk.toString();
      console.log("Data:" + chunkString);

      // Emit the data to all connected clients
      io.emit('streamData', chunkString);
    });

    // Handle end of stream
    response.on('end', () => {
      console.log('Stream ended');
    });

    // Handle stream error
    response.on('error', (error) => {
      console.error('Stream error:', error);
    });
  } else {
    console.error('Request failed with status code:', response.statusCode);
  }
});

// Handle request error
request.on('error', (error) => {
  console.error('Request error:', error);
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const port = 3000; // Change the port number if needed
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
