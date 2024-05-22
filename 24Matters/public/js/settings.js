document.addEventListener('DOMContentLoaded', function() {
  const themeSelect = document.getElementById('themeSelect');
  const widgetConfigForm = document.getElementById('widgetConfigForm');

  themeSelect.addEventListener('change', function() {
    updateUserSettings({ theme: this.value });
  });

  widgetConfigForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const dashboardWidgets = {};
    formData.forEach((value, key) => {
      dashboardWidgets[key] = value;
    });
    updateUserSettings({ dashboardWidgets: dashboardWidgets });
  });

  async function updateUserSettings(settings) {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Assuming the existence of a function to get the auth token
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Settings updated successfully', data);
        alert('Settings updated successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  }
});