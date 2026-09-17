import { useEffect, useState } from "react";
import "../styles/automationScripts.css";
import * as dashboardService from "../services/dashboardService";

export default function AutomationScripts() {
  const [search, setSearch] = useState("");
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedScript, setSelectedScript] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadAutomationScripts();
  }, []);

  const loadAutomationScripts = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("user_id");

      if (!userId) {
        setScripts([]);
        setProjects([]);
        return;
      }

      // Load all projects of current user
      const projectsResponse =
        await dashboardService.getProjects(userId);

      const allProjects = projectsResponse.data || [];

      setProjects(allProjects);

      // Load test cases from every project
      const allScripts = [];

      for (const project of allProjects) {
        try {
          const response =
            await dashboardService.getTestCases(project.id);

          const testCases = response.data || [];

          testCases.forEach((testCase, index) => {
            allScripts.push({
              id: testCase.id,

              // User-facing sequential ID per project
              testCaseId: `TC-${String(index + 1).padStart(3, "0")}`,

              title: testCase.title,

              script: testCase.automation_script || null,

              hasScript: !!testCase.automation_script,

              status: testCase.automation_script
                ? "Generated"
                : "Not Generated",

              language: "Python - Selenium",

              browser: "Chrome",

              project:
                project.project_name ||
                project.name ||
                `Project ${project.id}`,

              projectId: project.id,

              updated: testCase.updated_at
                ? new Date(
                  testCase.updated_at
                ).toLocaleDateString()
                : "Recently",
            });
          });
        } catch (error) {
          console.error(
            `Failed to load test cases for project ${project.id}:`,
            error
          );
        }
      }

      setScripts(allScripts);

    } catch (error) {
      console.error(
        "Failed to load automation scripts:",
        error.response?.data || error
      );

      setScripts([]);
      setProjects([]);

    } finally {
      setLoading(false);
    }
  };

  const filteredScripts = scripts.filter((script) => {
    const matchesProject =
      !selectedProject ||
      script.projectId === selectedProject;

    const matchesSearch =
      script.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      script.testCaseId
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      script.project
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return matchesProject && matchesSearch;
  });


  const generatedCount = scripts.filter(
    (script) => script.hasScript
  ).length;

  const copyScript = async (script) => {
    try {
      await navigator.clipboard.writeText(script.script);
      alert("Automation Script Copied");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Failed to copy script");
    }
  };

  const downloadScript = (script) => {
    const blob = new Blob([script.script], {
      type: "text/plain",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${script.testCaseId}_automation.py`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };

  const generateAutomationScript = async (script) => {
    try {
      const response =
        await dashboardService.getAutomationScript(script.id);

      const generatedScript =
        response.data?.data?.script;

      if (!generatedScript) {
        alert("Failed to generate automation script");
        return;
      }

      setScripts((prevScripts) =>
        prevScripts.map((item) =>
          item.id === script.id
            ? {
              ...item,
              script: generatedScript,
              hasScript: true,
              status: "Generated",
              updated: new Date().toLocaleDateString(),
            }
            : item
        )
      );

      alert("Automation Script Generated Successfully");
    } catch (error) {
      console.error(
        "Automation generation failed:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.detail ||
        "Failed to generate automation script"
      );
    }
  };

  return (
    <div className="automation-page">

      {/* Header */}
      <div className="automation-header">
        <div>
          <h1>Automation Scripts</h1>

          <p>
            Generate, view and manage Selenium automation
            scripts for your test cases.
          </p>
        </div>

        <div className="automation-stats">

          <div className="automation-stat-card">
            <span>Total Test Cases</span>
            <strong>{scripts.length}</strong>
          </div>

          <div className="automation-stat-card">
            <span>Generated</span>
            <strong>{generatedCount}</strong>
          </div>

        </div>
      </div>

      {/* Toolbar */}
      <div className="automation-toolbar">
        <div className="automation-search">
          🔍

          <input
            type="text"
            placeholder="Search automation scripts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="automation-content">

        <div className="automation-section-title">
          <div>
            <h2>
              {selectedProject
                ? "Automation Test Cases"
                : "Automation Scripts"}
            </h2>

            <p>
              {selectedProject
                ? `${filteredScripts.length} test cases available`
                : `${scripts.length} test cases available`}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="automation-empty">

            <div className="automation-empty-icon">
              ⏳
            </div>

            <h3>
              Loading automation scripts...
            </h3>

            <p>
              Please wait while we load your test cases.
            </p>

          </div>
        ) : !selectedProject ? (

          <div className="automation-project-folders">

            {projects.map((project) => {

              const projectScripts = scripts.filter(
                (script) => script.projectId === project.id
              );

              const projectGeneratedCount = projectScripts.filter(
                (script) => script.hasScript
              ).length;

              const name =
                project.project_name ||
                project.name ||
                `Project ${project.id}`;

              return (
                <div
                  className="automation-folder-card"
                  key={project.id}
                >

                  <div className="automation-folder-icon">
                    📁
                  </div>

                  <div className="automation-folder-info">

                    <h3>{name}</h3>

                    <p>
                      {projectScripts.length} Test Cases
                    </p>

                    <small>
                      {projectGeneratedCount} Automation Scripts Generated
                    </small>

                  </div>

                  <button
                    className="automation-folder-open-btn"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    Open Folder →
                  </button>

                </div>
              );

            })}

          </div>

        ) : (

          /* Inside Project Folder */
          <div className="automation-folder-view">

            {/* Folder Header */}
            <div className="automation-folder-view-header">

              <button
                className="automation-back-btn"
                onClick={() =>
                  setSelectedProject(null)
                }
              >
                ← Back
              </button>

              <div>
                <h2>
                  📁{" "}
                  {projects.find(
                    (project) => project.id === selectedProject
                  )?.project_name ||
                    projects.find(
                      (project) => project.id === selectedProject
                    )?.name ||
                    `Project ${selectedProject}`}
                </h2>
                <p>
                  {filteredScripts.length} Test Cases
                </p>
              </div>

            </div>

            {/* Test Cases */}
            <div className="automation-list">

              {filteredScripts.length === 0 ? (

                <div className="automation-empty">

                  <div className="automation-empty-icon">
                    🔍
                  </div>

                  <h3>
                    No test cases found
                  </h3>

                  <p>
                    Try searching with another test case
                    title or ID.
                  </p>

                </div>

              ) : (

                filteredScripts.map((script) => (

                  <div
                    className="automation-card"
                    key={script.id}
                  >

                    <div className="automation-card-top">

                      <div className="automation-icon">
                        &lt;/&gt;
                      </div>

                      <div className="automation-card-info">

                        <div className="automation-title-row">

                          <span className="automation-test-id">
                            {script.testCaseId}
                          </span>

                          <span className="automation-status">
                            {script.hasScript
                              ? "✓ Generated"
                              : "○ Not Generated"}
                          </span>

                        </div>

                        <h3>
                          {script.title}
                        </h3>

                        <div className="automation-meta">

                          <span>
                            📁{" "}
                            {projects.find(
                              (project) => project.id === selectedProject
                            )?.project_name ||
                              projects.find(
                                (project) => project.id === selectedProject
                              )?.name ||
                              `Project ${selectedProject}`}
                          </span>
                          <span>
                            🐍 {script.language}
                          </span>

                          <span>
                            🌐 {script.browser}
                          </span>

                          {script.updated && (
                            <span>
                              🕒 {script.updated}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="automation-card-actions">

                      {script.hasScript ? (

                        <>
                          <button
                            className="automation-view-btn"
                            onClick={() =>
                              setSelectedScript(script)
                            }
                          >
                            👁 View Script
                          </button>

                          <button
                            className="automation-copy-btn"
                            onClick={() =>
                              copyScript(script)
                            }
                          >
                            📋 Copy
                          </button>

                          <button
                            className="automation-download-btn"
                            onClick={() =>
                              downloadScript(script)
                            }
                          >
                            ⬇ Download
                          </button>
                        </>

                      ) : (

                        <div className="automation-not-generated">

                          <span>
                            Automation script not generated yet
                          </span>

                          <button
                            className="automation-generate-btn"
                            onClick={() =>
                              generateAutomationScript(script)
                            }
                          >
                            ⚡ Generate Script
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        )}

      </div>

      {/* Script Modal */}
      {selectedScript && (

        <div className="automation-modal-overlay">

          <div className="automation-modal">

            <div className="automation-modal-header">

              <div>

                <h2>
                  {selectedScript.testCaseId}
                </h2>

                <p>
                  {selectedScript.title}
                </p>

              </div>

              <button
                className="automation-close-btn"
                onClick={() =>
                  setSelectedScript(null)
                }
              >
                ✕
              </button>

            </div>

            <pre className="automation-code">
              {selectedScript.script}
            </pre>

            <div className="automation-modal-actions">

              <button
                className="automation-copy-btn"
                onClick={() =>
                  copyScript(selectedScript)
                }
              >
                📋 Copy Script
              </button>

              <button
                className="automation-download-btn"
                onClick={() =>
                  downloadScript(selectedScript)
                }
              >
                ⬇ Download
              </button>

              <button
                className="automation-view-btn"
                onClick={() =>
                  setSelectedScript(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}