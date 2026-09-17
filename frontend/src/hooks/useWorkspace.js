import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as dashboardService from "../services/dashboardService";

export default function useWorkspace(projectId) {

    // =====================================================
    // Project
    // =====================================================

    const [project, setProject] = useState(null);

    // =====================================================
    // Summary
    // =====================================================

    const [summary, setSummary] = useState("");

    // =====================================================
    // Test Cases
    // =====================================================

    const [testCases, setTestCases] = useState([]);

    const [search, setSearch] = useState("");

    // =====================================================
    // Bug Report
    // =====================================================

    const [bugReport, setBugReport] = useState(null);
    const [showBugModal, setShowBugModal] = useState(false);
    const [loadingBug, setLoadingBug] = useState(false);

    // =====================================================
    // Automation Script
    // =====================================================

    const [automationScript, setAutomationScript] = useState(null);
    const [showScriptModal, setShowScriptModal] = useState(false);
    const [loadingScript, setLoadingScript] = useState(false);

    // =====================================================
    // Test Data
    // =====================================================

    const [testData, setTestData] = useState(null);
    const [showTestDataModal, setShowTestDataModal] = useState(false);
    const [loadingTestData, setLoadingTestData] = useState(false);

    // =====================================================
    // QA AI
    // =====================================================

    const [qaQuestion, setQaQuestion] = useState("");
    const [qaAnswer, setQaAnswer] = useState("");
    const [showQAModal, setShowQAModal] = useState(false);
    const [loadingQA, setLoadingQA] = useState(false);

    // =====================================================
    // Filters
    // =====================================================

    const [priorityFilter, setPriorityFilter] =
        useState("All");

    const [statusFilter, setStatusFilter] =
        useState("All");

    // =====================================================
    // Edit Test Case
    // =====================================================

    const [editingId, setEditingId] =
        useState(null);

    const [editData, setEditData] =
        useState({});

    // =====================================================
    // File
    // =====================================================

    const [file, setFile] = useState(null);

    // =====================================================
    // Loading
    // =====================================================

    const [uploading, setUploading] =
        useState(false);

    const [loadingAI, setLoadingAI] =
        useState(false);

    const [loadingSummary, setLoadingSummary] =
        useState(false);


    // =====================================================
    // Load Project
    // =====================================================

    const loadProject = async () => {

        if (!projectId) return;

        try {

            const response =
                await dashboardService.getProject(
                    projectId
                );

            setProject(response.data);

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Failed to load project"
            );

        }

    };


    // =====================================================
    // Load Test Cases
    // =====================================================

    const loadTestCases = async () => {

        if (!projectId) return;

        try {

            const response =
                await dashboardService.getTestCases(
                    projectId
                );

            setTestCases(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Unable to load test cases"
            );

        }

    };


    // =====================================================
    // Upload Requirement
    // =====================================================

    const uploadDocument = async () => {

        if (!projectId) {

            toast.warning(
                "Project not found"
            );

            return;

        }

        if (!file) {

            toast.warning(
                "Please select a document"
            );

            return;

        }

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        try {

            setUploading(true);

            const response =
                await dashboardService.uploadDocument(
                    projectId,
                    formData
                );

            toast.success(
                response.data.message ||
                "Document uploaded successfully"
            );

            setFile(null);

            await loadProject();

            return true;

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Upload Failed"
            );
            return false;

        }
        finally {

            setUploading(false);

        }

    };


    // =====================================================
    // Generate Summary
    // =====================================================

    const generateSummary = async () => {

        if (!projectId) {

            toast.warning(
                "Project not found"
            );

            return;

        }

        try {

            setLoadingSummary(true);

            const response =
                await dashboardService.getSummary(
                    projectId
                );

            const summaryData =
                response.data?.data;

            if (
                typeof summaryData === "object" &&
                summaryData !== null
            ) {

                setSummary(
                    summaryData.summary ||
                    JSON.stringify(
                        summaryData,
                        null,
                        2
                    )
                );

            }
            else {

                setSummary(
                    summaryData || ""
                );

            }

            toast.success(
                response.data?.message ||
                "Summary Generated Successfully"
            );

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Summary Failed"
            );

        }
        finally {

            setLoadingSummary(false);

        }

    };


    // =====================================================
    // Generate AI Test Cases
    // =====================================================

    const generateAI = async () => {

        if (!projectId) {

            toast.warning("Project not found");

            return false;

        }

        try {

            setLoadingAI(true);

            const response =
                await dashboardService.generateAI(projectId);

            const beforeCount = testCases.length;

            await loadTestCases();

            const afterResponse =
                await dashboardService.getTestCases(projectId);

            const updatedTestCases =
                Array.isArray(afterResponse.data)
                    ? afterResponse.data
                    : [];

            const newTestCases =
                Math.max(
                    0,
                    updatedTestCases.length - beforeCount
                );

            setTestCases(updatedTestCases);

            if (newTestCases > 0) {

                toast.success(
                    `${newTestCases} new test case(s) generated successfully`
                );

            } else {

                toast.info(
                    "No new test cases generated. Existing test cases already cover this requirement."
                );

            }

            return {
                success: true,
                newTestCases
            };

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Generation Failed"
            );

            return {
                success: false,
                newTestCases: 0
            };

        }
        finally {

            setLoadingAI(false);

        }

    };


    // =====================================================
    // Start Edit
    // =====================================================

    const startEdit = (testCase) => {

        setEditingId(
            testCase.id
        );

        setEditData({

            title:
                testCase.title || "",

            pre_condition:
                testCase.pre_condition || "",

            steps:
                testCase.steps || "",

            expected_result:
                testCase.expected_result || "",

            priority:
                testCase.priority || "Medium",

            status:
                testCase.status || "Pending"

        });

    };


    // =====================================================
    // Save Edit
    // =====================================================

    const saveEdit = async () => {

        if (!editingId) {

            toast.warning(
                "No test case selected"
            );

            return;

        }

        try {

            await dashboardService.updateTestCase(
                editingId,
                editData
            );

            toast.success(
                "Test Case Updated Successfully"
            );

            setEditingId(null);

            setEditData({});

            await loadTestCases();

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Update Failed"
            );

        }

    };


    // =====================================================
    // Delete Test Case
    // =====================================================

    const deleteTestCase = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this test case?"
            );

        if (!confirmed) return;

        try {

            await dashboardService.deleteTestCase(
                id
            );

            toast.success(
                "Test Case Deleted Successfully"
            );

            await loadTestCases();

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Delete Failed"
            );

        }

    };


    // =====================================================
    // Generate Bug Report
    // =====================================================

    const generateBugReport = async (id) => {

        try {

            setLoadingBug(true);

            const response =
                await dashboardService.getBugReport(
                    id
                );

            const bug =
                response.data?.data;

            setBugReport({

                ...(bug || {}),

                testcase_id:
                    response.data?.testcase_id

            });

            setShowBugModal(true);

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Bug Report Generation Failed"
            );

        }
        finally {

            setLoadingBug(false);

        }

    };

    // =====================================================
    // Add Bug Report to Database
    // =====================================================

    // =====================================================
    // Add Bug Report to Database
    // =====================================================

    const addBugReport = async () => {

        if (!bugReport) {
            toast.error("No bug report available");
            return;
        }

        if (!projectId) {
            toast.error("Project ID not found");
            return;
        }

        try {

            const payload = {
                testcase_id: bugReport.testcase_id,
                project_id: Number(projectId),

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

            console.log("Adding Bug Report:", payload);

            const response =
                await dashboardService.createBugReport(payload);

            console.log("Bug Report Saved:", response.data);

            toast.success("Bug Report Added Successfully");

            setShowBugModal(false);

        } catch (err) {

            console.error(
                "ADD BUG REPORT ERROR:",
                err.response?.data || err
            );

            toast.error(
                err.response?.data?.detail ||
                "Failed to add bug report"
            );
        }
    };    // =====================================================
    // Generate Automation Script
    // =====================================================

    const generateScript = async (id) => {
        try {
            setLoadingScript(true);

            // Close other artifact first
            setShowBugModal(false);
            setShowTestDataModal(false);

            const response =
                await dashboardService.getAutomationScript(id);

            let result = response.data?.data;

            /*
             * Backend kabhi object deta hai:
             * { script: "..." }
             *
             * aur kabhi stringified JSON:
             * "{\"script\":\"...\"}"
             */

            if (typeof result === "string") {
                try {
                    result = JSON.parse(result);
                } catch {
                    // Plain script string
                    result = {
                        script: result
                    };
                }
            }

            let script = result?.script;

            /*
             * Agar script khud JSON string ke andar aa gaya ho
             */
            if (typeof script === "string") {
                try {
                    const parsedScript = JSON.parse(script);

                    if (parsedScript?.script) {
                        script = parsedScript.script;
                    }
                } catch {
                    // Already normal Python script
                }
            }

            setAutomationScript({
                script: script || "No script generated.",
                testcase_id:
                    response.data?.testcase_id || id
            });

            setShowScriptModal(true);

        } catch (err) {

            console.error("SCRIPT GENERATION ERROR:", err);

            toast.error(
                err.response?.data?.detail ||
                "Automation Script Generation Failed"
            );

        } finally {
            setLoadingScript(false);
        }
    };


    const generateTestData = async (id) => {
        try {
            setLoadingTestData(true);

            // Close other artifact first
            setShowBugModal(false);
            setShowScriptModal(false);

            const response =
                await dashboardService.getTestData(id);

            let result = response.data?.data;

            if (typeof result === "string") {
                try {
                    result = JSON.parse(result);
                } catch {
                    result = {
                        test_data: result
                    };
                }
            }

            let generatedData = result?.test_data;

            /*
             * Agar test_data bhi JSON string hai
             */
            if (typeof generatedData === "string") {
                try {
                    const parsedData =
                        JSON.parse(generatedData);

                    generatedData = parsedData;

                } catch {
                    // Normal text
                }
            }

            setTestData({
                test_data:
                    generatedData || "No test data generated.",

                testcase_id:
                    response.data?.testcase_id || id
            });

            setShowTestDataModal(true);

        } catch (err) {

            console.error(
                "TEST DATA GENERATION ERROR:",
                err
            );

            toast.error(
                err.response?.data?.detail ||
                "Failed to Generate Test Data"
            );

        } finally {
            setLoadingTestData(false);
        }
    };




    // =====================================================
    // Export Excel
    // =====================================================

    const exportExcel = async () => {

        if (!projectId) {

            toast.warning(
                "Project not found"
            );

            return;

        }

        try {

            const response =
                await dashboardService.exportTestCases(
                    projectId
                );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `TestCases_Project_${projectId}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success(
                "Excel exported successfully"
            );

        }
        catch (err) {

            toast.error(
                "Excel Export Failed"
            );

        }

    };


    // =====================================================
    // Export PDF
    // =====================================================

    const exportPDF = async () => {

        if (!projectId) {

            toast.warning(
                "Project not found"
            );

            return;

        }

        try {

            const response =
                await dashboardService.exportTestCasesPDF(
                    projectId
                );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `TestCases_Project_${projectId}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success(
                "PDF exported successfully"
            );

        }
        catch (err) {

            toast.error(
                "PDF Export Failed"
            );

        }

    };


    // =====================================================
    // Ask QA AI
    // =====================================================

    const askQAAI = async () => {

        if (!qaQuestion.trim()) {

            toast.warning(
                "Please enter a question"
            );

            return;

        }

        try {

            setLoadingQA(true);

            const response =
                await dashboardService.askQAAI(
                    qaQuestion
                );

            setQaAnswer(
                response.data?.data?.answer ||
                ""
            );

            setShowQAModal(true);

        }
        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "QA AI Failed"
            );

        }
        finally {

            setLoadingQA(false);

        }

    };


    // =====================================================
    // Filter Test Cases
    // =====================================================

    const filteredTestCases =
        testCases.filter((testCase) => {

            const title =
                testCase.title || "";

            const matchesSearch =
                title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesPriority =
                priorityFilter === "All" ||
                testCase.priority === priorityFilter;

            const matchesStatus =
                statusFilter === "All" ||
                testCase.status === statusFilter;

            return (
                matchesSearch &&
                matchesPriority &&
                matchesStatus
            );

        });


    // =====================================================
    // Initial Load
    // =====================================================

    useEffect(() => {

        if (!projectId) return;

        loadProject();

        loadTestCases();

    }, [projectId]);


    // =====================================================
    // Return
    // =====================================================

    return {

        // Project
        project,

        // Summary
        summary,

        // Test Cases
        testCases,
        filteredTestCases,

        // Search
        search,
        setSearch,

        // Filters
        priorityFilter,
        setPriorityFilter,

        statusFilter,
        setStatusFilter,

        // Edit
        editingId,
        setEditingId,

        editData,
        setEditData,

        // File
        file,
        setFile,

        // Loading
        uploading,
        loadingAI,
        loadingSummary,

        // Load
        loadProject,
        loadTestCases,

        // Actions
        uploadDocument,
        generateSummary,
        generateAI,

        // CRUD
        startEdit,
        saveEdit,
        deleteTestCase,

        // Bug Report
        bugReport,
        showBugModal,
        setShowBugModal,
        loadingBug,
        generateBugReport,
        addBugReport,

        // Automation Script
        automationScript,
        showScriptModal,
        setShowScriptModal,
        loadingScript,
        generateScript,

        // Test Data
        testData,
        showTestDataModal,
        setShowTestDataModal,
        loadingTestData,
        generateTestData,

        // QA AI
        qaQuestion,
        setQaQuestion,
        qaAnswer,
        showQAModal,
        setShowQAModal,
        loadingQA,
        askQAAI,

        // Export
        exportExcel,
        exportPDF,


    };

}