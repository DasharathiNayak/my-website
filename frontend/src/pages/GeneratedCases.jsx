import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/generatedCases.css";
import * as dashboardService from "../services/dashboardService";
import BugReportModal from "../components/modals/BugReportModal";

export default function GeneratedCases() {
    const { id } = useParams();

    const addBugReport = async () => {

        if (!bugReport) {
            alert("No bug report available");
            return false;
        }

        if (!id) {
            alert("Project ID not found");
            return false;
        }

        try {

            const payload = {

                testcase_id: bugReport.testcase_id,

                project_id: Number(id),

                title: bugReport.title || "Untitled Bug",

                severity: bugReport.severity || "Medium",

                priority: bugReport.priority || "Medium",

                environment: bugReport.environment || null,

                pre_condition: bugReport.pre_condition || null,

                steps_to_reproduce:
                    bugReport.steps_to_reproduce || null,

                expected_result:
                    bugReport.expected_result || null,

                actual_result:
                    bugReport.actual_result || null,

                status: "Open"
            };

            console.log(
                "ADDING BUG REPORT:",
                payload
            );

            const response =
                await dashboardService.createBugReport(
                    payload
                );

            console.log(
                "BUG SAVED:",
                response.data
            );

            alert("Bug Report Added Successfully");

            setShowBugModal(false);

            return true;

        } catch (err) {

            console.error(
                "ADD BUG ERROR:",
                err.response?.data || err
            );

            alert(
                err.response?.data?.detail ||
                "Failed to add bug report"
            );

            return false;
        }
    };
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [testCases, setTestCases] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [userFilter, setUserFilter] = useState("All");

    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [bugReport, setBugReport] = useState(null);
    const [showBugModal, setShowBugModal] = useState(false);


    const loadProjects = async () => {
        try {
            const userId = localStorage.getItem("user_id");

            if (!userId) {
                setProjects([]);
                return;
            }

            const response = await dashboardService.getProjects(userId);

            setProjects(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (err) {
            console.error("Projects loading error:", err);
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

    const loadTestCases = async (projectId) => {
        if (!projectId) return;

        try {
            setLoading(true);

            const response =
                await dashboardService.getTestCases(projectId);

            setTestCases(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (err) {
            console.error("Test cases loading error:", err);
            setTestCases([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
        loadUsers();
    }, []);

    useEffect(() => {
        if (!id || projects.length === 0) return;

        const project = projects.find(
            (item) => String(item.id) === String(id)
        );

        if (project) {
            setSelectedProject(project);
            loadTestCases(project.id);
        }
    }, [id, projects]);

    const openProject = (project) => {
        setSelectedProject(project);
        navigate(`/generated-cases/${project.id}`);
    };

    const backToProjects = () => {
        setSelectedProject(null);
        setTestCases([]);
        navigate("/generated-cases");
    };

    const startEdit = (testCase) => {
        setEditingId(testCase.id);

        setEditData({
            title: testCase.title || "",
            pre_condition: testCase.pre_condition || "",
            steps: testCase.steps || "",
            expected_result: testCase.expected_result || "",
            priority: testCase.priority || "Medium",
            status: testCase.status || "Pending",
            test_data: testCase.test_data || ""
        });
    };

    const saveEdit = async () => {
        if (!editingId) return;

        try {
            await dashboardService.updateTestCase(
                editingId,
                editData
            );

            setEditingId(null);
            setEditData({});

            await loadTestCases(selectedProject.id);
        } catch (err) {
            console.error("Update test case error:", err);

            alert(
                err.response?.data?.detail ||
                "Unable to update test case"
            );
        }
    };

    const deleteTestCase = async (testCaseId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this test case?"
        );

        if (!confirmed) return;

        try {
            await dashboardService.deleteTestCase(testCaseId);
            await loadTestCases(selectedProject.id);
        } catch (err) {
            console.error("Delete test case error:", err);

            alert(
                err.response?.data?.detail ||
                "Unable to delete test case"
            );
        }
    };

    const cycleTestCaseStatus = async (testCase) => {
        const currentStatus = testCase.status || "Pending";

        let nextStatus;

        if (currentStatus === "Pending") {
            nextStatus = "Passed";
        } else if (currentStatus === "Passed") {
            nextStatus = "Failed";
        } else {
            nextStatus = "Pending";
        }

        try {
            // Save status in database
            await dashboardService.updateTestCase(
                testCase.id,
                {
                    status: nextStatus
                }
            );

            // Update only this testcase locally
            // Position/order will remain exactly the same
            setTestCases((prevCases) =>
                prevCases.map((item) =>
                    item.id === testCase.id
                        ? {
                            ...item,
                            status: nextStatus
                        }
                        : item
                )
            );

        } catch (err) {
            console.error(
                "Status update error:",
                err
            );

            alert(
                err.response?.data?.detail ||
                "Unable to update test case status"
            );
        }
    };
    const generateBugReport = async (testCaseId) => {

        try {

            console.log(
                "Generating Bug Report for Test Case:",
                testCaseId
            );

            const response =
                await dashboardService.getBugReport(
                    testCaseId
                );

            console.log(
                "AI Bug Report:",
                response.data
            );

            setBugReport({
                ...response.data.data,
                testcase_id: testCaseId
            });

            setShowBugModal(true);

        }
        catch (err) {

            console.error(
                "Bug Report Generation Error:",
                err.response?.data || err
            );

            alert(
                err.response?.data?.detail ||
                "Failed to generate bug report"
            );

        }

    };

    const loadTestCasesByUser = async (userId) => {
        if (!userId || userId === "All") return;

        try {
            setLoading(true);

            const response =
                await dashboardService.getTestCasesByAssignedUser(userId);

            setTestCases(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (err) {
            console.error("User test cases loading error:", err);
            setTestCases([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter((project) => {
        if (userFilter === "All") {
            return true;
        }

        return (
            String(project.assigned_to) ===
            String(userFilter)
        );
    });

    const filteredTestCases = testCases.filter((testCase) => {
        const keyword = search.toLowerCase().trim();
        const title = (testCase.title || "").toLowerCase();
        const priority = testCase.priority || "";
        const status = testCase.status || "";

        return (
            title.includes(keyword) &&
            (priorityFilter === "All" || priority === priorityFilter) &&
            (statusFilter === "All" || status === statusFilter)
        );
    });

    // =====================================================
    // PROJECT SELECTION
    // =====================================================

    if (!selectedProject) {
        return (
            <div className="generated-page">
                <div className="generated-header">
                    <div>
                        <span className="section-label">TESTING</span>

                        <h1>🧪 Generated Test Cases</h1>

                        <p>
                            Select a project to view and manage its generated
                            test cases.
                        </p>
                    </div>

                    <select
                        className="generated-user-filter"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                    >
                        <option value="All">👤 All Testers</option>

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

                {projects.length === 0 ? (
                    <div className="generated-empty">
                        <div className="empty-icon">📋</div>
                        <h2>No Projects Found</h2>
                        <p>
                            Create a project and generate AI test cases first.
                        </p>

                        <button
                            className="primary-action"
                            onClick={() => navigate("/projects")}
                        >
                            Go To Projects
                        </button>
                    </div>
                ) : (
                    <div className="generated-project-grid">
                        {filteredProjects.map((project) => (
                            <div
                                className="generated-project-card"
                                key={project.id}
                            >
                                <div className="generated-project-icon">
                                    📁
                                </div>

                                <div className="generated-project-info">
                                    <h2>{project.project_name}</h2>

                                    <p>
                                        {project.description ||
                                            "AI Testing Project"}
                                    </p>

                                    <span>
                                        💻 {project.application_type || "Web"}
                                    </span>
                                </div>

                                <button
                                    className="generated-open-btn"
                                    onClick={() => openProject(project)}
                                >
                                    Open →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // =====================================================
    // SPECIFIC PROJECT TEST CASES
    // =====================================================

    return (
        <div className="generated-page">
            <div className="generated-header project-generated-header">
                <div>
                    <button
                        className="back-btn"
                        onClick={backToProjects}
                    >
                        ← All Projects
                    </button>

                    <span className="section-label">
                        GENERATED CASES
                    </span>

                    <h1>🧪 {selectedProject.project_name}</h1>

                    <p>
                        Generated test cases for this project.
                    </p>

                    <div className="assigned-tester-info">
                        👤 Assigned Tester:{" "}
                        <strong>
                            {selectedProject.assigned_to
                                ? users.find(
                                    (user) =>
                                        String(user.user_id) ===
                                        String(selectedProject.assigned_to)
                                )?.fullname || "Unknown User"
                                : "Unassigned"}
                        </strong>
                    </div>
                </div>

                <button
                    className="requirements-btn"
                    onClick={() =>
                        navigate(`/project/${selectedProject.id}`)
                    }
                >
                    📄 Open Project
                </button>
            </div>

            <div className="cases-toolbar">
                <div className="cases-search">
                    🔍
                    <input
                        type="text"
                        placeholder="Search test cases..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    value={priorityFilter}
                    onChange={(e) =>
                        setPriorityFilter(e.target.value)
                    }
                >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                </select>
            </div>

            <div className="cases-count">
                <strong>{filteredTestCases.length}</strong>
                <span>Test Cases</span>
            </div>

            {loading ? (
                <div className="generated-empty">
                    <div className="loading-spinner">⟳</div>
                    <h2>Loading Test Cases...</h2>
                </div>
            ) : filteredTestCases.length === 0 ? (
                <div className="generated-empty">
                    <div className="empty-icon">🧪</div>
                    <h2>No Test Cases Found</h2>
                    <p>
                        Generate AI test cases from the Upload Requirement
                        section of this project.
                    </p>

                    <button
                        className="primary-action"
                        onClick={() =>
                            navigate(`/project/${selectedProject.id}`)
                        }
                    >
                        Open Project
                    </button>
                </div>
            ) : (
                <div className="testcase-list">
                    {filteredTestCases.map((testCase, index) => {
                        const priority =
                            testCase.priority || "Medium";
                        const status =
                            testCase.status || "Pending";

                        return (
                            <div
                                className="testcase-card"
                                key={testCase.id}
                            >
                                <div className="testcase-header">
                                    <div className="tc-title-area">
                                        <span className="tc-number">
                                            TC-{String(index + 1).padStart(3, "0")}
                                        </span>

                                        <h2>
                                            {testCase.title ||
                                                "Untitled Test Case"}
                                        </h2>
                                    </div>

                                    <div className="tc-badges">
                                        <span
                                            className={`priority-badge ${priority.toLowerCase()}`}
                                        >
                                            {priority}
                                        </span>

                                        <button
                                            type="button"
                                            className={`status-badge clickable-status ${status.toLowerCase()}`}
                                            onClick={() => cycleTestCaseStatus(testCase)}
                                            title="Click to change status"
                                        >
                                            {status}
                                        </button>
                                    </div>
                                </div>

                                {editingId !== testCase.id ? (
                                    <>
                                        <div className="testcase-content">
                                            <div className="tc-section">
                                                <h4>Pre-condition</h4>
                                                <p>
                                                    {testCase.pre_condition ||
                                                        "No pre-condition specified."}
                                                </p>
                                            </div>

                                            <div className="tc-section">
                                                <h4>Test Steps</h4>
                                                <p>
                                                    {testCase.steps ||
                                                        "No test steps specified."}
                                                </p>
                                            </div>

                                            <div className="tc-section">
                                                <h4>Expected Result</h4>
                                                <p>
                                                    {testCase.expected_result ||
                                                        "No expected result specified."}
                                                </p>
                                            </div>

                                            {testCase.test_data && (
                                                <div className="tc-section">
                                                    <h4>Test Data</h4>
                                                    <p>
                                                        {testCase.test_data}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="testcase-actions">

                                            <button
                                                className="edit-case-btn"
                                                onClick={() =>
                                                    startEdit(testCase)
                                                }
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                className="bug-case-btn"
                                                onClick={() =>
                                                    generateBugReport(testCase.id)
                                                }
                                            >
                                                🪲 Generate Bug Report
                                            </button>

                                            <button
                                                className="delete-case-btn"
                                                onClick={() =>
                                                    deleteTestCase(testCase.id)
                                                }
                                            >
                                                🗑 Delete
                                            </button>

                                        </div>
                                    </>
                                ) : (
                                    <div className="testcase-edit">
                                        <input
                                            value={editData.title}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    title: e.target.value
                                                })
                                            }
                                            placeholder="Test case title"
                                        />

                                        <textarea
                                            value={editData.pre_condition}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    pre_condition:
                                                        e.target.value
                                                })
                                            }
                                            placeholder="Pre-condition"
                                        />

                                        <textarea
                                            value={editData.steps}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    steps: e.target.value
                                                })
                                            }
                                            placeholder="Test steps"
                                        />

                                        <textarea
                                            value={editData.expected_result}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    expected_result:
                                                        e.target.value
                                                })
                                            }
                                            placeholder="Expected result"
                                        />

                                        <textarea
                                            value={editData.test_data}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    test_data:
                                                        e.target.value
                                                })
                                            }
                                            placeholder="Test data"
                                        />

                                        <div className="edit-select-row">
                                            <select
                                                value={editData.priority}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        priority:
                                                            e.target.value
                                                    })
                                                }
                                            >
                                                <option value="High">
                                                    High
                                                </option>
                                                <option value="Medium">
                                                    Medium
                                                </option>
                                                <option value="Low">
                                                    Low
                                                </option>
                                            </select>

                                            <select
                                                value={editData.status}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        status:
                                                            e.target.value
                                                    })
                                                }
                                            >
                                                <option value="Pending">
                                                    Pending
                                                </option>
                                                <option value="Passed">
                                                    Passed
                                                </option>
                                                <option value="Failed">
                                                    Failed
                                                </option>
                                            </select>
                                        </div>

                                        <div className="testcase-actions">
                                            <button
                                                className="save-case-btn"
                                                onClick={saveEdit}
                                            >
                                                💾 Save Changes
                                            </button>

                                            <button
                                                className="cancel-case-btn"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditData({});
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <BugReportModal
                showBugModal={showBugModal}
                bugReport={bugReport}
                setShowBugModal={setShowBugModal}
                addBugReport={addBugReport}
            />
        </div>

    );
}
