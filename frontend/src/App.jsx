import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import GeneratedCases from "./pages/GeneratedCases";
import BugReports from "./pages/BugReports";
import AutomationScripts from "./pages/AutomationScripts";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import ProjectWorkspace from "./pages/ProjectWorkspace";

import Layout from "./components/Layout";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  return (
    <Routes>

      {/* Login */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <Dashboard />
          </Layout>
        }
      />

      {/* Projects */}
      <Route
        path="/projects"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <Projects />
          </Layout>
        }
      />

      {/* Project Workspace
          ProjectWorkspace already contains Layout,
          so don't wrap it with Layout again.
      */}
      <Route
        path="/project/:id"
        element={<ProjectWorkspace />}
      />

      {/* Generated Test Cases */}
      <Route
        path="/generated-cases"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <GeneratedCases />
          </Layout>
        }
      />

      <Route
        path="/generated-cases/:id"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <GeneratedCases />
          </Layout>
        }
      />

      {/* Bug Reports */}
      <Route
        path="/bug-reports"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <BugReports />
          </Layout>
        }
      />

      <Route
        path="/project/:id/bug-reports"
        element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
            <BugReports />
          </Layout>
        }
      />

      {/* Automation Scripts */}
      <Route
        path="/automation"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <AutomationScripts />
          </Layout>
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <Analytics />
          </Layout>
        }
      />

      {/* AI Assistant */}
      <Route
        path="/assistant"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <AIAssistant />
          </Layout>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <Settings />
          </Layout>
        }
      />

      {/* Admin Panel */}
      <Route
        path="/admin"
        element={
          <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          >
            <AdminPanel />
          </Layout>
        }
      />

    </Routes>
  );
}

export default App;