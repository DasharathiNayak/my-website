export default function CreateProject({
    project,
    handleChange,
    createProject,
}) {
    return (
        <>
            <hr />

            <h3>Create New Project</h3>

            <form onSubmit={createProject} className="project-form">

                <input
                    type="text"
                    name="project_name"
                    placeholder="Project Name"
                    value={project.project_name}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Project Description"
                    value={project.description}
                    onChange={handleChange}
                    rows={4}
                    required
                />

                <button type="submit">
                    Create Project
                </button>

            </form>

            <hr />
        </>
    );
}