export default function BugReportModal({
  showBugModal,
  bugReport,
  copyBugReport,
  setShowBugModal,
  addBugReport,
}) {
  if (!showBugModal || !bugReport) return null;

  const handleAddBug = async () => {
    const success = await addBugReport();

    if (success) {
      setShowBugModal(false);
    }
  };

  const status = bugReport.status || "Open";

  return (
    <div className="bug-modal-overlay">
      <div className="bug-modal">

        {/* ================= HEADER ================= */}

        <div className="bug-modal-header">
          <div>
            <span className="bug-modal-label">
              AI ANALYSIS
            </span>

            <h2>
              🪲 AI Generated Bug Report
            </h2>
          </div>

          <button
            type="button"
            className="bug-modal-close"
            onClick={() => setShowBugModal(false)}
          >
            ✕
          </button>
        </div>


        {/* ================= CONTENT ================= */}

        <div className="bug-modal-content">

          {/* META INFORMATION */}

          <div className="bug-meta-grid">

            <div className="bug-meta-item">
              <span>Bug ID</span>

              <strong>
                {bugReport.bug_id || "Will be generated"}
              </strong>
            </div>


            <div className="bug-meta-item">
              <span>Severity</span>

              <strong>
                {bugReport.severity || "N/A"}
              </strong>
            </div>


            <div className="bug-meta-item">
              <span>Priority</span>

              <strong>
                {bugReport.priority || "N/A"}
              </strong>
            </div>


            <div className="bug-meta-item">
              <span>Environment</span>

              <strong>
                {bugReport.environment || "N/A"}
              </strong>
            </div>

          </div>


          {/* TITLE */}

          <div className="bug-detail-section">

            <span className="bug-detail-label">
              TITLE
            </span>

            <p>
              {bugReport.title || "N/A"}
            </p>

          </div>


          {/* PRE CONDITION */}

          <div className="bug-detail-section">

            <span className="bug-detail-label">
              PRE-CONDITION
            </span>

            <p>
              {bugReport.pre_condition || "N/A"}
            </p>

          </div>


          {/* STEPS TO REPRODUCE */}

          <div className="bug-detail-section">

            <span className="bug-detail-label">
              STEPS TO REPRODUCE
            </span>

            <p className="preserve-lines">
              {bugReport.steps_to_reproduce || "N/A"}
            </p>

          </div>


          {/* EXPECTED RESULT */}

          <div className="bug-detail-section">

            <span className="bug-detail-label">
              EXPECTED RESULT
            </span>

            <p>
              {bugReport.expected_result || "N/A"}
            </p>

          </div>


          {/* ACTUAL RESULT */}

          <div className="bug-detail-section">

            <span className="bug-detail-label">
              ACTUAL RESULT
            </span>

            <p>
              {bugReport.actual_result || "N/A"}
            </p>

          </div>


          {/* STATUS */}

          <div className="bug-detail-section">

            <span className="bug-detail-label">
              STATUS
            </span>

            <span
              className={`bug-status ${status.toLowerCase()}`}
            >
              {status}
            </span>

          </div>

        </div>


        {/* ================= FOOTER ================= */}

        <div className="bug-modal-footer">

          {/* ADD BUG */}

          <button
            type="button"
            className="bug-btn-add"
            onClick={handleAddBug}
          >
            ➕ Add Bug Report
          </button>


          {/* PDF */}

          <button
            type="button"
            className="bug-btn-secondary"
            onClick={() =>
              window.open(
                `http://127.0.0.1:8000/testcases/bug-report-pdf/${bugReport.testcase_id}`,
                "_blank"
              )
            }
          >
            📄 Download PDF
          </button>


          {/* COPY */}

          <button
            type="button"
            className="bug-btn-copy"
            onClick={copyBugReport}
          >
            📋 Copy
          </button>


          {/* CLOSE */}

          <button
            type="button"
            className="bug-btn-primary"
            onClick={() => setShowBugModal(false)}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}

