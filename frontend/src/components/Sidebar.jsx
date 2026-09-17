import "../styles/sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

import {
    FaHome,
    FaFolderOpen,
    FaClipboardList,
    FaBug,
    FaCode,
    FaChartPie,
    FaRobot,
    FaCog,
    FaUserShield,
    FaBook,
    FaGem,
    FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/");
    };

    return (
        <aside className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo">

                <h2>🤖 TestCraftAI</h2>

                <p>AI Testing Platform</p>

            </div>


            {/* MAIN MENU */}
            <nav className="sidebar-menu">

                <NavLink to="/dashboard" className="menu-link">
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                        `menu-link ${isActive ? "active" : ""}`
                    }
                >
                    <FaFolderOpen />
                    <span>Projects</span>
                </NavLink>

                <NavLink to="/generated-cases" className="menu-link">
                    <FaClipboardList />
                    <span>Generated Cases</span>
                </NavLink>

                <NavLink
                    to="/bug-reports"
                    className={({ isActive }) =>
                        `menu-link ${isActive ||
                            window.location.pathname.startsWith("/project/") &&
                            window.location.pathname.endsWith("/bug-reports")
                            ? "active"
                            : ""
                        }`
                    }
                >
                    <FaBug />
                    <span>Bug Reports</span>
                </NavLink>

                <NavLink to="/automation" className="menu-link">
                    <FaCode />
                    <span>Automation Scripts</span>
                </NavLink>

                <NavLink to="/analytics" className="menu-link">
                    <FaChartPie />
                    <span>Analytics</span>
                </NavLink>

                <NavLink to="/assistant" className="menu-link">
                    <FaRobot />
                    <span>AI Assistant</span>
                </NavLink>

                <NavLink to="/settings" className="menu-link">
                    <FaCog />
                    <span>Settings</span>
                </NavLink>

                <NavLink to="/admin" className="menu-link">
                    <FaUserShield />
                    <span>Admin Panel</span>
                </NavLink>

            </nav>


            {/* FOOTER */}
            <div className="sidebar-footer">

                <button className="footer-btn documentation">
                    <FaBook />
                    <span>Documentation</span>
                </button>

                <button className="footer-btn upgrade">
                    <FaGem />
                    <span>Upgrade</span>
                </button>

                <button
                    className="footer-btn logout"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}