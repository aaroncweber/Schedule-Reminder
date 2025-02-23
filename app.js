if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}

// Function to update the permission status message
function updatePermissionStatus(permission) {
    if (permission === 'granted') {
        document.getElementById('permissionStatus').textContent = 'Notifications are enabled!';
    } else if (permission === 'denied') {
        document.getElementById('permissionStatus').textContent = 'Notifications are blocked. Please enable them in your browser settings to receive reminders.';
    } else {
        document.getElementById('permissionStatus').textContent = 'Notification permission is pending.'; // 'default' state
    }
}

// Request Notification Permission AND update status
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      updatePermissionStatus(permission); // Update status *after* the promise resolves
    });
  }
}

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

  // Check notification permission *before* sending the message to the service worker
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      // More robust service worker ready check (using oncontrollerchange)
      if (registration.active) {
        sendMessageToServiceWorker(registration, notificationTime, tasksInput);
      } else {
          // Wait for the service worker to become active.
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (navigator.serviceWorker.controller){
                sendMessageToServiceWorker(navigator.serviceWorker, notificationTime, tasksInput);
            }
          });
      }
    });
  } else if (Notification.permission === 'denied') {
      alert('Notifications are blocked.  Please enable them in your browser settings.'); // User-friendly alert
      updatePermissionStatus(Notification.permission);
  } else {
    // If permission is 'default', request it again
    requestNotificationPermission();
  }
});

function sendMessageToServiceWorker(registration, notificationTime, tasksInput){
    registration.active.postMessage({
        type: 'schedule-notification',
        time: notificationTime.getTime(), // Send timestamp
        tasks: tasksInput
    });
    document.getElementById('status').textContent = `Reminder set for ${document.getElementById('time').value}.`;
}


// Request notification permission on page load AND check current state
requestNotificationPermission();
if ('Notification' in window) {
    updatePermissionStatus(Notification.permission); // Set initial status
}
