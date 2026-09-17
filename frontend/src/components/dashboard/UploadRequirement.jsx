import { ClipLoader } from "react-spinners";

export default function UploadRequirement({
  file,
  setFile,
  uploadDocument,
  generateSummary,
  generateAI,
  loadingAI,
}) {
  return (
    <div className="upload-card">
      <div className="upload-top">
        <h2>📄 Requirement Document</h2>
        <p>
          Upload your BRD, SRS or Requirement document to generate AI-powered
          outputs.
        </p>
      </div>

      <div className="upload-body">
        <label className="upload-box">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="upload-content">
            <div className="upload-icon">📁</div>

            <h3>
              {file ? file.name : "Choose Requirement Document"}
            </h3>

            <p>Supported: PDF • DOCX • TXT</p>
          </div>
        </label>

        <div className="upload-actions">
          <button
            className="upload-btn"
            onClick={uploadDocument}
          >
            📤 Upload Document
          </button>

          <button
            className="summary-btn"
            onClick={generateSummary}
          >
            ✨ Summarize Requirement
          </button>
        </div>

        <hr />

        <div className="ai-generator">
          <h2>🤖 AI Test Case Generator</h2>

          <button
            className="ai-btn"
            onClick={generateAI}
            disabled={loadingAI}
          >
            {loadingAI ? (
              <>
                <ClipLoader size={16} color="#fff" />
                <span style={{ marginLeft: "10px" }}>
                  Generating...
                </span>
              </>
            ) : (
              "✨ Generate AI Test Cases"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}