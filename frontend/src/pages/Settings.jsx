import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/settings.css";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

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

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await api.get(`/users/${userId}`);

        setProfile({
          fullname: response.data.fullname || "",
          email: response.data.email || "",
        });
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
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "32px",
        background: "#f5f7fb",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Settings
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#64748b",
            fontSize: "15px",
          }}
        >
          Manage your account and TestCraftAI preferences.
        </p>
      </div>

      {/* Settings Layout */}
      <div
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
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "8px",
          }}
        >
          {sections.map((section) => {
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: "100%",
                  border: "none",
                  background: active ? "#eef2ff" : "transparent",
                  borderRadius: "10px",
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
                    background: active ? "#ffffff" : "#f8fafc",
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
                      color: active ? "#4338ca" : "#334155",
                    }}
                  >
                    {section.label}
                  </span>

                  <span
                    style={{
                      display: "block",
                      marginTop: "2px",
                      fontSize: "11px",
                      color: "#94a3b8",
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
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
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
              <p style={{ color: "#64748b" }}>
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
              <p style={{ color: "#64748b" }}>
                Customize the appearance of TestCraftAI.
              </p>

              <div style={optionStyle}>
                <div>
                  <strong>Theme</strong>
                  <p style={smallText}>Choose your preferred interface theme.</p>
                </div>

                <select style={selectStyle} defaultValue="light">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
            </>
          )}
          <button
            type="button"
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
              <p style={{ color: "#64748b" }}>
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
              <p style={{ color: "#64748b" }}>
                Configure your AI Assistant preferences.
              </p>

              <div style={optionStyle}>
                <div>
                  <strong>Response Style</strong>
                  <p style={smallText}>
                    Choose how detailed AI responses should be.
                  </p>
                </div>

                <select style={selectStyle} defaultValue="balanced">
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
              <p style={{ color: "#64748b" }}>
                Manage your account security settings.
              </p>

              <div style={optionStyle}>
                <div>
                  <strong>Password</strong>
                  <p style={smallText}>
                    Change your account password.
                  </p>
                </div>

                <button style={secondaryButtonStyle}>
                  Change Password
                </button>
              </div>
            </>
          )}

          {activeSection === "about" && (
            <>
              <h2>About TestCraftAI</h2>
              <p style={{ color: "#64748b" }}>
                TestCraftAI is an AI-powered software testing platform for
                generating test cases, bug reports, automation scripts and
                testing analytics.
              </p>

              <div
                style={{
                  marginTop: "24px",
                  padding: "18px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <strong>Version</strong>
                <div style={{ marginTop: "5px", color: "#64748b" }}>
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