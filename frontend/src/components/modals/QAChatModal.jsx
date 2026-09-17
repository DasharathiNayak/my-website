export default function QAChatModal({
  showChatModal,
  setShowChatModal,
  question,
  setQuestion,
  answer,
  askQAAI,
  loadingChat,
}) {
  if (!showChatModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: "800px" }}>
        <h2>💬 QA AI Assistant</h2>

        <textarea
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about testing..."
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
          }}
        />

        <button
          style={{ marginTop: "15px" }}
          onClick={askQAAI}
          disabled={loadingChat}
        >
          {loadingChat ? "Thinking..." : "Ask AI"}
        </button>

        <hr />

        <div
          style={{
            minHeight: "200px",
            whiteSpace: "pre-wrap",
          }}
        >
          {answer}
        </div>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button onClick={() => setShowChatModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}