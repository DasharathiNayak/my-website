export default function TestCaseTable({
  search,
  setSearch,

  priorityFilter,
  setPriorityFilter,

  statusFilter,
  setStatusFilter,

  filteredTestCases,

  editingId,
  editData,
  setEditData,

  startEdit,
  saveEdit,
  deleteTestCase,

  generateBugReport,
  generateScript,
  generateTestData,

  setEditingId,
}) {
  return (
    <div className="table-card">

      {/* ================= HEADER ================= */}
      <div className="table-header">

        <div>
          <h2>📋 Generated Test Cases</h2>

          <p>
            Manage, edit and generate AI testing artifacts.
          </p>
        </div>

        <div className="table-filters">

          <input
            type="text"
            placeholder="🔍 Search Test Cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="priority-filter"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="priority-filter"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-wrapper">

        <table className="testcase-table">

          <thead>
            <tr>
              <th>Sr No</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Expected Result</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredTestCases.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="no-testcases"
                >
                  No Test Cases Found
                </td>
              </tr>

            ) : (

              filteredTestCases.map((tc, index) => (

                <tr key={tc.id}>

                  {/* ================= SR NO ================= */}
                  <td>
                    {index + 1}
                  </td>

                  {/* ================= TITLE ================= */}
                  <td>

                    {editingId === tc.id ? (

                      <input
                        className="edit-input"
                        value={editData.title || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            title: e.target.value,
                          })
                        }
                      />

                    ) : (

                      <span className="testcase-title">
                        {tc.title}
                      </span>

                    )}

                  </td>

                  {/* ================= PRIORITY ================= */}
                  <td>

                    {editingId === tc.id ? (

                      <select
                        className="edit-select"
                        value={editData.priority || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            priority: e.target.value,
                          })
                        }
                      >
                        <option value="High">
                          High
                        </option>

                        <option value="Medium">
                          Medium
                        </option>

                        <option value="Low">
                          Low
                        </option>
                      </select>

                    ) : (

                      <span
                        className={`priority-badge ${tc.priority?.toLowerCase() || ""
                          }`}
                      >
                        {tc.priority}
                      </span>

                    )}

                  </td>

                  {/* ================= EXPECTED RESULT ================= */}
                  <td>

                    {editingId === tc.id ? (

                      <textarea
                        className="edit-textarea"
                        value={
                          editData.expected_result || ""
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            expected_result:
                              e.target.value,
                          })
                        }
                      />

                    ) : (

                      <span className="expected-result">
                        {tc.expected_result}
                      </span>

                    )}

                  </td>

                  {/* ================= ACTIONS ================= */}
                  <td className="action-cell">
                    {editingId === tc.id ? (
                      <div className="action-grid edit-mode">
                        <button
                          className="action-btn save-btn"
                          onClick={saveEdit}
                        >
                          💾 Save
                        </button>

                        <button
                          className="action-btn cancel-btn"
                          onClick={() => setEditingId(null)}
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-grid">

                        <button
                          className="action-btn edit-btn"
                          onClick={() => startEdit(tc)}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="action-btn delete-btn"
                          onClick={() => deleteTestCase(tc.id)}
                        >
                          🗑️ Delete
                        </button>

                        <button
                          className="action-btn bug-btn"
                          onClick={() => generateBugReport(tc.id)}
                        >
                          🐞 Bug Report
                        </button>

                        <button
                          className="action-btn script-btn"
                          onClick={() => generateScript(tc.id)}
                        >
                          🤖 Script
                        </button>

                        <button
                          className="action-btn data-btn"
                          onClick={() => generateTestData(tc.id)}
                        >
                          🧪 Test Data
                        </button>

                      </div>
                    )}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}