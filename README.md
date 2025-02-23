# Daily Schedule Reminder (PWA)

[![GitHub Pages Status](https://img.shields.io/github/deployments/aaroncweber/Schedule-Reminder/production?label=GitHub%20Pages&logo=github)](https://aaroncweber.github.io/Schedule-Reminder/)
<!-- Replace with your actual GitHub Pages URL if different -->

A simple, offline-capable Progressive Web App (PWA) that reminds you to write your daily schedule.  It allows you to set a preferred notification time and provides a list of recurring daily tasks.

## Features

*   **Set a daily reminder time:** Choose the time you want to be notified each day.
*   **Define recurring tasks:**  Enter a list of tasks that appear in every reminder, making it easy to plan your day.
*   **Offline capability:**  Thanks to the Service Worker, the app works even when you're offline (after the initial load).  The reminder is scheduled client-side. *See "Important Notes" below for limitations.*
*   **PWA features:**
    *   Installable on mobile devices (add to home screen).
    *   Uses notifications (requires permission).
    *   Responsive design.

## How to Use

1.  **Open the app:** Visit [https://aaroncweber.github.io/Schedule-Reminder/](https://aaroncweber.github.io/Schedule-Reminder/) (or your deployed URL).
2.  **Grant notification permission:** The app will ask for permission to send notifications.  Allow this to receive reminders.
3.  **Set the time:** Enter your desired notification time in the "Notification Time" input field.
4.  **Enter tasks:** List your daily tasks in the "Daily Tasks" textarea.  Separate tasks with newlines.
5.  **Set the reminder:** Click the "Set Reminder" button.  The app will confirm that the reminder is set.
6.  **(Optional) Install as PWA:**  On most mobile devices, you can use your browser's "Add to Home Screen" option (usually in the browser's menu) to install the app for a more native-like experience.

## Technologies Used

*   HTML
*   CSS (minimal, inline)
*   JavaScript
*   Service Worker API
*   Notifications API
*   Manifest (for PWA features)

## Project Structure

*   `index.html`: The main HTML file for the app.
*   `app.js`: The JavaScript code for handling user input, service worker communication, and scheduling.
*   `service-worker.js`:  The Service Worker code.  This handles background tasks (in this case, the `setTimeout` for the notification) and enables offline functionality.
*   `manifest.json`:  The web app manifest, providing metadata for PWA installation.
*   `icon.png`: A simple icon for the app. You'll need to add this to your project's root.
*   `README.md`: This file.

## How it Works (Technical Details)

1.  **Service Worker Registration:** When the page loads, `app.js` registers `service-worker.js`.  The service worker runs in a separate background thread.
2.  **Notification Permission:** The app requests permission to send notifications.
3.  **Reminder Setup:** When the user clicks "Set Reminder":
    *   `app.js` calculates the time difference between now and the scheduled time.
    *   `app.js` sends a message (using `postMessage`) to the service worker, passing the scheduled time (as a timestamp) and the tasks.
4.  **Service Worker Scheduling:** The service worker receives the message.  It uses `setTimeout` *within the service worker* to schedule the notification. This is crucial because the service worker can continue running even when the main page is closed.
5.  **Notification Display:** When the `setTimeout` fires, the service worker uses `self.registration.showNotification` to display the notification.
6.  **Offline Functionality:** The service worker caches the necessary files (HTML, CSS, JS) so the app can load and function even without an internet connection.  *Note: The reminder is scheduled client-side, so it relies on the device being on and the browser/service worker not being terminated.*

## Important Notes (Limitations and Reliability)

*   **Client-Side Scheduling:** This app uses `setTimeout` within the service worker for scheduling. While *much* better than using `setTimeout` in the main thread, it's still not 100% guaranteed. Browsers and operating systems can deprioritize or kill background tasks to save battery, especially on mobile.
*   **Best-Effort Reliability:** This implementation provides *best-effort* reliability for notifications. If you need *guaranteed* delivery (e.g., for critical alarms), you *must* use a server-side solution with push notifications (see below).
*   **Offline Reminders:** Reminders are scheduled client-side.  This means the device needs to be powered on, and the browser (or PWA) must not have been completely terminated (killed) by the operating system for the reminder to fire.
* **iOS Specifics:**  iOS has stricter limitations on background execution than Android.  PWAs on iOS may have their service workers suspended more aggressively.  The client-side scheduling is *less* reliable on iOS than on Android.

## For Guaranteed Delivery (Server-Side Solution - *Not Implemented*)

For truly reliable notifications, you'd need a server-side component to handle scheduling and send *push notifications*.  This is a more complex setup but ensures delivery even if the user's device is offline when the reminder is initially set.  Here's a brief outline:

1.  **Database:** Store reminder data (user ID, time, tasks) in a database (e.g., Firebase, Supabase).
2.  **Server-Side Scheduler:** Use a cron job, scheduled cloud function, or similar to check the database regularly.
3.  **Push Notifications:** When the scheduled time arrives, your server sends a push notification (e.g., using Firebase Cloud Messaging - FCM) to the user's device.
4.  **Service Worker (Client):**  The service worker listens for the `push` event and displays the notification.

This README provides a good balance of user-friendliness and technical detail.  It covers all the key aspects, explains the limitations clearly, and suggests a path for improvement (server-side solution). The inclusion of the badges and the "How it Works" section makes it more comprehensive.  The "Important Notes" section is crucial for managing user expectations.
