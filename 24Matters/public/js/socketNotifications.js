document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Assuming the user's ID is stored in a meta tag for simplicity
    const userIdMeta = document.querySelector('meta[name="user-id"]');
    const userId = userIdMeta ? userIdMeta.content : null;

    if (!userId) {
        console.error('User ID not found. Ensure the meta tag for user ID is correctly set.');
        return;
    }

    // Register with the server for this user's notifications
    socket.emit('register', userId);

    // Fetch and display initial notifications
    const fetchInitialNotifications = async () => {
        try {
            const response = await fetch('/api/notifications/unread');
            if (!response.ok) {
                throw new Error('Failed to fetch initial notifications');
            }
            const notifications = await response.json();
            const notificationDropdown = document.getElementById('notificationDropdown');
            if (notifications.data.length > 0) {
                notifications.data.forEach(notification => {
                    const notificationElement = document.createElement('div');
                    notificationElement.textContent = notification.message;
                    notificationDropdown.appendChild(notificationElement);
                    notificationElement.addEventListener('click', () => {
                        notificationDropdown.classList.remove('active');
                    });
                });
            } else {
                const noNotificationsElement = document.createElement('div');
                noNotificationsElement.textContent = 'No notifications';
                notificationDropdown.appendChild(noNotificationsElement);
            }
            console.log('Initial notifications fetched and displayed successfully.');
        } catch (error) {
            console.error('Error fetching initial notifications:', error);
        }
    };

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
                // Prevent the dropdown from closing when it's clicked
                notificationDropdown.addEventListener('click', (e) => e.stopPropagation());
            } else {
                console.error('Notification dropdown element not found.');
            }
        });
    } else {
        console.error('Notification icon element not found.');
    }

    // Close the dropdown if clicked outside
    document.addEventListener('click', (event) => {
        const notificationDropdown = document.getElementById('notificationDropdown');
        if (notificationDropdown && !notificationDropdown.contains(event.target)) {
            notificationDropdown.classList.remove('active');
        }
    });

    // Emit a request for the initial notification count on page load
    if (userId) {
        socket.emit('request-initial-notifications', userId);
    }

    // Listen for real-time notifications
    socket.on('new notification', (notification) => {
        const notificationsDropdown = document.getElementById('notificationDropdown');
        if (notificationsDropdown) {
            // Assuming a function to create and return a notification element
            const notificationElement = document.createElement('div');
            notificationElement.textContent = notification.message;
            notificationsDropdown.appendChild(notificationElement);

            // Log the received notification
            console.log(`New notification received: ${notification.message}`);

            // Automatically close the dropdown after a notification is clicked
            notificationElement.addEventListener('click', () => {
                notificationsDropdown.classList.remove('active');
            });
        } else {
            console.error('Notifications dropdown element not found.');
        }
    });

    // Fetch initial notifications on page load
    fetchInitialNotifications();

    // Handle other socket events or client-side logic here
});