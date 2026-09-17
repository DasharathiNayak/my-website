export default function ScriptModal({
  showScriptModal,
  script,
  downloadScript,
  setShowScriptModal,
}) {
  if (!showScriptModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: "900px" }}>
        <h2>🤖 AI Generated Automation Script</h2>

        <pre
          style={{
            background: "#1e1e1e",
            color: "#00ff7f",
            padding: "20px",
            borderRadius: "8px",
            maxHeight: "500px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {script}
        </pre>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button onClick={downloadScript}>
            📥 Download Script
          </button>

          <button onClick={() => setShowScriptModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}