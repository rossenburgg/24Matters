document.addEventListener('DOMContentLoaded', () => {
  // Connecting to WebSocket
  const socket = io();

  // Listening for task progress updates
  socket.on('taskProgress', (data) => {
    toastr.info(`Task ${data.taskId} is now ${data.status}.`);
    console.log(`Task ${data.taskId} status updated to ${data.status}.`);
    // Optionally, update task status on the page...
  });

  // Error handling for WebSocket connection
  socket.on('connect_error', (err) => {
    console.error('WebSocket connection error: ', err.message);
    toastr.error('WebSocket connection error.');
    console.log('Attempting to reconnect to WebSocket...');
    setTimeout(() => {
      socket.connect();
    }, 1000); // Attempt to reconnect after 1 second
  });

  // Attempt to re-establish connection upon disconnection
  socket.on('disconnect', () => {
    console.warn('WebSocket disconnected. Attempting to reconnect...');
    toastr.warning('WebSocket disconnected. Attempting to reconnect...');
    setTimeout(() => {
      socket.connect();
    }, 1000); // Attempt to reconnect after 1 second
  });

  // Form validation for registration
  const registrationForm = document.querySelector('#registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      const password = document.querySelector('#password').value;
      const confirmPassword = document.querySelector('#confirmPassword').value;
      const termsAccepted = document.querySelector('#termsAccepted').checked;

      if (password !== confirmPassword) {
        e.preventDefault(); // Prevent form submission
        toastr.error('Passwords do not match.');
        console.error('Form submission error: Passwords do not match.');
      }

      if (!termsAccepted) {
        e.preventDefault(); // Prevent form submission
        toastr.error('You must accept the terms and conditions.');
        console.error('Form submission error: Terms and conditions not accepted.');
      }
    });
  }
});