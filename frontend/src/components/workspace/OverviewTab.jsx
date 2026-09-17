import "./../../styles/overview.css";

export default function OverviewTab({

    project,

    summary,

    testCases

}) {

    return (

        <>

            <div className="overview-grid">

                <div className="overview-box">

                    <h4>📄 Project</h4>

                    <h2>
                        {project?.project_name || "-"}
                    </h2>

                </div>

                <div className="overview-box">

                    <h4>🧪 Test Cases</h4>

                    <h1>
                        {testCases?.length || 0}
                    </h1>

                </div>

                <div className="overview-box">

                    <h4>💻 Application</h4>

                    <h2>
                        {project?.application_type || "-"}
                    </h2>

                </div>

                <div className="overview-box">

                    <h4>🟢 Status</h4>

                    <h2>
                        {project?.status || "-"}
                    </h2>

                </div>

            </div>

            <div className="summary-card">

                <h2>🤖 AI Requirement Summary</h2>

                <br/>

                <p>

                    {
                        summary
                        ?

                        summary

                        :

                        "No AI Summary Generated Yet."

                    }

                </p>

            </div>

        </>

    );

}