document.addEventListener('DOMContentLoaded', function() {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  window.showToastrNotification = function(type, message, title) {
    if (toastr[type]) {
      toastr[type](message, title);
    } else {
      console.error('Invalid toastr notification type:', type);
    }
  };

  const depositForm = document.getElementById('depositForm');
  depositForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('depositAmount').value;
    console.log(`Attempting to deposit amount: ${amount}`);
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
        showToastrNotification('success', `Successfully deposited $${amount}`, 'Deposit Success');
      })
      .catch(error => {
        console.error('Error updating balance:', error);
        showToastrNotification('error', 'There was an error updating your balance. Please try again.', 'Update Error');
        console.error('Error details:', error.message);
      });
  });
});