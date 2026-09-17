import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";

import WorkspaceHeader from "../components/workspace/WorkspaceHeader";
import WorkspaceTabs from "../components/workspace/WorkspaceTabs";
import OverviewTab from "../components/workspace/OverviewTab";

import UploadRequirement from "../components/dashboard/UploadRequirement";
import TestCaseTable from "../components/dashboard/TestCaseTable";

import useWorkspace from "../hooks/useWorkspace";

import "../styles/workspace.css";

import BugReportModal from "../components/modals/BugReportModal";

import AutomationScriptModal
    from "../components/modals/AutomationScriptModal";

import TestDataModal
    from "../components/modals/TestDataModal";

import QAAIModal from "../components/modals/QAAIModal";

import AnalyticsTab from "../components/workspace/AnalyticsTab";


export default function ProjectWorkspace({ darkMode, setDarkMode }) {

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            localStorage.setItem("project_id", id);
        }
    }, [id]);

    const [activeTab, setActiveTab] = useState("overview");




    const {
        project,
        summary,
        testCases,

        file,
        setFile,

        loadingAI,

        uploadDocument,
        generateSummary,
        generateAI,

        search,
        setSearch,

        priorityFilter,
        setPriorityFilter,

        statusFilter,
        setStatusFilter,

        filteredTestCases,

        editingId,
        setEditingId,
        editData,
        setEditData,
        startEdit,
        saveEdit,
        deleteTestCase,

        bugReport,
        showBugModal,
        setShowBugModal,
        loadingBug,
        generateBugReport,
        addBugReport,

        testData,
        showTestDataModal,
        setShowTestDataModal,
        loadingTestData,
        generateTestData,

        qaQuestion,
        setQaQuestion,
        qaAnswer,
        showQAModal,
        setShowQAModal,
        loadingQA,
        askQAAI,

        automationScript,
        showScriptModal,
        setShowScriptModal,
        loadingScript,
        generateScript,

        exportExcel,
        exportPDF,

    } = useWorkspace(id);

    const [hasRequirement, setHasRequirement] = useState(false);

    console.log


    return (

        <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
        >

            <div className="workspace">

                {
                    project ? (

                        <div className="workspace-project-header">
                            <WorkspaceHeader
                                project={project}
                                onAskQAAI={() => setShowQAModal(true)}
                            />

                            <div className="workspace-testcase-action">
                                <button
                                    className="view-testcases-btn"
                                    onClick={() =>
                                        navigate(`/generated-cases/${project.id}`)
                                    }
                                >
                                    🧪 View Test Cases →
                                </button>
                            </div>
                        </div>

                    ) : (

                        <div className="workspace-card">

                            <h2>Loading Project...</h2>

                        </div>

                    )
                }

                <WorkspaceTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    hasRequirement={hasRequirement}
                />

                <div className="workspace-content">

                    {
                        activeTab === "overview" &&

                        <OverviewTab
                            project={project}
                            summary={summary}
                            testCases={testCases}
                        />
                    }

                    {
                        activeTab === "requirements" &&

                        <>

                            <UploadRequirement

                                file={file}

                                setFile={setFile}

                                uploadDocument={async () => {

                                    const success = await uploadDocument();

                                    return success;

                                }}

                                generateSummary={generateSummary}

                                generateAI={async () => {

                                    const result = await generateAI();

                                    if (result?.newTestCases > 0) {
                                        setHasRequirement(true);
                                        setActiveTab("testcases");
                                    }

                                }}

                                loadingAI={loadingAI}

                            />

                            <div
                                className="workspace-card"
                                style={{ marginTop: "20px" }}
                            >

                                <h2>🤖 AI Requirement Summary</h2>

                                <br />

                                <p>

                                    {
                                        summary

                                            ?

                                            summary

                                            :

                                            "Upload a requirement document to generate AI Summary."
                                    }

                                </p>

                            </div>

                        </>

                    }

                    {
                        activeTab === "testcases" &&

                        <TestCaseTable

                            search={search}
                            setSearch={setSearch}

                            priorityFilter={priorityFilter}
                            setPriorityFilter={setPriorityFilter}

                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}

                            filteredTestCases={filteredTestCases}

                            editingId={editingId}
                            editData={editData}
                            setEditData={setEditData}

                            startEdit={startEdit}
                            saveEdit={saveEdit}
                            deleteTestCase={deleteTestCase}

                            generateBugReport={generateBugReport}
                            generateScript={generateScript}
                            generateTestData={generateTestData}



                            setEditingId={setEditingId}

                        />

                    }
                    <BugReportModal
                        showBugModal={showBugModal}
                        bugReport={bugReport}
                        setShowBugModal={setShowBugModal}
                        addBugReport={addBugReport}
                    />

                    <AutomationScriptModal
                        showScriptModal={showScriptModal}
                        automationScript={automationScript}
                        setShowScriptModal={setShowScriptModal}
                    />

                    <TestDataModal
                        showTestDataModal={showTestDataModal}
                        testData={testData}
                        setShowTestDataModal={setShowTestDataModal}
                    />

                    <QAAIModal
                        showQAModal={showQAModal}
                        setShowQAModal={setShowQAModal}
                        qaQuestion={qaQuestion}
                        setQaQuestion={setQaQuestion}
                        qaAnswer={qaAnswer}
                        askQAAI={askQAAI}
                        loadingQA={loadingQA}
                    />

                    {
                        activeTab === "bugs" &&

                        <div className="workspace-card">

                            <h2>🐞 Bug Reports</h2>

                            <p style={{ marginTop: "10px" }}>
                                Generate bug reports from your test cases.
                            </p>

                            {
                                testCases.length === 0 ? (

                                    <div style={{ marginTop: "25px" }}>

                                        <p>
                                            No test cases available.
                                        </p>

                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            marginTop: "25px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px"
                                        }}
                                    >

                                        {testCases.map((tc, index) => (

                                            <div
                                                key={tc.id}
                                                className="workspace-card"
                                                style={{
                                                    margin: 0,
                                                    border: "1px solid #e5e7eb"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center"
                                                    }}
                                                >

                                                    <div>

                                                        <strong>
                                                            #{index + 1} {tc.title}
                                                        </strong>

                                                        <p
                                                            style={{
                                                                marginTop: "6px",
                                                                color: "#64748b"
                                                            }}
                                                        >
                                                            Priority: {tc.priority}
                                                        </p>

                                                    </div>

                                                    <button
                                                        className="bug-btn"
                                                        onClick={() =>
                                                            generateBugReport(tc.id)
                                                        }
                                                    >
                                                        🪲 Generate Bug Report
                                                    </button>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )

                            }

                        </div>
                    }

                    {
                        activeTab === "automation" &&

                        <div className="workspace-card">

                            <h2>⚡ Automation Scripts</h2>

                            <p style={{ marginTop: "8px" }}>
                                Generate automation scripts for your test cases.
                            </p>

                            {
                                testCases.length === 0 ? (

                                    <div style={{ marginTop: "20px" }}>
                                        <p>No test cases available.</p>
                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            marginTop: "20px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px"
                                        }}
                                    >

                                        {testCases.map((tc, index) => (

                                            <div
                                                key={tc.id}
                                                className="workspace-card"
                                                style={{
                                                    margin: 0,
                                                    border: "1px solid #e5e7eb"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        gap: "20px"
                                                    }}
                                                >

                                                    <div>

                                                        <strong>
                                                            #{index + 1} {tc.title}
                                                        </strong>

                                                        <p
                                                            style={{
                                                                marginTop: "6px",
                                                                color: "#64748b"
                                                            }}
                                                        >
                                                            Priority: {tc.priority}
                                                        </p>

                                                    </div>

                                                    <button
                                                        className="script-btn"
                                                        onClick={() =>
                                                            generateScript(tc.id)
                                                        }
                                                    >
                                                        🤖 Generate Script
                                                    </button>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )
                            }

                        </div>
                    }

                    {
                        activeTab === "analytics" &&

                        <AnalyticsTab
                            testCases={testCases}
                        />
                    }

                    {
                        activeTab === "export" &&

                        <div className="export-actions">

                            <button
                                className="export-excel-btn"
                                onClick={exportExcel}
                            >
                                📊 Export Excel
                            </button>

                            <button
                                className="export-pdf-btn"
                                onClick={exportPDF}
                            >
                                📄 Export PDF
                            </button>

                        </div>
                    }

                </div>

            </div>

        </Layout>

    );

}