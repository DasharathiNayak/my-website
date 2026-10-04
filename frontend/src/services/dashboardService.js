import api from "./api";

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

export const getProject = (id) =>
    api.get(`/projects/${id}`);

export const updateProject = (id, data) =>
    api.put(`/projects/${id}`, data);

export const deleteProject = (id) =>
    api.delete(`/projects/${id}`);

export const generateAI = (projectId) =>
    api.post(`/testcases/generate-ai/${projectId}`);

export const getTestCases = (projectId) =>
    api.get(`/testcases/${projectId}`);

export const updateTestCase = (id, data) =>
    api.put(`/testcases/${id}`, data);

export const deleteTestCase = (id) =>
    api.delete(`/testcases/${id}`);

export const getSummary = (projectId) =>
    api.get(`/projects/${projectId}/summary`);

export const getBugReport = (id) =>
    api.get(`/testcases/bug-report/${id}`);

export const getProjectBugReports = (projectId) =>
    api.get(`/testcases/bug-reports/project/${projectId}`);

export const createBugReport = (data) =>
    api.post("/testcases/bug-reports", data);

export const updateBugReport = (bugId, data) =>
    api.put(`/testcases/bug-reports/${bugId}`, data);

export const deleteBugReport = (bugId) =>
    api.delete(`/testcases/bug-reports/${bugId}`);

export const getAutomationScript = (id) =>
    api.get(`/testcases/script/${id}`);

export const getTestData = (id) =>
    api.get(`/testcases/test-data/${id}`);

export const getStats = (userId) =>
    api.get(`/projects/stats/${userId}`);


// ============================================================
// QA CHAT
// ============================================================

export const askQAAI = (question) => {

    const responseStyle =
        localStorage.getItem(
            "testcraftai_response_style"
        ) || "balanced";

    let styleInstruction = "";

    if (responseStyle === "concise") {

        styleInstruction =
            "Answer concisely and directly. Keep the response short and focus only on the most important information.";

    } else if (responseStyle === "detailed") {

        styleInstruction =
            "Provide a detailed and well-explained answer. Include relevant explanations, examples, and important details.";

    } else {

        styleInstruction =
            "Provide a balanced answer with enough explanation to be useful, but avoid unnecessary length.";

    }

    const finalQuestion = `
${styleInstruction}

User Question:
${question}
`;

    return api.post("/testcases/qa-chat", {
        question: finalQuestion
    });
};


export const exportTestCases = (projectId) =>
    api.get(`/testcases/export/${projectId}`, {
        responseType: "blob"
    });

export const exportTestCasesPDF = (projectId) =>
    api.get(`/testcases/export-pdf/${projectId}`, {
        responseType: "blob"
    });