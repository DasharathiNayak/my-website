import * as dashboardService from "../services/dashboardService";
import { useState, useEffect } from "react";
import "../styles/projects.css";
import useProjects from "../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import EditProjectModal from "../components/projects/EditProjectModal";

export default function Projects() {

    const [openModal, setOpenModal] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await dashboardService.getAllUsers();
                setUsers(response.data || []);
            } catch (err) {
                console.error("Failed to load users:", err);
            }
        };

        loadUsers();
    }, []);

    const {
        projects,
        createProject,
        updateProject,
        deleteProject
    } = useProjects();

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [userFilter, setUserFilter] = useState("All Users");

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.project_name
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All Status" ||
            project.status === statusFilter;

        const matchesUser =
            userFilter === "All Users" ||
            String(project.assigned_to) === String(userFilter);

        return matchesSearch && matchesStatus && matchesUser;
    });

    return (
        <div className="projects-page">

            <div className="projects-header">

                <div>
                    <h1>📁 Projects</h1>
                    <p>Manage all your AI Testing Projects</p>
                </div>

                <button

                    className="new-project-btn"

                    onClick={() => setOpenModal(true)}

                >

                    + New Project

                </button>

            </div>

            <div className="projects-toolbar">

                <input
                    type="text"
                    placeholder="🔍 Search Projects..."
                    className="search-project"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Hold">Hold</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    className="filter"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                >
                    <option value="All Users">All Users</option>

                    {users.map((user) => (
                        <option
                            key={user.user_id}
                            value={user.user_id}
                        >
                            {user.fullname}
                        </option>
                    ))}
                </select>

            </div>

            <div className="project-grid">

                {filteredProjects.length === 0 ? (

                    <div className="empty-projects">
                        <h2>No Projects Found</h2>
                        <p>Create your first AI Testing Project.</p>
                    </div>

                ) : (

                    filteredProjects.map((project) => (

                        <div
                            className="project-card"
                            key={project.id}
                        >

                            <div className="project-top">

                                <h3>{project.project_name}</h3>

                                <span className="status active">
                                    {project.status}
                                </span>

                            </div>

                            <div className="project-info">
                                <p>
                                    {project.description}
                                </p>

                                <p>
                                    💻 {project.application_type}
                                </p>

                                <p>
                                    👤 Assigned To:{" "}
                                    {project.assigned_to
                                        ? users.find(
                                            (user) => user.user_id === project.assigned_to
                                        )?.fullname || "Unknown User"
                                        : "Unassigned"}
                                </p>
                            </div>

                            <div className="project-actions">

                                <button
                                    className="open-btn"
                                    onClick={() => {
                                        localStorage.setItem("project_id", project.id);
                                        navigate(`/project/${project.id}`);
                                    }}                                >
                                    Open
                                </button>

                                <button
                                    className="edit-btn"
                                    onClick={() => setEditProject(project)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => setDeleteProjectId(project.id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>
            <CreateProjectModal

                open={openModal}

                onClose={() => setOpenModal(false)}

                onCreate={async (data) => {

                    const success = await createProject(data);

                    if (success) {

                        setOpenModal(false);

                    }

                }}

            />
            <EditProjectModal
                open={!!editProject}
                project={editProject}
                users={users}
                onClose={() => setEditProject(null)}
                onUpdate={async (data) => {
                    const success = await updateProject(editProject.id, data);

                    if (success) {
                        setEditProject(null);
                    }
                }}
            />

            {deleteProjectId && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                        <div className="delete-confirm-icon">
                            🗑️
                        </div>

                        <h2>Delete Project?</h2>

                        <p>
                            Are you sure you want to delete this project?
                            <br />
                            All related test cases and bug reports will also be deleted.
                        </p>

                        <div className="delete-confirm-actions">
                            <button
                                className="delete-cancel-btn"
                                onClick={() => setDeleteProjectId(null)}
                            >
                                No, Cancel
                            </button>

                            <button
                                className="delete-confirm-btn"
                                onClick={async () => {
                                    const success = await deleteProject(deleteProjectId);

                                    if (success) {
                                        setDeleteProjectId(null);
                                    }
                                }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}