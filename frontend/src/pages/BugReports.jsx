import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as dashboardService from "../services/dashboardService";
import "../styles/bugReports.css";

export default function BugReports() {

  const [bugReports, setBugReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterUser, setFilterUser] = useState("All");

  const [loading, setLoading] = useState(true);
  const [editBug, setEditBug] = useState(null);

  // Project ID
  const { id } = useParams();
  const navigate = useNavigate();

  const currentProjectId = id;

  // ============================================================
  // LOAD BUG REPORTS
  // ============================================================

  const loadProjects = async () => {
    try {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        setProjects([]);
        return;
      }

      const response =
        await dashboardService.getProjects(userId);

      setProjects(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Projects loading error:",
        err
      );
      setProjects([]);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await dashboardService.getAllUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Users loading error:", err);
      setUsers([]);
    }
  };

  const loadBugReports = async () => {


    try {

      setLoading(true);

      const response =
        await dashboardService.getAllBugReports();

      const bugs = Array.isArray(response.data)
        ? response.data
        : [];

      setBugReports(bugs);
      console.log("BUGS FROM API:", response.data);

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.detail ||
        "Failed to load bug reports"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadProjects();
    loadBugReports();
    loadUsers();
  }, [currentProjectId]);


  // ============================================================
  // DELETE BUG
  // ============================================================

  const handleDelete = async (bugId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this bug report?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await dashboardService.deleteBugReport(bugId);

      toast.success(
        "Bug Report deleted successfully"
      );

      loadBugReports();

    } catch (err) {

      toast.error(
        err.response?.data?.detail ||
        "Failed to delete bug report"
      );

    }
  };


  // ============================================================
  // UPDATE BUG STATUS
  // ============================================================

  const handleStatusChange = async (
    bugId,
    status
  ) => {

    try {

      await dashboardService.updateBugReport(
        bugId,
        { status }
      );

      toast.success(
        "Bug status updated successfully"
      );

      loadBugReports();

    } catch (err) {

      toast.error(
        err.response?.data?.detail ||
        "Failed to update bug status"
      );

    }
  };


  // ============================================================
  // EDIT BUG
  // ============================================================

  const handleEditSave = async () => {

    if (!editBug) {
      return;
    }

    try {

      await dashboardService.updateBugReport(
        editBug.id,
        {
          title: editBug.title,
          severity: editBug.severity,
          priority: editBug.priority,
          environment: editBug.environment,
          pre_condition: editBug.pre_condition,
          steps_to_reproduce:
            editBug.steps_to_reproduce,
          expected_result:
            editBug.expected_result,
          actual_result:
            editBug.actual_result,
          status: editBug.status
        }
      );

      toast.success(
        "Bug Report updated successfully"
      );

      setEditBug(null);

      loadBugReports();

    } catch (err) {

      toast.error(
        err.response?.data?.detail ||
        "Failed to update bug report"
      );

    }
  };


  // ============================================================
  // FILTER
  // ============================================================

  const projectBugs = currentProjectId
    ? bugReports.filter(
        (bug) =>
          String(bug.project_id) === String(currentProjectId)
      )
    : bugReports;

  const filteredBugs = projectBugs.filter((bug) => {
    const matchesStatus =
      filterStatus === "All" ||
      bug.status === filterStatus;

    const matchesUser =
      filterUser === "All" ||
      String(bug.assigned_to) === String(filterUser);

    return matchesStatus && matchesUser;
  });


  // ============================================================
  // LOADING
  // ============================================================
  const projectBugCounts = projects
    .map((project) => ({
      ...project,
      bugCount: bugReports.filter(
        (bug) =>
          String(bug.project_id) === String(project.id)
      ).length
    }))
    .filter((project) => project.bugCount > 0);

  if (loading) {

    return (
      <div style={styles.center}>
        Loading Bug Reports...
      </div>
    );

  }


  return (
    <div className="bug-reports-page">

      {!currentProjectId ? (
        <>
          {/* ================================================= */}
          {/* PROJECT FOLDERS */}
          {/* ================================================= */}

          <div className="bug-page-header">
            <div>
              <span className="section-label">
                TESTING
              </span>

              <h1>
                🪲 Bug Reports
              </h1>

              <p className="bug-page-subtitle">
                Select a project to view its bug reports.
              </p>
            </div>
          </div>

          <div className="generated-project-grid">
            {projectBugCounts.map((project) => (
              <div
                className="generated-project-card"
                key={project.id}
              >
                <div className="generated-project-icon">
                  🪲
                </div>

                <div className="generated-project-info">
                  <h2>
                    {project.project_name}
                  </h2>

                  <p>
                    {project.description ||
                      "Bug Tracking Project"}
                  </p>

                  <span>
                    🐞 {project.bugCount} Bug
                    {project.bugCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <button
                  className="generated-open-btn"
                  onClick={() =>
    navigate(`/project/${project.id}/bug-reports`)

                  }
                >
                  Open →
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* ================================================= */}
          {/* PROJECT BUG REPORTS */}
          {/* ================================================= */}

          <button
            className="bug-back-btn"
            onClick={() =>
    navigate("/bug-reports")
}
          >
            ← Back to Bug Reports
          </button>

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="bug-page-header">

            <div>
              <h1 style={styles.heading}>
                🪲 Bug Reports
              </h1>

              <p className="bug-page-subtitle">
                Manage and track all bug reports
                for this project.
              </p>
            </div>

            {/* STATUS + TESTER FILTER */}

            <div className="bug-filter-box">

              <label className="bug-filter-label">
                Status
              </label>

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value)
                }
                style={styles.select}
              >
                <option value="All">
                  All
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Clarified">
                  Clarified
                </option>
              </select>

              <label className="bug-filter-label">
                Tester
              </label>

              <select
                value={filterUser}
                onChange={(e) =>
                  setFilterUser(e.target.value)
                }
                style={styles.select}
              >
                <option value="All">
                  All Testers
                </option>

                {users.map((user) => (
                  <option
                    key={user.user_id}
                    value={user.user_id}
                  >
                    {user.fullname}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="bug-summary">

            <div className="bug-summary-card">
              <span>Total</span>
              <strong>
                {projectBugs.length}
              </strong>
            </div>

            <div className="bug-summary-card">
              <span>Open</span>
              <strong>
                {
                  projectBugs.filter(
                    (b) => b.status === "Open"
                  ).length
                }
              </strong>
            </div>

            <div className="bug-summary-card">
              <span>Resolved</span>
              <strong>
                {
                  projectBugs.filter(
                    (b) => b.status === "Resolved"
                  ).length
                }
              </strong>
            </div>

            <div className="bug-summary-card">
              <span>Rejected</span>
              <strong>
                {
                  projectBugs.filter(
                    (b) => b.status === "Rejected"
                  ).length
                }
              </strong>
            </div>

            <div className="bug-summary-card">
              <span>Clarified</span>
              <strong>
                {
                  projectBugs.filter(
                    (b) => b.status === "Clarified"
                  ).length
                }
              </strong>
            </div>

          </div>

          {/* ================================================= */}
          {/* BUG REPORT LIST */}
          {/* ================================================= */}

          {filteredBugs.length === 0 ? (

            <div className="bug-empty">

              <div className="bug-empty-icon">
                🪲
              </div>

              <h2>
                No Bug Reports Found
              </h2>

              <p>
                Bugs added from Generated Test
                Cases will appear here.
              </p>

            </div>

          ) : (

            <div className="bug-list">

              {filteredBugs.map((bug) => (

                <div
                  key={bug.id}
                  className="bug-card"
                >

                  {/* CARD HEADER */}

                  <div className="bug-card-header">

                    <div>

                      <div className="bug-id">
                        {bug.bug_id}
                      </div>

                      <div className="bug-project">
                        📁{" "}
                        {bug.project_name ||
                          "Unknown Project"}
                      </div>

                      <div className="bug-tester">
                        👤 Assigned Tester:{" "}
                        <strong>
                          {bug.assigned_to
                            ? users.find(
                              (user) =>
                                String(
                                  user.user_id
                                ) ===
                                String(
                                  bug.assigned_to
                                )
                            )?.fullname ||
                            "Unknown User"
                            : "Unassigned"}
                        </strong>
                      </div>

                      <h2 className="bug-title">
                        {bug.title}
                      </h2>

                    </div>

                    <div className="bug-badges">

                      <span
                        style={{
                          ...styles.badge,
                          ...getSeverityStyle(
                            bug.severity
                          )
                        }}
                      >
                        {bug.severity}
                      </span>

                      <span
                        style={{
                          ...styles.badge,
                          ...getPriorityStyle(
                            bug.priority
                          )
                        }}
                      >
                        {bug.priority}
                      </span>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div style={styles.details}>

                    <div>
                      <b>Environment:</b>{" "}
                      {bug.environment || "N/A"}
                    </div>

                    <div>
                      <b>Pre-condition:</b>{" "}
                      {bug.pre_condition || "N/A"}
                    </div>

                    <div>
                      <b>Expected:</b>{" "}
                      {bug.expected_result || "N/A"}
                    </div>

                    <div>
                      <b>Actual:</b>{" "}
                      {bug.actual_result || "N/A"}
                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div style={styles.actions}>

                    <select
                      value={bug.status}
                      onChange={(e) =>
                        handleStatusChange(
                          bug.id,
                          e.target.value
                        )
                      }
                      style={{
                        ...styles.statusSelect,
                        ...getStatusStyle(
                          bug.status
                        )
                      }}
                    >
                      <option value="Open">
                        Open
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>

                      <option value="Clarified">
                        Clarified
                      </option>
                    </select>

                    <button
                      onClick={() =>
                        setEditBug({
                          ...bug
                        })
                      }
                      style={styles.editButton}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(bug.id)
                      }
                      style={styles.deleteButton}
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* ================================================= */}
          {/* EDIT MODAL */}
          {/* ================================================= */}

          {editBug && (

            <div style={styles.modalOverlay}>

              <div style={styles.modal}>

                <div style={styles.modalHeader}>

                  <h2>
                    ✏️ Edit Bug Report
                  </h2>

                  <button
                    onClick={() =>
                      setEditBug(null)
                    }
                    style={styles.closeButton}
                  >
                    ✕
                  </button>

                </div>

                <div style={styles.form}>

                  <label>
                    Bug Title
                  </label>

                  <input
                    value={editBug.title}
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        title: e.target.value
                      })
                    }
                    style={styles.input}
                  />

                  <label>
                    Severity
                  </label>

                  <select
                    value={editBug.severity}
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        severity: e.target.value
                      })
                    }
                    style={styles.input}
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Critical">
                      Critical
                    </option>
                  </select>

                  <label>
                    Priority
                  </label>

                  <select
                    value={editBug.priority}
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        priority: e.target.value
                      })
                    }
                    style={styles.input}
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>

                  <label>
                    Environment
                  </label>

                  <input
                    value={
                      editBug.environment || ""
                    }
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        environment:
                          e.target.value
                      })
                    }
                    style={styles.input}
                  />

                  <label>
                    Pre-condition
                  </label>

                  <textarea
                    value={
                      editBug.pre_condition || ""
                    }
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        pre_condition:
                          e.target.value
                      })
                    }
                    style={styles.textarea}
                  />

                  <label>
                    Steps to Reproduce
                  </label>

                  <textarea
                    value={
                      editBug.steps_to_reproduce ||
                      ""
                    }
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        steps_to_reproduce:
                          e.target.value
                      })
                    }
                    style={styles.textarea}
                  />

                  <label>
                    Expected Result
                  </label>

                  <textarea
                    value={
                      editBug.expected_result ||
                      ""
                    }
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        expected_result:
                          e.target.value
                      })
                    }
                    style={styles.textarea}
                  />

                  <label>
                    Actual Result
                  </label>

                  <textarea
                    value={
                      editBug.actual_result ||
                      ""
                    }
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        actual_result:
                          e.target.value
                      })
                    }
                    style={styles.textarea}
                  />

                  <label>
                    Status
                  </label>

                  <select
                    value={editBug.status}
                    onChange={(e) =>
                      setEditBug({
                        ...editBug,
                        status: e.target.value
                      })
                    }
                    style={styles.input}
                  >
                    <option value="Open">
                      Open
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                    <option value="Clarified">
                      Clarified
                    </option>
                  </select>

                </div>

                <div style={styles.modalFooter}>

                  <button
                    onClick={() =>
                      setEditBug(null)
                    }
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleEditSave}
                    style={styles.saveButton}
                  >
                    Save Changes
                  </button>

                </div>

              </div>

            </div>

          )}

        </>
      )}

    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {

  container: {
    padding: "30px",
    width: "100%",
    boxSizing: "border-box"
  },

  center: {
    padding: "60px",
    textAlign: "center",
    fontSize: "18px"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },

  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700"
  },

  subtitle: {
    color: "#64748b",
    marginTop: "8px"
  },

  filterBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  filterLabel: {
    fontWeight: "600"
  },

  select: {
    padding: "10px 15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "14px"
  },

  summary: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5, minmax(120px, 1fr))",
    gap: "15px",
    marginBottom: "25px"
  },

  summaryCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.05)"
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "22px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.05)"
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "18px"
  },

  bugId: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: "5px"
  },

  title: {
    margin: 0,
    fontSize: "20px"
  },

  badges: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start"
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700"
  },

  details: {
    display: "grid",
    gap: "10px",
    color: "#475569",
    fontSize: "14px",
    padding: "15px 0",
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb"
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    marginTop: "18px"
  },

  statusSelect: {
    padding: "8px 12px",
    borderRadius: "7px",
    fontWeight: "600",
    border: "1px solid #d1d5db"
  },

  editButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "7px",
    background: "#e2e8f0",
    cursor: "pointer",
    fontWeight: "600"
  },

  deleteButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "7px",
    background: "#fee2e2",
    color: "#dc2626",
    cursor: "pointer",
    fontWeight: "600"
  },

  empty: {
    background: "#fff",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    padding: "70px 20px",
    textAlign: "center",
    color: "#64748b"
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "10px"
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  },

  modal: {
    width: "700px",
    maxWidth: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: "14px",
    padding: "25px",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.25)"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  closeButton: {
    border: "none",
    background: "#f1f5f9",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  input: {
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    marginBottom: "10px",
    fontSize: "14px"
  },

  textarea: {
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    minHeight: "80px",
    resize: "vertical",
    marginBottom: "10px",
    fontSize: "14px"
  },

  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px"
  },

  cancelButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "7px",
    background: "#e2e8f0",
    cursor: "pointer"
  },

  saveButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600"
  }
};


