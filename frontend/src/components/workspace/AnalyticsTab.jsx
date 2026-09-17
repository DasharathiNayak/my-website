export default function AnalyticsTab({ testCases = [] }) {

    const total = testCases.length;

    const high = testCases.filter(
        tc => tc.priority === "High"
    ).length;

    const medium = testCases.filter(
        tc => tc.priority === "Medium"
    ).length;

    const low = testCases.filter(
        tc => tc.priority === "Low"
    ).length;

    const pending = testCases.filter(
        tc => tc.status === "Pending"
    ).length;

    const passed = testCases.filter(
        tc => tc.status === "Passed"
    ).length;

    const failed = testCases.filter(
        tc => tc.status === "Failed"
    ).length;

    const percentage = (value) =>
        total === 0
            ? 0
            : Math.round((value / total) * 100);

    return (

        <div className="analytics-page">

            <div className="workspace-card">

                <h2>📊 Test Case Analytics</h2>

                <p>
                    Overview of generated test cases and their priorities.
                </p>

            </div>

            <div className="analytics-cards">

                <div className="analytics-card">
                    <span>📋</span>
                    <h3>{total}</h3>
                    <p>Total Test Cases</p>
                </div>

                <div className="analytics-card high">
                    <span>🔴</span>
                    <h3>{high}</h3>
                    <p>High Priority</p>
                </div>

                <div className="analytics-card medium">
                    <span>🟠</span>
                    <h3>{medium}</h3>
                    <p>Medium Priority</p>
                </div>

                <div className="analytics-card low">
                    <span>🟢</span>
                    <h3>{low}</h3>
                    <p>Low Priority</p>
                </div>

            </div>

            <div className="analytics-grid">

                <div className="workspace-card">

                    <h3>🎯 Priority Distribution</h3>

                    <div className="analytics-row">

                        <span>High</span>

                        <div className="analytics-bar">
                            <div
                                className="bar high-bar"
                                style={{
                                    width: `${percentage(high)}%`
                                }}
                            />
                        </div>

                        <strong>{high}</strong>

                    </div>

                    <div className="analytics-row">

                        <span>Medium</span>

                        <div className="analytics-bar">
                            <div
                                className="bar medium-bar"
                                style={{
                                    width: `${percentage(medium)}%`
                                }}
                            />
                        </div>

                        <strong>{medium}</strong>

                    </div>

                    <div className="analytics-row">

                        <span>Low</span>

                        <div className="analytics-bar">
                            <div
                                className="bar low-bar"
                                style={{
                                    width: `${percentage(low)}%`
                                }}
                            />
                        </div>

                        <strong>{low}</strong>

                    </div>

                </div>

                <div className="workspace-card">

                    <h3>📌 Status Overview</h3>

                    <div className="status-stat">
                        <span>⏳ Pending</span>
                        <strong>{pending}</strong>
                    </div>

                    <div className="status-stat">
                        <span>✅ Passed</span>
                        <strong>{passed}</strong>
                    </div>

                    <div className="status-stat">
                        <span>❌ Failed</span>
                        <strong>{failed}</strong>
                    </div>

                </div>

            </div>

        </div>

    );
}