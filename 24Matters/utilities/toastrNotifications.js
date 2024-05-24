const toastrNotifications = {
    showToastrNotification: (type, message, title) => {
        switch (type) {
            case 'success':
                toastr.success(message, title);
                break;
            case 'error':
                toastr.error(message, title);
                break;
            case 'info':
                toastr.info(message, title);
                break;
            case 'warning':
                toastr.warning(message, title);
                break;
            default:
                console.error('Unsupported toastr notification type');
        }
    }
};

if (typeof window !== 'undefined') {
    window.toastrNotifications = toastrNotifications;
}