// ============================================================
// HELPERS
// ============================================================

function getStatusStyle(status) {

  if (status === "Open") {
    return {
      background: "#dcfce7",
      color: "#15803d"
    };
  }

  if (status === "Resolved") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8"
    };
  }

  if (status === "Rejected") {
    return {
      background: "#fee2e2",
      color: "#dc2626"
    };
  }

  if (status === "Clarified") {
    return {
      background: "#fef3c7",
      color: "#b45309"
    };
  }

  return {};
}


function getSeverityStyle(severity) {

  if (severity === "Critical") {
    return {
      background: "#fee2e2",
      color: "#b91c1c"
    };
  }

  if (severity === "High") {
    return {
      background: "#ffedd5",
      color: "#c2410c"
    };
  }

  if (severity === "Medium") {
    return {
      background: "#fef3c7",
      color: "#a16207"
    };
  }

  return {
    background: "#dcfce7",
    color: "#15803d"
  };
}


function getPriorityStyle(priority) {

  if (priority === "High") {
    return {
      background: "#fee2e2",
      color: "#dc2626"
    };
  }

  if (priority === "Medium") {
    return {
      background: "#fef3c7",
      color: "#b45309"
    };
  }

  return {
    background: "#dcfce7",
    color: "#15803d"
  };
}