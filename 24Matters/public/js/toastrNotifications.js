// toastrNotifications.js
// This script is responsible for displaying toastr notifications

document.addEventListener('DOMContentLoaded', function() {
    // Function to show toastr notification
    window.showToastrNotification = function(type, message) {
        switch (type) {
            case 'success':
                toastr.success(message);
                break;
            case 'error':
                toastr.error(message);
                break;
            case 'info':
                toastr.info(message);
                break;
            case 'warning':
                toastr.warning(message);
                break;
            default:
                console.error('Unsupported notification type:', type);
        }
    };

    // Example usage of toastr notification
    // Uncomment the following line to test a success notification
    // showToastrNotification('success', 'This is a success notification!');

    // Error handling example
    try {
        // Simulate a function that could fail
        // simulateFunctionThatCouldFail();
    } catch (error) {
        console.error('Error occurred in toastrNotifications:', error.message, error.stack);
        showToastrNotification('error', 'An unexpected error occurred.');
    }
});