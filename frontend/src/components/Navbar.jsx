import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

import {
  FaMoon,
  FaSun,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import {
  getUnreadNotificationCount,
  NOTIFICATION_EVENT,
} from "../services/notifications";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(() => {
    return getUnreadNotificationCount();
  });

  const [userName, setUserName] = useState("User");

useEffect(() => {
  const loadUserName = async () => {
    try {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        return;
      }

      const response = await api.get(`/users/${userId}`);

      setUserName(response.data.fullname || "User");
    } catch (error) {
      console.error("Failed to load username:", error);
    }
  };

  loadUserName();
}, []);

  useEffect(() => {
    const updateNotificationCount = () => {
      setUnreadCount(getUnreadNotificationCount());
    };

    updateNotificationCount();

    window.addEventListener(
      NOTIFICATION_EVENT,
      updateNotificationCount
    );

    return () => {
      window.removeEventListener(
        NOTIFICATION_EVENT,
        updateNotificationCount
      );
    };
  }, []);

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  const handleThemeToggle = () => {
    const nextDarkMode = !darkMode;
    const nextTheme = nextDarkMode ? "dark" : "light";

    setDarkMode(nextDarkMode);
    localStorage.setItem("theme", nextTheme);

    window.dispatchEvent(
      new CustomEvent("testcraftai-theme-change", {
        detail: { theme: nextTheme },
      })
    );
  };

  return (
    <header className="navbar">
      <div className="navbar-right">

        {/* Notification Bell */}
        <button
          className="icon-btn notification-btn"
          onClick={handleNotificationClick}
          title={
            unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""
              }`
              : "Notifications"
          }
        >
          <FaBell />

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={handleThemeToggle}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Profile */}
        <div className="profile">
          <FaUserCircle className="profile-icon" />

          <div>
            <h4>
              {userName}
            </h4>

            <span>Software Tester</span>
          </div>
        </div>

      </div>
    </header>
  );
}