document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  socket.on('balance update', (data) => {
    const balanceElement = document.getElementById('balance');
    const commissionElement = document.getElementById('commission');
    if (balanceElement && commissionElement) {
      balanceElement.textContent = data.newBalance + ' USDT';
      commissionElement.textContent = data.newCommission + ' USDT';
    }
  });

  // Error handling for WebSocket connection
  socket.on('connect_error', (err) => {
    console.error('WebSocket connection error: ', err.message);
    setTimeout(() => {
      socket.connect();
    }, 1000); // Attempt to reconnect after 1 second
  });

  socket.on('disconnect', () => {
    console.warn('WebSocket disconnected. Attempting to reconnect...');
    setTimeout(() => {
      socket.connect();
    }, 1000); // Attempt to reconnect after 1 second
  });
});
