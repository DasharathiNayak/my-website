import {
    FaFolderOpen,
    FaClipboardList,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaCheckCircle,
} from "react-icons/fa";

export default function StatsCards({ stats = {} }) {

    const {
        projects = 0,
        testcases = 0,
        high = 0,
        medium = 0,
        low = 0
    } = stats;

    return (
        <div className="stats-container">

            <div className="stat-card blue">

                <div className="stat-top">
                    <FaFolderOpen className="stat-icon" />
                    <span className="trend-icon">↗</span>
                </div>

                <h2>{projects}</h2>
                <h4>Total Projects</h4>
                <p>Active Projects</p>

            </div>


            <div className="stat-card purple">

                <div className="stat-top">
                    <FaClipboardList className="stat-icon" />
                </div>

                <h2>{testcases}</h2>
                <h4>Test Cases</h4>
                <p>AI Generated</p>

            </div>


            <div className="stat-card red">

                <div className="stat-top">
                    <FaExclamationCircle className="stat-icon" />
                </div>

                <h2>{high}</h2>
                <h4>High Priority</h4>
                <p>Critical Bugs</p>

            </div>


            <div className="stat-card orange">

                <div className="stat-top">
                    <FaExclamationTriangle className="stat-icon" />
                </div>

                <h2>{medium}</h2>
                <h4>Medium</h4>
                <p>Needs Attention</p>

            </div>


            <div className="stat-card green">

                <div className="stat-top">
                    <FaCheckCircle className="stat-icon" />
                </div>

                <h2>{low}</h2>
                <h4>Low Priority</h4>
                <p>Minor Issues</p>

            </div>

        </div>
    );
}