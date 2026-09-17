export default function AutomationScriptModal({
    showScriptModal,
    automationScript,
    setShowScriptModal
}) {

    if (!showScriptModal) {
        return null;
    }

    const script =
        typeof automationScript === "string"
            ? automationScript
            : automationScript?.script || "";

    const copyScript = async () => {

        try {

            await navigator.clipboard.writeText(script);

            alert("Script copied successfully!");

        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );

        }

    };

    const downloadScript = () => {

        const blob = new Blob(
            [script],
            {
                type: "text/plain;charset=utf-8"
            }
        );

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "automation_script.py";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

    };

    return (

        <div
            className="script-modal-overlay"
            onClick={(e) => {

                if (
                    e.target === e.currentTarget
                ) {
                    setShowScriptModal(false);
                }

            }}
        >

            <div className="script-modal">

                {/* HEADER */}

                <div className="script-modal-header">

                    <div>

                        <h2>
                            🤖 Automation Script
                        </h2>

                        <p>
                            AI Generated Selenium Automation Script
                        </p>

                    </div>

                    <button
                        className="script-close-btn"
                        onClick={() =>
                            setShowScriptModal(false)
                        }
                    >
                        ✕
                    </button>

                </div>


                {/* SCRIPT */}

                <div className="script-body">

                    <pre>
                        <code>
                            {script ||
                                "No script generated."}
                        </code>
                    </pre>

                </div>


                {/* FOOTER */}

                <div className="script-modal-footer">

                    <button
                        className="script-copy-btn"
                        onClick={copyScript}
                    >
                        📋 Copy Script
                    </button>

                    <button
                        className="script-download-btn"
                        onClick={downloadScript}
                    >
                        ⬇️ Download .py
                    </button>

                    <button
                        className="script-footer-close"
                        onClick={() =>
                            setShowScriptModal(false)
                        }
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );
}