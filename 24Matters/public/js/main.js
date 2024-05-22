document.addEventListener('DOMContentLoaded', () => {
  // Connecting to WebSocket
  const socket = io();

  // Listening for task progress updates
  socket.on('taskProgress', (data) => {
    alert(`Task ${data.taskId} is now ${data.status}.`);
    console.log(`Task ${data.taskId} status updated to ${data.status}.`);
    // Optionally, update task status on the page...
  });

  // Error handling for WebSocket connection
  socket.on('connect_error', (err) => {
    console.error('WebSocket connection error: ', err.message);
    console.log('Attempting to reconnect to WebSocket...');
    setTimeout(() => {
      socket.connect();
    }, 1000); // Attempt to reconnect after 1 second
  });

  // Attempt to re-establish connection upon disconnection
  socket.on('disconnect', () => {
    console.warn('WebSocket disconnected. Attempting to reconnect...');
    setTimeout(() => {
      socket.connect();
    }, 1000); // Attempt to reconnect after 1 second
  });
});