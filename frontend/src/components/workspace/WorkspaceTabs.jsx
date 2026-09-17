export default function WorkspaceTabs({
    activeTab,
    setActiveTab,
    hasRequirement
}) {
    const tabs = [
        {
            id: "overview",
            label: "Overview"
        },

        {
            id: "requirements",
            label: "Upload Requirement"
        },

        ...(hasRequirement
            ? [
                  {
                      id: "testcases",
                      label: "Generated Test Cases"
                  },
                  {
                      id: "bugs",
                      label: "Bug Reports"
                  },
                  {
                      id: "automation",
                      label: "Automation"
                  },
                  {
                      id: "analytics",
                      label: "Analytics"
                  },
                  {
                      id: "export",
                      label: "Export"
                  }
              ]
            : [])
    ];

    return (
        <div className="workspace-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`workspace-tab ${
                        activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}