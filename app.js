// Register the Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}

// Request Notification Permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notifications enabled');
    } else if (permission === 'denied') {
      alert('Notifications are disabled. Please enable them in your device settings.');
    }
  } else {
    alert('Your browser does not support notifications.');
  }
}

// Call this function when the page loads or on user interaction
document.addEventListener('DOMContentLoaded', () => {
  requestNotificationPermission();
});


// Handle Reminder Setup
document.getElementById('setReminder').addEventListener('click', () => {
  const timeInput = document.getElementById('time').value;
  const tasksInput = document.getElementById('tasks').value;

  if (!timeInput || !tasksInput) {
    alert('Please fill in both fields.');
    return;
  }

  // Calculate the time difference for the notification
  const now = new Date();
  const [hours, minutes] = timeInput.split(':');
  const notificationTime = new Date();
  notificationTime.setHours(hours, minutes, 0, 0);

  const timeDifference = notificationTime - now;
  
  if (timeDifference <= 0) {
    alert('Please select a future time.');
    return;
  }

  // Schedule the Notification
  setTimeout(() => {
    sendNotification(tasksInput);
  }, timeDifference);

  document.getElementById('status').textContent = `Reminder set for ${timeInput}.`;
});

// Send Notification
function sendNotification(tasks) {
  if ('Notification' in window && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Daily Schedule Reminder', {
        body: `Tasks:\n${tasks}`,
        icon: 'icon.png',
      });
    });
  }
}

// Request notification permission on page load
requestNotificationPermission();
