document.addEventListener('DOMContentLoaded', function() {
  const depositForm = document.getElementById('depositForm');
  depositForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('depositAmount').value;
    // Placeholder for deposit functionality - In real scenario, implement AJAX request here.
    console.log(`Attempting to deposit amount: ${amount}`);
    // Fetch updated balance after deposit (this is a placeholder; actual implementation will require server-side logic to handle deposit)
    fetch('/wallet-info')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('balance').innerText = data.balance;
        console.log('Balance updated successfully.');
      })
      .catch(error => {
        console.error('Error updating balance:', error);
        alert('There was an error updating your balance. Please try again.');
      });
  });
});