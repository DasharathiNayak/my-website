import { FaRobot } from "react-icons/fa";

export default function HeroBanner() {
  return (
    <div className="dashboard-header">
      <div>
        <h2 className="main-title">
          <FaRobot /> TestCraftAI
        </h2>

        <p className="subtitle">
          AI Powered Software Testing Platform
        </p>
      </div>

      <div className="hero-banner">
        <div>
          <h2>Welcome to TestCraftAI 👋</h2>

          <p>
            Generate intelligent Test Cases, Bug Reports,
            Automation Scripts and Test Data using AI.
          </p>

          <div className="hero-badge">
            🟢 AI Engine Active
          </div>
        </div>
      </div>
    </div>
  );
}