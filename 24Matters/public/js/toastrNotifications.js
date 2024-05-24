// toastrNotifications.js
// This script is responsible for displaying toastr notifications

// Ensure toastr is properly initialized
if (typeof toastr !== 'undefined') {
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
    console.log('Toastr options set successfully.');
} else {
    console.error('Toastr is not defined. Make sure toastr.js is correctly included.');
}

// Function to show toastr notification
window.showToastrNotification = function(type, message, title) {
    if (typeof toastr === 'undefined') {
        console.error('Toastr is not available. Please ensure toastr.js is correctly included.');
        return;
    }

    switch (type) {
        case 'success':
            toastr.success(message, title);
            console.log('Toastr success notification shown.');
            break;
        case 'error':
            toastr.error(message, title);
            console.log('Toastr error notification shown.');
            break;
        case 'info':
            toastr.info(message, title);
            console.log('Toastr info notification shown.');
            break;
        case 'warning':
            toastr.warning(message, title);
            console.log('Toastr warning notification shown.');
            break;
        default:
            console.error('Unsupported toastr notification type:', type);
    }
};

console.log('Toastr notifications script loaded and initialized.');