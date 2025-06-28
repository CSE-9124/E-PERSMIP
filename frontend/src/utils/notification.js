let notificationCallback = null;

export const setNotificationCallback = (callback) => {
  notificationCallback = callback;
};

export const showNotification = (message, type = "info") => {
  if (notificationCallback) {
    notificationCallback(message, type);
  } else {
    console.warn("Notification system not initialized, falling back to alert");
    alert(message);
  }
};
