self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Optional: Open the app when notification is clicked.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === '/' && 'focus' in client) { // Check if client is the PWA
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('message', event => {
  if (event.data.type === 'schedule-notification') {
    const time = event.data.time;
    const tasks = event.data.tasks;
    const now = Date.now();
    const delay = time - now;

    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification('Daily Schedule Reminder', {
          body: `Tasks:\n${tasks}`,
          icon: 'icon.png',
        });
      }, delay);
    } else {
      console.log('Notification time is in the past.');
    }
  }
});
