document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('liveStatsIcon').addEventListener('click', function() {
    const liveStatsSection = document.getElementById('liveStats');
    if (liveStatsSection) {
      liveStatsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Placeholder actions for modal triggers
  document.getElementById('settingsIcon').addEventListener('click', function() {
    alert('Settings Placeholder');
  });

  document.getElementById('hotkeysIcon').addEventListener('click', function() {
    alert('Hotkeys Placeholder');
  });

  document.getElementById('fairnessIcon').addEventListener('click', function() {
    alert('Fairness Placeholder');
  });
});