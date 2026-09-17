import { Pie, Bar } from "react-chartjs-2";

const defaultPieData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
        {
            label: "Priority",
            data: [0, 0, 0],
            backgroundColor: [
                "#ef4444",
                "#f59e0b",
                "#22c55e",
            ],
            borderWidth: 0,
        },
    ],
};

const defaultBarData = {
    labels: ["Projects", "Test Cases"],
    datasets: [
        {
            label: "Count",
            data: [0, 0],
            backgroundColor: [
                "#2563eb",
                "#7c3aed",
            ],
            borderRadius: 8,
            borderSkipped: false,
        },
    ],
};

export default function AnalyticsCharts({
    pieData = defaultPieData,
    barData = defaultBarData,
}) {
    return (
        <section className="dashboard-analytics">

            <div className="analytics-header">
                <div>
                    <span className="analytics-kicker">
                        INSIGHTS
                    </span>

                    <h2>📊 Dashboard Analytics</h2>

                    <p>
                        Overview of your testing activity
                    </p>
                </div>
            </div>

            <div className="analytics-charts">

                {/* PIE CHART */}
                <div className="chart-card">

                    <h3>Test Case Priority</h3>

                    <div className="chart-wrapper pie-wrapper">
                        <Pie
                            data={pieData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,

                                plugins: {
                                    legend: {
                                        position: "bottom",
                                    },
                                },
                            }}
                        />
                    </div>

                </div>

                {/* BAR CHART */}
                <div className="chart-card">

                    <h3>Testing Overview</h3>

                    <div className="chart-wrapper">

                        <Bar
                            data={barData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,

                                plugins: {
                                    legend: {
                                        position: "top",
                                    },
                                },

                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            precision: 0,
                                        },
                                    },
                                },
                            }}
                        />

                    </div>

                </div>

            </div>

        </section>
    );
}