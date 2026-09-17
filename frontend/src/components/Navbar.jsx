import "../styles/navbar.css";
import {
  FaMoon,
  FaSun,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <header className="navbar">

      <div className="navbar-search">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search projects, test cases..."
        />

      </div>

      <div className="navbar-right">

        <button className="icon-btn">
          <FaBell />
        </button>

        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="profile">

          <FaUserCircle className="profile-icon" />

          <div>
            <h4>Dasharathi</h4>
            <span>Software Tester</span>
          </div>

        </div>

      </div>

    </header>
  );
}