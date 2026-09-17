import { useEffect, useState } from "react";
import * as dashboardService from "../services/dashboardService";
import "../styles/analytics.css";

export default function Analytics() {
  const [projects, setProjects] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("user_id");

      if (!userId) {
        setProjects([]);
        setTestCases([]);
        return;
      }

      // Load all projects
      const projectsResponse =
        await dashboardService.getProjects(userId);

      const allProjects = projectsResponse.data || [];

      setProjects(allProjects);

      // Load test cases from every project
      const allTestCases = [];

      for (const project of allProjects) {
        try {
          const response =
            await dashboardService.getTestCases(project.id);

          const projectTestCases = response.data || [];

          projectTestCases.forEach((testCase) => {
            allTestCases.push({
              ...testCase,
              projectId: project.id,
              projectName:
                project.project_name ||
                project.name ||
                `Project ${project.id}`,
            });
          });
        } catch (error) {
          console.error(
            `Failed to load test cases for project ${project.id}`,
            error
          );
        }
      }

      setTestCases(allTestCases);
    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error.response?.data || error
      );

      setProjects([]);
      setTestCases([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     OVERALL STATISTICS
     ===================================================== */

  const totalTestCases = testCases.length;

  const generatedScripts = testCases.filter(
    (testCase) => !!testCase.automation_script
  ).length;

  const pendingScripts =
    totalTestCases - generatedScripts;

  const automationCoverage =
    totalTestCases > 0
      ? Math.round(
          (generatedScripts / totalTestCases) * 100
        )
      : 0;

  /* =====================================================
     PRIORITY ANALYTICS
     ===================================================== */

  const priorityCount = {
    High: 0,
    Medium: 0,
    Low: 0,
  };

  testCases.forEach((testCase) => {
    const priority =
      testCase.priority?.toLowerCase();

    if (priority === "high") {
      priorityCount.High++;
    } else if (priority === "medium") {
      priorityCount.Medium++;
    } else if (priority === "low") {
      priorityCount.Low++;
    }
  });

  const maxPriority =
    Math.max(
      priorityCount.High,
      priorityCount.Medium,
      priorityCount.Low,
      1
    );

  /* =====================================================
     STATUS ANALYTICS
     ===================================================== */

  const statusCount = {};

  testCases.forEach((testCase) => {
    const status =
      testCase.status || "Not Specified";

    statusCount[status] =
      (statusCount[status] || 0) + 1;
  });

  /* =====================================================
     PROJECT ANALYTICS
     ===================================================== */

  const projectAnalytics = projects.map((project) => {
    const projectCases = testCases.filter(
      (testCase) =>
        testCase.projectId === project.id
    );

    const generated = projectCases.filter(
      (testCase) =>
        !!testCase.automation_script
    ).length;

    const coverage =
      projectCases.length > 0
        ? Math.round(
            (generated / projectCases.length) * 100
          )
        : 0;

    return {
      id: project.id,

      name:
        project.project_name ||
        project.name ||
        `Project ${project.id}`,

      total: projectCases.length,

      generated,

      pending:
        projectCases.length - generated,

      coverage,
    };
  });

  const maxProjectCases = Math.max(
    ...projectAnalytics.map(
      (project) => project.total
    ),
    1
  );

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <div className="analytics-loading-icon">
            📊
          </div>

          <h2>Loading Analytics...</h2>

          <p>
            Calculating your testing and automation
            metrics.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     UI
     ===================================================== */

  return (
    <div className="analytics-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="analytics-header">

        <div>
          <h1>Analytics</h1>

          <p>
            Monitor test coverage, automation progress
            and project quality metrics.
          </p>
        </div>

        <button
          className="analytics-refresh-btn"
          onClick={loadAnalytics}
        >
          ↻ Refresh
        </button>

      </div>

      {/* =================================================
          OVERVIEW CARDS
          ================================================= */}

      <div className="analytics-overview">

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            🧪
          </div>

          <div>
            <span>Total Test Cases</span>
            <strong>{totalTestCases}</strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            🤖
          </div>

          <div>
            <span>Automation Generated</span>
            <strong>{generatedScripts}</strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            ⏳
          </div>

          <div>
            <span>Automation Pending</span>
            <strong>{pendingScripts}</strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            📈
          </div>

          <div>
            <span>Automation Coverage</span>
            <strong>
              {automationCoverage}%
            </strong>
          </div>
        </div>

      </div>

      {/* =================================================
          CHART SECTION
          ================================================= */}

      <div className="analytics-grid">

        {/* PRIORITY */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">
            <div>
              <h2>Test Case Priority</h2>
              <p>
                Distribution of test cases by priority
              </p>
            </div>
          </div>

          <div className="analytics-bars">

            <div className="analytics-bar-row">

              <div className="analytics-bar-label">
                <span>High</span>
                <strong>
                  {priorityCount.High}
                </strong>
              </div>

              <div className="analytics-bar-track">
                <div
                  className="analytics-bar high"
                  style={{
                    width: `${
                      (priorityCount.High /
                        maxPriority) *
                      100
                    }%`,
                  }}
                />
              </div>

            </div>

            <div className="analytics-bar-row">

              <div className="analytics-bar-label">
                <span>Medium</span>
                <strong>
                  {priorityCount.Medium}
                </strong>
              </div>

              <div className="analytics-bar-track">
                <div
                  className="analytics-bar medium"
                  style={{
                    width: `${
                      (priorityCount.Medium /
                        maxPriority) *
                      100
                    }%`,
                  }}
                />
              </div>

            </div>

            <div className="analytics-bar-row">

              <div className="analytics-bar-label">
                <span>Low</span>
                <strong>
                  {priorityCount.Low}
                </strong>
              </div>

              <div className="analytics-bar-track">
                <div
                  className="analytics-bar low"
                  style={{
                    width: `${
                      (priorityCount.Low /
                        maxPriority) *
                      100
                    }%`,
                  }}
                />
              </div>

            </div>

          </div>

        </div>

        {/* AUTOMATION */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>Automation Coverage</h2>

              <p>
                Generated vs pending automation
              </p>
            </div>

            <div className="analytics-percentage">
              {automationCoverage}%
            </div>

          </div>

          <div className="analytics-progress">

            <div
              className="analytics-progress-fill"
              style={{
                width: `${automationCoverage}%`,
              }}
            />

          </div>

          <div className="analytics-progress-info">

            <span>
              ✓ {generatedScripts} Generated
            </span>

            <span>
              ○ {pendingScripts} Pending
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          PROJECT PERFORMANCE
          ================================================= */}

      <div className="analytics-panel analytics-project-panel">

        <div className="analytics-panel-header">

          <div>
            <h2>Project Performance</h2>

            <p>
              Test case and automation coverage by
              project
            </p>
          </div>

        </div>

        {projectAnalytics.length === 0 ? (

          <div className="analytics-empty">
            No projects available.
          </div>

        ) : (

          <div className="analytics-project-list">

            {projectAnalytics.map((project) => (

              <div
                className="analytics-project-row"
                key={project.id}
              >

                <div className="analytics-project-name">

                  <div className="analytics-project-icon">
                    📁
                  </div>

                  <div>
                    <strong>
                      {project.name}
                    </strong>

                    <span>
                      {project.total} Test Cases
                    </span>
                  </div>

                </div>

                <div className="analytics-project-bar">

                  <div className="analytics-project-bar-track">

                    <div
                      className="analytics-project-bar-fill"
                      style={{
                        width: `${
                          (project.total /
                            maxProjectCases) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                </div>

                <div className="analytics-project-numbers">

                  <span>
                    {project.generated} Generated
                  </span>

                  <span>
                    {project.pending} Pending
                  </span>

                  <strong>
                    {project.coverage}%
                  </strong>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =================================================
          STATUS DISTRIBUTION
          ================================================= */}

      <div className="analytics-panel analytics-status-panel">

        <div className="analytics-panel-header">

          <div>
            <h2>Test Case Status</h2>

            <p>
              Current status distribution across all
              projects
            </p>
          </div>

        </div>

        <div className="analytics-status-grid">

          {Object.keys(statusCount).length === 0 ? (

            <div className="analytics-empty">
              No status data available.
            </div>

          ) : (

            Object.entries(statusCount).map(
              ([status, count]) => (

                <div
                  className="analytics-status-card"
                  key={status}
                >

                  <span>{status}</span>

                  <strong>{count}</strong>

                  <small>
                    {totalTestCases > 0
                      ? Math.round(
                          (count /
                            totalTestCases) *
                            100
                        )
                      : 0}
                    % of total
                  </small>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}