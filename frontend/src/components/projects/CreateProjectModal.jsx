import { useState } from "react";

export default function CreateProjectModal({
    open,
    onClose,
    onCreate
}) {
    const [project, setProject] = useState({
        project_name: "",
        description: "",
        application_type: "Web",
        status: "Active"
    });

    if (!open) {
        return null;
    }

    const handleChange = (e) => {
        setProject({
            ...project,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!project.project_name.trim()) {
            return;
        }

        console.log("CREATE PROJECT CLICKED");
        console.log("Project Data:", project);

        await onCreate(project);
    };

    return (
        <div className="create-project-overlay">

            <form
                className="create-project-modal"
                onSubmit={submit}
            >

                {/* HEADER */}
                <div className="create-project-header">

                    <div className="create-project-title-area">
                        <div className="create-project-icon">
                            📁
                        </div>

                        <div>
                            <h2>Create New Project</h2>

                            <p>
                                Create a new AI testing project
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="create-project-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* BODY */}
                <div className="create-project-body">

                    {/* PROJECT NAME */}
                    <div className="form-group">

                        <label>
                            Project Name
                            <span>*</span>
                        </label>

                        <input
                            type="text"
                            name="project_name"
                            value={project.project_name}
                            placeholder="Enter project name"
                            onChange={handleChange}
                            autoComplete="off"
                        />

                    </div>


                    {/* DESCRIPTION */}
                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={project.description}
                            placeholder="Describe your project..."
                            onChange={handleChange}
                        />

                    </div>


                    {/* APPLICATION TYPE */}
                    <div className="form-group">

                        <label>
                            Application Type
                        </label>

                        <select
                            name="application_type"
                            value={project.application_type}
                            onChange={handleChange}
                        >
                            <option value="Web">
                                💻 Web
                            </option>

                            <option value="Mobile">
                                📱 Mobile
                            </option>

                            <option value="Desktop">
                                🖥️ Desktop
                            </option>

                            <option value="API">
                                🔌 API
                            </option>
                        </select>

                    </div>


                    {/* INFO BOX */}
                    <div className="create-project-info">

                        <div className="info-icon">
                            ✨
                        </div>

                        <div>
                            <strong>
                                AI Testing Ready
                            </strong>

                            <p>
                                Once created, you can upload your
                                requirements and generate AI-powered
                                test cases.
                            </p>
                        </div>

                    </div>

                </div>


                {/* FOOTER */}
                <div className="create-project-footer">

                    <button
                        type="button"
                        className="create-project-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="create-project-submit"
                        disabled={!project.project_name.trim()}
                    >
                        Create Project
                    </button>

                </div>

            </form>

        </div>
    );
}