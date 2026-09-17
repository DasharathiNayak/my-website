export default function TestDataModal({
    showTestDataModal,
    testData,
    setShowTestDataModal
}) {

    if (!showTestDataModal) {
        return null;
    }

    const data =
        testData?.test_data ??
        testData ??
        "No test data generated.";

    const formattedData =
        typeof data === "string"
            ? data
            : JSON.stringify(
                data,
                null,
                2
            );

    const copyTestData = async () => {

        try {

            await navigator.clipboard.writeText(
                formattedData
            );

            alert(
                "Test data copied successfully!"
            );

        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );

        }

    };

    return (

        <div
            className="script-modal-overlay"
            onClick={(e) => {

                if (
                    e.target === e.currentTarget
                ) {
                    setShowTestDataModal(false);
                }

            }}
        >

            <div className="script-modal">

                {/* HEADER */}

                <div className="script-modal-header">

                    <div>

                        <h2>
                            🧪 Test Data
                        </h2>

                        <p>
                            AI Generated Test Data
                        </p>

                    </div>

                    <button
                        className="script-close-btn"
                        onClick={() =>
                            setShowTestDataModal(false)
                        }
                    >
                        ✕
                    </button>

                </div>


                {/* DATA */}

                <div className="script-body">

                    <pre>
                        <code>
                            {formattedData}
                        </code>
                    </pre>

                </div>


                {/* FOOTER */}

                <div className="script-modal-footer">

                    <button
                        className="script-copy-btn"
                        onClick={copyTestData}
                    >
                        📋 Copy Test Data
                    </button>

                    <button
                        className="script-footer-close"
                        onClick={() =>
                            setShowTestDataModal(false)
                        }
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );
}