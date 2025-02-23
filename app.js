// Register the Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}

// Request Notification Permission
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        document.getElementById('permissionStatus').textContent = 'Notifications are enabled!';
      } else if (permission === 'denied') {
        document.getElementById('permissionStatus').textContent = 'Notifications are blocked. Please enable them in your browser settings to receive reminders.';
      } else {
        document.getElementById('permissionStatus').textContent = 'Notification permission is pending.'; // 'default' state
      }
    });
  }
}

// Handle Reminder Setup
document.getElementById('setReminder').addEventListener('click', () => {
  const timeInput = document.getElementById('time').value;
  const tasksInput = document.getElementById('tasks').value;

  if (!timeInput || !tasksInput) {
    alert('Please fill in both fields.');
    return;
  }

  const now = new Date();
  const [hours, minutes] = timeInput.split(':');
  const notificationTime = new Date();
  notificationTime.setHours(hours, minutes, 0, 0);
  const timeDifference = notificationTime - now;

  if (timeDifference <= 0) {
    alert('Please select a future time.');
    return;
  }

  // Send a message to the service worker to schedule the notification
  navigator.serviceWorker.ready.then(registration => {
    if (registration.active) { // Make sure service worker is active
      registration.active.postMessage({
        type: 'schedule-notification',
        time: notificationTime.getTime(), // Send timestamp
        tasks: tasksInput
      });
      document.getElementById('status').textContent = `Reminder set for ${timeInput}.`;
    } else {
      console.error('Service worker is not active.');
      document.getElementById('status').textContent = 'Error: Service worker is not active.  Try refreshing.';
    }
  });
});

// Request notification permission on page load
requestNotificationPermission();
