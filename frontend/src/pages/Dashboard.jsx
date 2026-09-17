import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";

import HeroBanner from "../components/dashboard/HeroBanner";
import StatsCards from "../components/dashboard/StatsCards";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";

import BugReportModal from "../components/modals/BugReportModal";
import SummaryModal from "../components/modals/SummaryModal";
import ScriptModal from "../components/modals/ScriptModal";
import TestDataModal from "../components/modals/TestDataModal";
import QAChatModal from "../components/modals/QAChatModal";

import useDashboard from "../hooks/useDashboard";

import "../styles/dashboard.css";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

function Dashboard() {

    const {
        bugReport,
        summary,
        automationScript,
        testData,

        question,
        answer,

        stats,

        darkMode,

        showBugModal,
        showSummary,
        showScriptModal,
        showTestDataModal,
        showChatModal,

        loadingChat,

        pieData,
        barData,

        setQuestion,

        setShowBugModal,
        setShowSummary,
        setShowScriptModal,
        setShowTestDataModal,
        setShowChatModal,

        askQAAI,

        downloadScript,

        copyBugReport,

        copyTestData,

    } = useDashboard();

    return (

        <div className={darkMode ? "dashboard dark" : "dashboard"}>

            <div className="dashboard-card">

                <HeroBanner />

                <StatsCards
                    stats={stats}
                />

                <AnalyticsCharts
                    pieData={pieData}
                    barData={barData}
                />

            </div>


            <BugReportModal
                showBugModal={showBugModal}
                bugReport={bugReport}
                copyBugReport={copyBugReport}
                setShowBugModal={setShowBugModal}
            />


            <SummaryModal
                showSummary={showSummary}
                summary={summary}
                setShowSummary={setShowSummary}
            />


            <ScriptModal
                showScriptModal={showScriptModal}
                script={automationScript}
                downloadScript={downloadScript}
                setShowScriptModal={setShowScriptModal}
            />


            <TestDataModal
                showTestDataModal={showTestDataModal}
                testData={testData}
                copyTestData={copyTestData}
                setShowTestDataModal={setShowTestDataModal}
            />


            <QAChatModal
                showChatModal={showChatModal}
                setShowChatModal={setShowChatModal}
                question={question}
                setQuestion={setQuestion}
                answer={answer}
                askQAAI={askQAAI}
                loadingChat={loadingChat}
            />

        </div>
    );
}

export default Dashboard;