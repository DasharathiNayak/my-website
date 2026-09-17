import api from "./api";

// ============================================================
// PROJECT
// ============================================================

export const createProject = (data) =>
    api.post("/projects/", data);

export const uploadDocument = (projectId, formData) =>
    api.post(`/projects/${projectId}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

export const getProjects = (userId) =>
    api.get(`/projects/user/${userId}`);

export const getAllUsers = () =>
    api.get("/users");

export const getProject = (id) =>
    api.get(`/projects/${id}`);

export const updateProject = (id, data) =>
    api.put(`/projects/${id}`, data);

export const deleteProject = (id) =>
    api.delete(`/projects/${id}`);


// ============================================================
// TEST CASE
// ============================================================

export const generateAI = (projectId) =>
    api.post(`/testcases/generate-ai/${projectId}`);

export const getTestCases = (projectId) =>
    api.get(`/testcases/${projectId}`);

export const updateTestCase = (id, data) =>
    api.put(`/testcases/${id}`, data);

export const deleteTestCase = (id) =>
    api.delete(`/testcases/${id}`);


// ============================================================
// SUMMARY
// ============================================================

export const getSummary = (projectId) =>
    api.get(`/projects/${projectId}/summary`);


// ============================================================
// BUG REPORT
// ============================================================

export const getBugReport = (id) =>
    api.get(`/testcases/bug-report/${id}`);

export const getProjectBugReports = (projectId) =>
    api.get(`/bug-reports/project/${projectId}`);

export const getAllBugReports = () =>
    api.get("/bug-reports/all");

export const createBugReport = (data) =>
    api.post("/bug-reports/", data);

export const updateBugReport = (bugId, data) =>
    api.put(`/bug-reports/${bugId}`, data);

export const deleteBugReport = (bugId) =>
    api.delete(`/bug-reports/${bugId}`);


// ============================================================
// AUTOMATION SCRIPT
// ============================================================

export const getAutomationScript = (id) =>
    api.get(`/testcases/script/${id}`);


// ============================================================
// TEST DATA
// ============================================================

export const getTestData = (id) =>
    api.get(`/testcases/test-data/${id}`);


// ============================================================
// DASHBOARD
// ============================================================

export const getStats = (userId) =>
    api.get(`/projects/stats/${userId}`);


// ============================================================
// QA AI
// ============================================================

export const askQAAI = (question) =>
    api.post("/testcases/qa-chat", {
        question
    });


// ============================================================
// EXPORT
// ============================================================

export const exportTestCases = (projectId) =>
    api.get(`/testcases/export/${projectId}`, {
        responseType: "blob"
    });

export const exportTestCasesPDF = (projectId) =>
    api.get(`/testcases/export-pdf/${projectId}`, {
        responseType: "blob"
    });

export const getTestCasesByAssignedUser = (userId) =>
    api.get(`/testcases/assigned-user/${userId}`);
