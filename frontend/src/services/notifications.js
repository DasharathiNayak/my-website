const STORAGE_KEY = "testcraftai_notifications";
const SETTINGS_KEY = "testcraftai_notification_settings";
const EVENT_NAME = "testcraftai-notification-change";

const defaultSettings = {
  system: true,
  ai: true,
};

function readNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeNotifications(notifications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// Always use the current profile name. This means old notifications also
// update when the user changes their name in Settings.
function getCurrentUserName() {
  const candidates = [
    localStorage.getItem("user_name"),
    localStorage.getItem("user_fullname"),
    localStorage.getItem("fullname"),
    localStorage.getItem("name"),
  ];

  for (const value of candidates) {
    const name = String(value || "").trim();
    if (name && name.toLowerCase() !== "undefined" && name.toLowerCase() !== "null") {
      return name;
    }
  }

  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      const name = String(user?.fullname || user?.name || "").trim();
      if (name) return name;
    }
  } catch {
    // Ignore malformed cached user data.
  }

  return "User";
}

function normalizeNotificationMessage(message) {
  const currentName = getCurrentUserName();
  const text = String(message || "").trim();

  if (!text) {
    return `${currentName} performed an action.`;
  }

  // Password/profile notifications previously stored the actor directly in
  // the message (for example: "Varun changed..."). Replace that actor with
  // the current profile name so existing notifications stay up to date.
  const actorActionPattern = /^(?:undefined|null|User|[A-Za-z][A-Za-z .'-]{0,80})\s+(?=(?:changed|created|updated|deleted|generated|added|removed|saved|uploaded|downloaded|cleared|marked|closed|opened|verified|reset|enabled|disabled)\b)/i;

  if (actorActionPattern.test(text)) {
    return text.replace(actorActionPattern, `${currentName} `);
  }

  // New notifications should always identify the user who performed the
  // action. Avoid adding the name twice if it is already present.
  if (text.toLowerCase().startsWith(`${currentName.toLowerCase()} `)) {
    return text;
  }

  return `${currentName} — ${text}`;
}

function toDisplayNotification(item) {
  return {
    ...item,
    message: normalizeNotificationMessage(item.message),
  };
}

export function getNotificationSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...defaultSettings, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveNotificationSettings(settings) {
  const next = { ...defaultSettings, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
  return next;
}

export function getNotifications() {
  return readNotifications().map(toDisplayNotification);
}

export function getUnreadNotificationCount() {
  return readNotifications().filter((item) => !item.read).length;
}

export function addNotification({
  title,
  message,
  type = "system",
  icon = "🔔",
}) {
  if (typeof window === "undefined") return null;

  const settings = getNotificationSettings();
  if (settings[type] === false) return null;

  // Store the original message without a permanently saved actor name.
  // The display layer resolves the current profile name every time.
  const notification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    message,
    type,
    icon,
    read: false,
    timestamp: new Date().toISOString(),
  };

  const next = [notification, ...readNotifications()].slice(0, 60);
  writeNotifications(next);
  return toDisplayNotification(notification);
}

export function markNotificationRead(id) {
  const next = readNotifications().map((item) =>
    item.id === id ? { ...item, read: true } : item
  );
  writeNotifications(next);
}

export function markAllNotificationsRead() {
  const next = readNotifications().map((item) => ({
    ...item,
    read: true,
  }));
  writeNotifications(next);
}

export function clearNotifications() {
  writeNotifications([]);
}

export { EVENT_NAME as NOTIFICATION_EVENT };
