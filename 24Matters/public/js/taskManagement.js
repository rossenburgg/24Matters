document.addEventListener('DOMContentLoaded', () => {
  window.startTask = async (taskId) => {
    try {
      const response = await fetch('/tasks/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });
      if (!response.ok) {
        throw new Error('Failed to start task. Server responded with ' + response.status);
      }
      console.log('Task started successfully');
      location.reload(); // Reload to reflect the updated status
    } catch (err) {
      console.error('Error starting task:', err);
      alert('Error starting task. Please check the console for more details.');
    }
  };

  window.submitTask = async (taskId) => {
    try {
      const response = await fetch('/tasks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit task. Server responded with ' + response.status);
      }
      console.log('Task submitted successfully');
      location.reload(); // Reload to reflect the updated status
    } catch (err) {
      console.error('Error submitting task:', err);
      alert('Error submitting task. Please check the console for more details.');
    }
  };
});