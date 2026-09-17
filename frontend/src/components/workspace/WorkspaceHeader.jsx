export default function WorkspaceHeader({
    project,
    onAskQAAI
}) {

    return (

        <div className="workspace-header">

            <div>

                <h1>
                    🏦 {project?.project_name || "Project Workspace"}
                </h1>

                <p>
                    {project?.description ||
                        "AI Powered Testing Workspace"}
                </p>

            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}
            >

                <button
                    className="qa-ai-header-btn"
                    onClick={onAskQAAI}
                >
                    💬 Ask QA AI
                </button>

                <span className="workspace-status">
                    {project?.status || "Active"}
                </span>

            </div>

        </div>

    );

}