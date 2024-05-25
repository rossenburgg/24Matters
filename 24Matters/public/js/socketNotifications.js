document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Assuming the user's ID is stored in a meta tag for simplicity
    const userId = document.querySelector('meta[name="user-id"]').content;

    // Register with the server for this user's notifications
    socket.emit('register', userId);

    // Listen for real-time notification count updates
    socket.on('notification count', (count) => {
        const notificationCountElement = document.getElementById('notificationCount');
        if (notificationCountElement) {
            notificationCountElement.innerText = count;
            console.log(`Notification count updated to ${count} for user ${userId}.`);
        } else {
            console.error('Notification count element not found.');
        }
    });

    // Handle click event for the notification icon
    const notificationIcon = document.getElementById('notificationIcon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            const notificationDropdown = document.getElementById('notificationDropdown');
            if (notificationDropdown) {
                notificationDropdown.classList.toggle('active');
            } else {
                console.error('Notification dropdown element not found.');
            }
        });
    } else {
        console.error('Notification icon element not found.');
    }

    // Emit a request for the initial notification count on page load
    if (userId) {
        socket.emit('new-notification', userId);
    }

    // Handle other socket events or client-side logic here
});