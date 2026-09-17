import { useState } from "react";
import * as dashboardService from "../services/dashboardService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/AIAssistant.css";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! 👋 I'm TestCraftAI Assistant. Ask me anything about software testing, test cases, bugs, automation, QA, or your testing workflow."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "How can I improve my test coverage?",
    "What is the difference between smoke and regression testing?",
    "How should I write a good test case?",
    "What are the most common API testing scenarios?"
  ];

  const askQuestion = async (text = question) => {
    const trimmedQuestion = text.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: trimmedQuestion
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await dashboardService.askQAAI(trimmedQuestion);

      const answer =
        response?.data?.answer ||
        response?.data?.data?.answer ||
        response?.data?.response ||
        response?.data?.data?.response ||
        response?.data?.message ||
        response?.data?.data?.message ||
        "I couldn't generate a response right now.";

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: answer
        }
      ]);
    } catch (error) {
      console.error("QA AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Sorry, I couldn't connect to the QA AI service. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    askQuestion();
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "32px",
        background: "#f5f7fb"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px"
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 700,
              color: "#0f172a"
            }}
          >
            AI Assistant
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              fontSize: "15px"
            }}
          >
            Your intelligent assistant for software testing and QA.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#ecfdf5",
            color: "#047857",
            padding: "9px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 600
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981"
            }}
          />
          AI Online
        </div>
      </div>

      {/* Main Chat Card */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)"
        }}
      >
        {/* Assistant Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#eef2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}
          >
            🤖
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#0f172a",
                fontSize: "16px"
              }}
            >
              TestCraftAI Assistant
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "13px",
                marginTop: "3px"
              }}
            >
              QA & Software Testing Expert
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            minHeight: "280px",
            maxHeight: "420px",
            overflowY: "auto",
            padding: "18px 20px"
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  message.type === "user" ? "flex-end" : "flex-start",
                marginBottom: "18px"
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  display: "flex",
                  gap: "10px",
                  flexDirection:
                    message.type === "user" ? "row-reverse" : "row"
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    minWidth: "34px",
                    borderRadius: "50%",
                    background:
                      message.type === "user" ? "#2563eb" : "#eef2ff",
                    color:
                      message.type === "user" ? "#ffffff" : "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px"
                  }}
                >
                  {message.type === "user" ? "U" : "🤖"}
                </div>

                <div
                  style={{
                    padding: "13px 16px",
                    borderRadius: "14px",
                    background:
                      message.type === "user" ? "#2563eb" : "#f8fafc",
                    color:
                      message.type === "user" ? "#ffffff" : "#334155",
                    border:
                      message.type === "user"
                        ? "none"
                        : "1px solid #e2e8f0",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap"
                  }}
                >
                  <div className="ai-markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#64748b",
                fontSize: "14px"
              }}
            >
              <span style={{ fontSize: "18px" }}>🤖</span>
              AI is thinking...
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        <div
          style={{
            padding: "0 20px 16px",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              marginBottom: "10px",
              fontWeight: 600
            }}
          >
            Suggested questions
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px"
            }}
          >
            {suggestedQuestions.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => askQuestion(item)}
                disabled={loading}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #dbe3ef",
                  background: "#ffffff",
                  borderRadius: "8px",
                  color: "#475569",
                  fontSize: "12px",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "18px 24px",
            borderTop: "1px solid #e2e8f0",
            background: "#fafbfc",
            display: "flex",
            gap: "12px"
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about software testing..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "13px 16px",
              border: "1px solid #dbe3ef",
              borderRadius: "10px",
              outline: "none",
              fontSize: "14px",
              background: "#ffffff"
            }}
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "0 22px",
              background:
                loading || !question.trim() ? "#94a3b8" : "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              cursor:
                loading || !question.trim() ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}