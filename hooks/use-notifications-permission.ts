"use client";

import { useState, useEffect, useCallback } from "react";

export function useNotificationsPermission() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  }, []);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission !== "granted") return;

      new Notification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        ...options,
      });
    },
    [permission]
  );

  return { permission, requestPermission, showNotification };
}