import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/layout.css";

export default function Layout({
  children,
  darkMode,
  setDarkMode,
}) {
  return (
    <div className={darkMode ? "app-layout dark-theme" : "app-layout"}>

      <Sidebar />

      <div className="main-layout">

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="page-content">
          {children}
        </main>

      </div>

    </div>
  );
}