import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as dashboardService from "../services/dashboardService";

export default function useDashboard() {

    // =====================================================
    // Dashboard Stats
    // =====================================================

    const [stats, setStats] = useState({
        projects: 0,
        requirements: 0,
        testcases: 0,
        high: 0,
        medium: 0,
        low: 0
    });

    // =====================================================
    // AI / Dashboard Data
    // =====================================================

    const [bugReport, setBugReport] = useState("");
    const [summary, setSummary] = useState("");
    const [automationScript, setAutomationScript] = useState("");
    const [testData, setTestData] = useState("");

    // =====================================================
    // QA Chat
    // =====================================================

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [loadingChat, setLoadingChat] = useState(false);

    // =====================================================
    // Dark Mode
    // =====================================================

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // =====================================================
    // Modals
    // =====================================================

    const [showBugModal, setShowBugModal] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [showScriptModal, setShowScriptModal] = useState(false);
    const [showTestDataModal, setShowTestDataModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);

    // =====================================================
    // Load Dashboard Stats
    // =====================================================

    const loadStats = async () => {

        console.log("🔥 loadStats called");

        try {

            const userId =
                localStorage.getItem("user_id");

            console.log("👤 user_id:", userId);

            if (!userId) {

                console.log(
                    "❌ user_id not found in localStorage"
                );

                return;
            }

            const response =
                await dashboardService.getStats(userId);

            console.log(
                "📊 Stats API Response:",
                response.data
            );

            setStats({
                projects:
                    response.data.projects || 0,

                requirements:
                    response.data.requirements || 0,

                testcases:
                    response.data.testcases || 0,

                high:
                    response.data.high || 0,

                medium:
                    response.data.medium || 0,

                low:
                    response.data.low || 0
            });

        }
        catch (err) {

            console.error(
                "❌ Stats API Error:",
                err
            );

            toast.error(
                err.response?.data?.detail ||
                "Unable to load dashboard statistics"
            );

        }

    };

    // =====================================================
    // Pie Chart Data
    // =====================================================

    const pieData = {
        labels: [
            "High",
            "Medium",
            "Low"
        ],

        datasets: [
            {
                label: "Test Case Priority",

                data: [
                    stats.high,
                    stats.medium,
                    stats.low
                ],

                backgroundColor: [
                    "#ef4444",
                    "#f59e0b",
                    "#22c55e"
                ],

                borderColor: [
                    "#ffffff",
                    "#ffffff",
                    "#ffffff"
                ],

                borderWidth: 2
            }
        ]
    };

    // =====================================================
    // Bar Chart Data
    // =====================================================

    const barData = {
        labels: [
            "Projects",
            "Test Cases"
        ],

        datasets: [
            {
                label: "Count",

                data: [
                    stats.projects,
                    stats.testcases
                ],

                backgroundColor: [
                    "#2563eb",
                    "#7c3aed"
                ],

                borderRadius: 8
            }
        ]
    };

    // =====================================================
    // Ask QA AI
    // =====================================================

    const askQAAI = async () => {

        if (!question.trim()) {

            toast.warning(
                "Please enter a question"
            );

            return;
        }

        try {

            setLoadingChat(true);

            const response =
                await dashboardService.askQAAI(
                    question
                );

            const data = response.data;

            setAnswer(
                data.answer ||
                data.response ||
                data.message ||
                "No answer received."
            );

        }
        catch (err) {

            console.error(
                "QA AI Error:",
                err
            );

            toast.error(
                err.response?.data?.detail ||
                "Unable to get QA AI response"
            );

        }
        finally {

            setLoadingChat(false);

        }

    };

    // =====================================================
    // Copy Bug Report
    // =====================================================

    const copyBugReport = async () => {

        if (!bugReport) return;

        try {

            await navigator.clipboard.writeText(
                bugReport
            );

            toast.success(
                "Bug Report copied"
            );

        }
        catch (err) {

            console.error(
                "Copy Bug Report Error:",
                err
            );

            toast.error(
                "Unable to copy Bug Report"
            );

        }

    };

    // =====================================================
    // Copy Test Data
    // =====================================================

    const copyTestData = async () => {

        if (!testData) return;

        try {

            await navigator.clipboard.writeText(
                testData
            );

            toast.success(
                "Test Data copied"
            );

        }
        catch (err) {

            console.error(
                "Copy Test Data Error:",
                err
            );

            toast.error(
                "Unable to copy Test Data"
            );

        }

    };

    // =====================================================
    // Download Automation Script
    // =====================================================

    const downloadScript = () => {

        if (!automationScript) {

            toast.warning(
                "No automation script available"
            );

            return;
        }

        const blob = new Blob(
            [automationScript],
            {
                type: "text/plain"
            }
        );

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "automation-script.txt";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

    };

    // =====================================================
    // Initial Dashboard Load
    // =====================================================

    useEffect(() => {

        loadStats();

    }, []);

    // =====================================================
    // Return
    // =====================================================

    return {

        // Dashboard Stats
        stats,

        // Charts
        pieData,
        barData,

        // AI Data
        bugReport,
        summary,
        automationScript,
        testData,

        // QA Chat
        question,
        setQuestion,

        answer,

        askQAAI,

        loadingChat,

        // Dark Mode
        darkMode,
        setDarkMode,

        // Modals
        showBugModal,
        showSummary,
        showScriptModal,
        showTestDataModal,
        showChatModal,

        setShowBugModal,
        setShowSummary,
        setShowScriptModal,
        setShowTestDataModal,
        setShowChatModal,

        // Actions
        downloadScript,
        copyBugReport,
        copyTestData,

        // Reload stats
        loadStats
    };
}