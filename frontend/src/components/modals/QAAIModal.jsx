export default function QAAIModal({
    showQAModal,
    setShowQAModal,
    qaQuestion,
    setQaQuestion,
    qaAnswer,
    askQAAI,
    loadingQA
}) {

    if (!showQAModal) {
        return null;
    }

    return (
        <div className="qa-modal-overlay">

            <div className="qa-modal">

                {/* Header */}
                <div className="qa-modal-header">

                    <div>
                        <h2>💬 Ask QA AI</h2>

                        <p>
                            Ask anything about software testing
                        </p>
                    </div>

                    <button
                        className="qa-close-btn"
                        onClick={() => setShowQAModal(false)}
                    >
                        ✕
                    </button>

                </div>

                {/* Scrollable Body */}
                <div className="qa-modal-body">

                    <label className="qa-label">
                        Your Question
                    </label>

                    <textarea
                        value={qaQuestion}
                        onChange={(e) =>
                            setQaQuestion(e.target.value)
                        }
                        placeholder="Example: What are the positive and negative test cases for login?"
                        className="qa-question-input"
                    />

                    <button
                        className="qa-ask-btn"
                        onClick={askQAAI}
                        disabled={loadingQA || !qaQuestion.trim()}
                    >
                        {loadingQA
                            ? "🤖 Thinking..."
                            : "🤖 Ask QA AI"
                        }
                    </button>

                    {qaAnswer && (

                        <div className="qa-answer-box">

                            <div className="qa-answer-title">
                                🤖 QA AI Answer
                            </div>

                            <div className="qa-answer-content">
                                {qaAnswer}
                            </div>

                        </div>

                    )}

                </div>

                {/* Footer */}
                <div className="qa-modal-footer">

                    <button
                        className="qa-footer-close"
                        onClick={() =>
                            setShowQAModal(false)
                        }
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}