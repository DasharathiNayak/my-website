import { useEffect, useState } from "react";
import { FaBell, FaCheck, FaTrash } from "react-icons/fa";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  NOTIFICATION_EVENT,
} from "../services/notifications";

import "../styles/notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();

    const handleNotificationChange = () => {
      loadNotifications();
    };

    window.addEventListener(
      NOTIFICATION_EVENT,
      handleNotificationChange
    );

    return () => {
      window.removeEventListener(
        NOTIFICATION_EVENT,
        handleNotificationChange
      );
    };
  }, []);

  const handleRead = (id) => {
    markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  const handleClearAll = () => {
    clearNotifications();
  };

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();

    const diff = Math.floor(
      (now - date) / 1000
    );

    if (diff < 60) {
      return "Just now";
    }

    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} min ago`;
    }

    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hr ago`;
    }

    return date.toLocaleDateString();
  };

  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>
          <h1>
            <FaBell />
            Notifications
          </h1>

          <p>
            Stay updated with your TestCraftAI activities.
          </p>
        </div>

        <div className="notifications-actions">

          {unreadCount > 0 && (
            <button
              className="notification-action-btn"
              onClick={handleMarkAllRead}
            >
              <FaCheck />
              Mark all as read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              className="notification-clear-btn"
              onClick={handleClearAll}
            >
              <FaTrash />
              Clear all
            </button>
          )}

        </div>
      </div>

      <div className="notification-summary">
        <span>
          {notifications.length} notification
          {notifications.length !== 1 ? "s" : ""}
        </span>

        {unreadCount > 0 && (
          <span className="notification-unread-count">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="notifications-list">

        {notifications.length === 0 ? (

          <div className="notifications-empty">

            <div className="notifications-empty-icon">
              🔔
            </div>

            <h2>No notifications yet</h2>

            <p>
              When something is generated or modified,
              it will appear here.
            </p>

          </div>

        ) : (

          notifications.map((item) => (

            <button
              key={item.id}
              type="button"
              className={`notification-card ${
                item.read
                  ? "notification-read"
                  : "notification-unread"
              }`}
              onClick={() => handleRead(item.id)}
            >

              <div className="notification-card-icon">
                {item.icon || "🔔"}
              </div>

              <div className="notification-card-content">

                <div className="notification-card-title-row">

                  <h3>
                    {item.title}
                  </h3>

                  {!item.read && (
                    <span className="notification-new-badge">
                      NEW
                    </span>
                  )}

                </div>

                <p>
                  {item.message}
                </p>

                <span className="notification-card-time">
                  {formatTime(item.timestamp)}
                </span>

              </div>

              {!item.read && (
                <span className="notification-unread-dot" />
              )}

            </button>

          ))

        )}

      </div>

    </div>
  );
}