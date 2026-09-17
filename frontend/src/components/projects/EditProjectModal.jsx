import { useEffect, useState } from "react";

export default function EditProjectModal({
    open,
    project,
    users,
    onClose,
    onUpdate
}) {
    const [formData, setFormData] = useState({
        project_name: "",
        description: "",
        application_type: "Web",
        status: "Active",
        assigned_to: null
    });

    useEffect(() => {
        if (project) {
            setFormData({
                project_name: project.project_name || "",
                description: project.description || "",
                application_type: project.application_type || "Web",
                status: project.status || "Active",
                assigned_to: project.assigned_to || null
            });
        }
    }, [project]);

    if (!open || !project) {
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.project_name.trim()) {
            return;
        }

        await onUpdate({
            ...formData,
            project_name: formData.project_name.trim(),
            description: formData.description.trim(),
            assigned_to: formData.assigned_to
                ? Number(formData.assigned_to)
                : null
        });
    };

    return (
        <div className="create-project-overlay">
            <form
                className="create-project-modal"
                onSubmit={handleSubmit}
            >
                <div className="create-project-header">
                    <div className="create-project-title-area">
                        <div className="create-project-icon">
                            ✏️
                        </div>

                        <div>
                            <h2>Edit Project</h2>
                            <p>Update your AI testing project</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="create-project-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="create-project-body">

                    <div className="form-group">
                        <label>
                            Project Name
                            <span>*</span>
                        </label>

                        <input
                            type="text"
                            name="project_name"
                            value={formData.project_name}
                            onChange={handleChange}
                            placeholder="Enter project name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Assign User / Tester</label>

                        <select
                            name="assigned_to"
                            value={formData.assigned_to || ""}
                            onChange={handleChange}
                        >
                            <option value="">Unassigned</option>

                            {users?.map((user) => (
                                <option
                                    key={user.user_id}
                                    value={user.user_id}
                                >
                                    {user.fullname} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your project..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Application Type</label>

                        <select
                            name="application_type"
                            value={formData.application_type}
                            onChange={handleChange}
                        >
                            <option value="Web">💻 Web</option>
                            <option value="Mobile">📱 Mobile</option>
                            <option value="Desktop">🖥️ Desktop</option>
                            <option value="API">🔌 API</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Hold">Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                </div>

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
                        disabled={!formData.project_name.trim()}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}