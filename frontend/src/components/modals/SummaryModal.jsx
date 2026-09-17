export default function SummaryModal({
  showSummary,
  summary,
  setShowSummary,
}) {
  if (!showSummary) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          width: "650px",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h2>✨ AI Requirement Summary</h2>

        <hr />

        <ul>
          {summary.map((point, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {point}
            </li>
          ))}
        </ul>

        <div style={{ textAlign: "right" }}>
          <button
            onClick={() => setShowSummary(false)}
            style={{
              background: "#1976d2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}