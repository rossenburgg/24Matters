document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.querySelector('#sidebarToggle');
    const sidebar = document.querySelector('#adminSidebar');

    if (!sidebarToggle || !sidebar) {
        console.error('Sidebar or toggle button not found');
        return;
    }

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
});