import { useEffect, useState } from "react";
import api from "../services/api";
import { addNotification } from "../services/notifications";
import "../styles/settings.css";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [responseStyle, setResponseStyle] = useState(() => {
    return localStorage.getItem("testcraftai_response_style") || "balanced";
  });

  const [savedTheme, setSavedTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const isDarkTheme =
    savedTheme === "dark" ||
    (savedTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const [loading, setLoading] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const applyTheme = (selectedTheme) => {
    const shouldBeDark =
      selectedTheme === "dark" ||
      (selectedTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark-theme", shouldBeDark);
    document.body.classList.toggle("dark-theme", shouldBeDark);
    document.documentElement.dataset.theme = selectedTheme;
    document.body.dataset.theme = selectedTheme;
  };

  useEffect(() => {
    applyTheme(savedTheme);
  }, [savedTheme]);

  useEffect(() => {
    const handleExternalThemeChange = (event) => {
      const nextTheme =
        event.detail?.theme || localStorage.getItem("theme") || "light";
      setTheme(nextTheme);
      setSavedTheme(nextTheme);
    };

    window.addEventListener("testcraftai-theme-change", handleExternalThemeChange);

    return () => {
      window.removeEventListener("testcraftai-theme-change", handleExternalThemeChange);
    };
  }, []);

  const handleThemeSave = () => {
    localStorage.setItem("theme", theme);
    setSavedTheme(theme);
    applyTheme(theme);

    window.dispatchEvent(
      new CustomEvent("testcraftai-theme-change", {
        detail: { theme },
      })
    );
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await api.get(`/users/${userId}`);

        const currentFullname = response.data.fullname || "";

        setProfile({
          fullname: currentFullname,
          email: response.data.email || "",
        });

        if (currentFullname) {
          localStorage.setItem("user_name", currentFullname);
          localStorage.setItem("user_fullname", currentFullname);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const sections = [
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
      description: "Manage your personal information",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: "🎨",
      description: "Customize how TestCraftAI looks",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "🔔",
      description: "Manage notification preferences",
    },
    {
      id: "ai",
      label: "AI Preferences",
      icon: "🤖",
      description: "Configure AI assistant preferences",
    },
    {
      id: "security",
      label: "Security",
      icon: "🔐",
      description: "Manage password and account security",
    },
    {
      id: "about",
      label: "About",
      icon: "ℹ️",
      description: "TestCraftAI information",
    },
  ];

  return (
    <div
      className="settings-page"
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "32px",
        background: isDarkTheme ? "#0b1220" : "#f5f7fb",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            fontWeight: 700,
            color: isDarkTheme ? "#f8fafc" : "#0f172a",
          }}
        >
          Settings
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: isDarkTheme ? "#94a3b8" : "#64748b",
            fontSize: "15px",
          }}
        >
          Manage your account and TestCraftAI preferences.
        </p>
      </div>

      {/* Settings Layout */}
      <div
        className="settings-layout"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Sidebar */}
        <div
          className="settings-sidebar"
          style={{
            background: isDarkTheme ? "#111b2e" : "#ffffff",
            border: `1px solid ${isDarkTheme ? "#263957" : "#e2e8f0"}`,
            borderRadius: "14px",
            padding: "8px",
          }}
        >
          {sections.map((section) => {
            const active = activeSection === section.id;

            return (
              <button
                className={`settings-nav-item ${active ? "active" : ""}`}
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: "100%",
                  border: "none",
                  background: active
                    ? isDarkTheme
                      ? "#1b2a44"
                      : "#eef2ff"
                    : "transparent",
                  borderRadius: "10px",
                  outline: "none",
                  boxShadow: "none",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  textAlign: "left",
                  cursor: "pointer",
                  marginBottom: "3px",
                }}
              >
                <span
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "9px",
                    background: isDarkTheme
                      ? active
                        ? "#243653"
                        : "#18253a"
                      : active
                        ? "#ffffff"
                        : "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                  }}
                >
                  {section.icon}
                </span>

                <span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: active ? 700 : 600,
                      color: active
                        ? isDarkTheme
                          ? "#a5b4fc"
                          : "#4338ca"
                        : isDarkTheme
                          ? "#e2e8f0"
                          : "#334155",
                    }}
                  >
                    {section.label}
                  </span>

                  <span
                    style={{
                      display: "block",
                      marginTop: "2px",
                      fontSize: "11px",
                      color: isDarkTheme ? "#94a3b8" : "#64748b",
                    }}
                  >
                    {section.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          className="settings-content-card"
          style={{
            background: isDarkTheme ? "#111b2e" : "#ffffff",
            border: `1px solid ${isDarkTheme ? "#263957" : "#e2e8f0"}`,
            borderRadius: "14px",
            padding: "26px",
            minHeight: "500px",
          }}
        >
          {activeSection === "profile" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ margin: 0 }}>Profile</h2>

                <button
                  type="button"
                  onClick={() => setEditingProfile(true)}
                  style={{
                    padding: "9px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Edit Profile
                </button>
              </div>
              <p style={{ color: isDarkTheme ? "#a8b5c8" : "#64748b" }}>
                Manage your personal information and account details.
              </p>

              <input
                type="text"
                placeholder="Your full name"
                value={profile.fullname}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    fullname: e.target.value,
                  })
                }
                disabled={!editingProfile}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Your email address"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                disabled={!editingProfile}
                style={inputStyle}
              />
            </>
          )}

          {activeSection === "appearance" && (
            <>
              <h2>Appearance</h2>
              <p style={{ color: isDarkTheme ? "#a8b5c8" : "#64748b" }}>
                Customize the appearance of TestCraftAI.
              </p>

              <div style={optionStyle}>
                <div>
                  <strong>Theme</strong>
                  <p style={smallText}>Choose your preferred interface theme.</p>
                </div>

                <select
                  className="settings-theme-select"
                  style={selectStyle}
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <button
                type="button"
                className="settings-primary-btn"
                onClick={handleThemeSave}
              >
                Save Theme
              </button>
            </>
          )}
          {activeSection === "profile" && (
          <button
            type="button"
            className="settings-primary-btn"
            onClick={async () => {
              const userId = localStorage.getItem("user_id");

              try {
                setSavingProfile(true);

                // Get current email from backend
                const currentResponse = await api.get(`/users/${userId}`);
                const currentEmail = currentResponse.data.email;

                // Email changed → send OTP first
                if (
                  profile.email.trim().toLowerCase() !==
                  currentEmail.trim().toLowerCase()
                ) {
                  setPendingEmail(profile.email.trim());

                  await api.post(`/users/${userId}/email/send-otp`, null, {
                    params: {
                      new_email: profile.email.trim(),
                    },
                  });

                  setOtp("");
                  setShowOtpModal(true);

                  alert("OTP sent to your new email address.");
                  return;
                }

                // Email unchanged → direct profile update
                const response = await api.put(`/users/${userId}`, null, {
                  params: {
                    fullname: profile.fullname,
                    email: profile.email,
                  },
                });

                setProfile({
                  fullname: response.data.fullname,
                  email: response.data.email,
                });

                localStorage.setItem("user_name", response.data.fullname || "User");
                localStorage.setItem("user_fullname", response.data.fullname || "User");

                setEditingProfile(false);

                alert("Profile updated successfully");
              } catch (error) {
                console.error("Profile update failed:", error);

                const message =
                  error.response?.data?.detail ||
                  "Failed to update profile";

                alert(message);
              } finally {
                setSavingProfile(false);
              }
            }}
            disabled={savingProfile}
            style={{
              marginTop: "20px",
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: savingProfile ? "not-allowed" : "pointer",
            }}
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
          )}
          {showOtpModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  width: "400px",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "28px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                }}
              >
                <h2 style={{ marginTop: 0 }}>Verify New Email</h2>

                <p style={{ color: "#6b7280", lineHeight: 1.5 }}>
                  We sent a 6-digit OTP to:
                </p>

                <p style={{ fontWeight: "600", marginBottom: "20px" }}>
                  {pendingEmail}
                </p>

                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    letterSpacing: "3px",
                    textAlign: "center",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpModal(false);
                      setOtp("");
                      setPendingEmail("");
                    }}
                    style={{
                      padding: "10px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const userId = localStorage.getItem("user_id");

                      try {
                        setOtpLoading(true);

                        const response = await api.post(
                          `/users/${userId}/email/verify-otp`,
                          null,
                          {
                            params: {
                              new_email: pendingEmail,
                              otp: otp,
                            },
                          }
                        );

                        setProfile((prev) => ({
                          ...prev,
                          email: response.data.email,
                        }));

                        if (profile.fullname) {
                          localStorage.setItem("user_name", profile.fullname);
                          localStorage.setItem("user_fullname", profile.fullname);
                        }

                        setShowOtpModal(false);
                        setOtp("");
                        setPendingEmail("");
                        setEditingProfile(false);

                        alert("Email updated successfully");
                      } catch (error) {
                        console.error("OTP verification failed:", error);

                        const message =
                          error.response?.data?.detail ||
                          "Invalid or expired OTP";

                        alert(message);
                      } finally {
                        setOtpLoading(false);
                      }
                    }}
                    disabled={otpLoading || otp.length !== 6}
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "8px",
                      cursor:
                        otpLoading || otp.length !== 6
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeSection === "notifications" && (
            <>
              <h2>Notifications</h2>
              <p style={{ color: isDarkTheme ? "#a8b5c8" : "#64748b" }}>
                Manage how you receive TestCraftAI notifications.
              </p>

              <div style={optionStyle}>
                <div>
                  <strong>System Notifications</strong>
                  <p style={smallText}>
                    Receive important application notifications.
                  </p>
                </div>

                <input type="checkbox" defaultChecked />
              </div>

              <div style={optionStyle}>
                <div>
                  <strong>AI Generation Updates</strong>
                  <p style={smallText}>
                    Get updates when AI generation is completed.
                  </p>
                </div>

                <input type="checkbox" defaultChecked />
              </div>
            </>
          )}

          {activeSection === "ai" && (
            <>
              <h2>AI Preferences</h2>
              <p style={{ color: isDarkTheme ? "#a8b5c8" : "#64748b" }}>
                Configure your AI Assistant preferences.
              </p>

              <div style={optionStyle}>
                <div>
                  <strong>Response Style</strong>
                  <p style={smallText}>
                    Choose how detailed AI responses should be.
                  </p>
                </div>

                <select
                  className="settings-response-style-select"
                  style={{
                    ...selectStyle,
                    background: savedTheme === "dark" ? "#101c30" : "#ffffff",
                    color: savedTheme === "dark" ? "#f8fafc" : "#334155",
                    borderColor: savedTheme === "dark" ? "#29415f" : "#dbe3ef",
                  }}
                  value={responseStyle}
                  onChange={(e) => {
                    const value = e.target.value;
                    setResponseStyle(value);
                    localStorage.setItem(
                      "testcraftai_response_style",
                      value
                    );
                  }}
                >
                  <option value="concise">Concise</option>
                  <option value="balanced">Balanced</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
            </>
          )}

          {activeSection === "security" && (
            <>
              <h2>Security</h2>
              <p style={{ color: isDarkTheme ? "#a8b5c8" : "#64748b" }}>
                Manage your account security settings.
              </p>

              <div style={optionStyle}>
                <div>
                  <strong>Password</strong>
                  <p style={smallText}>
                    Change your account password.
                  </p>
                </div>

                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </>
          )}

          {showPasswordModal && (
            <div style={passwordModalOverlayStyle}>
              <div style={passwordModalStyle}>
                <div style={passwordModalHeaderStyle}>
                  <div>
                    <h3 style={{ margin: 0, color: "#f8fafc" }}>Change Password</h3>
                    <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "13px" }}>
                      Update your TestCraftAI account password.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    style={passwordCloseButtonStyle}
                  >
                    ×
                  </button>
                </div>

                <div style={passwordFieldWrapStyle}>
                  <label style={passwordLabelStyle}>Current Password</label>
                  <div style={passwordInputWrapStyle}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      style={passwordInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={passwordEyeButtonStyle}
                    >
                      {showCurrentPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div style={passwordFieldWrapStyle}>
                  <label style={passwordLabelStyle}>New Password</label>
                  <div style={passwordInputWrapStyle}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      style={passwordInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={passwordEyeButtonStyle}
                    >
                      {showNewPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div style={passwordFieldWrapStyle}>
                  <label style={passwordLabelStyle}>Confirm New Password</label>
                  <div style={passwordInputWrapStyle}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      style={passwordInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={passwordEyeButtonStyle}
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <p style={passwordHintStyle}>
                  Use at least 8 characters for your new password.
                </p>

                <div style={passwordActionsStyle}>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    style={passwordCancelButtonStyle}
                    disabled={passwordLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={passwordLoading}
                    style={passwordSaveButtonStyle}
                    onClick={async () => {
                      if (!currentPassword || !newPassword || !confirmPassword) {
                        alert("Please fill all password fields.");
                        return;
                      }

                      if (newPassword.length < 8) {
                        alert("New password must be at least 8 characters.");
                        return;
                      }

                      if (newPassword !== confirmPassword) {
                        alert("New password and confirm password do not match.");
                        return;
                      }

                      if (currentPassword === newPassword) {
                        alert("New password must be different from your current password.");
                        return;
                      }

                      const userId = localStorage.getItem("user_id");

                      if (!userId) {
                        alert("User session not found. Please login again.");
                        return;
                      }

                      try {
                        setPasswordLoading(true);

                        await api.post(`/users/${userId}/change-password`, {
                          current_password: currentPassword,
                          new_password: newPassword,
                        });

                        addNotification({
                          title: "Password Changed",
                          message: "changed the account password successfully.",
                          type: "system",
                          icon: "🔐",
                        });

                        alert("Password changed successfully.");

                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setShowPasswordModal(false);
                      } catch (error) {
                        alert(
                          error.response?.data?.detail ||
                          "Failed to change password. Please try again."
                        );
                      } finally {
                        setPasswordLoading(false);
                      }
                    }}
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "about" && (
            <>
              <h2>About TestCraftAI</h2>
              <p
                style={{
                  color: isDarkTheme ? "#a8b5c8" : "#64748b",
                  lineHeight: 1.7,
                }}
              >
                TestCraftAI is an AI-powered software testing platform for
                generating test cases, bug reports, automation scripts and
                testing analytics.
              </p>

              <div
                style={{
                  marginTop: "24px",
                  padding: "18px",
                  background: isDarkTheme ? "#18253a" : "#f8fafc",
                  borderRadius: "10px",
                  border: `1px solid ${isDarkTheme ? "#2b4161" : "#e2e8f0"}`,
                }}
              >
                <strong style={{ color: isDarkTheme ? "#f1f5f9" : "#0f172a" }}>Version</strong>
                <div
                  style={{
                    marginTop: "5px",
                    color: isDarkTheme ? "#a8b5c8" : "#64748b",
                  }}
                >
                  TestCraftAI v1.0.0
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: "7px",
  padding: "11px 13px",
  border: "1px solid #dbe3ef",
  borderRadius: "9px",
  outline: "none",
  fontSize: "14px",
};

const optionStyle = {
  marginTop: "20px",
  padding: "16px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
};

const smallText = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: "13px",
};

const selectStyle = {
  padding: "9px 12px",
  border: "1px solid #dbe3ef",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#334155",
  fontSize: "13px",
};

const secondaryButtonStyle = {
  padding: "9px 14px",
  border: "1px solid #dbe3ef",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#334155",
  fontWeight: 600,
  cursor: "pointer",
};

const passwordModalOverlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(2, 6, 23, 0.72)",
  backdropFilter: "blur(7px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const passwordModalStyle = {
  width: "100%",
  maxWidth: "500px",
  background: "#0f1a2d",
  border: "1px solid #29415f",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 25px 70px rgba(0,0,0,0.45)",
};

const passwordModalHeaderStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "15px",
  marginBottom: "22px",
};

const passwordCloseButtonStyle = {
  width: "34px",
  height: "34px",
  border: "1px solid #29415f",
  borderRadius: "9px",
  background: "#142238",
  color: "#cbd5e1",
  fontSize: "22px",
  cursor: "pointer",
};

const passwordFieldWrapStyle = {
  marginBottom: "16px",
};

const passwordLabelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#dbeafe",
  fontSize: "13px",
  fontWeight: 600,
};

const passwordInputWrapStyle = {
  position: "relative",
};

const passwordInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 45px 12px 13px",
  border: "1px solid #29415f",
  borderRadius: "10px",
  outline: "none",
  background: "#0b1424",
  color: "#f8fafc",
  fontSize: "14px",
};

const passwordEyeButtonStyle = {
  position: "absolute",
  right: "7px",
  top: "50%",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "16px",
};

const passwordHintStyle = {
  margin: "4px 0 20px",
  color: "#94a3b8",
  fontSize: "12px",
};

const passwordActionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

const passwordCancelButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #29415f",
  borderRadius: "9px",
  background: "transparent",
  color: "#cbd5e1",
  fontWeight: 600,
  cursor: "pointer",
};

const passwordSaveButtonStyle = {
  padding: "10px 17px",
  border: "none",
  borderRadius: "9px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};