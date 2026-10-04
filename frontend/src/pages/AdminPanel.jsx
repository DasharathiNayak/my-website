import { useMemo, useState } from "react";

import "../styles/adminPanel.css";



const navGroups = [

  {

    title: "Overview",

    items: [

      ["dashboard", "📊", "Dashboard"],

    ],

  },

  {

    title: "Management",

    items: [

      ["users", "👥", "User Management"],

      ["roles", "👑", "Roles & Permissions"],

      ["teams", "🏢", "Organizations & Teams"],

      ["projects", "📁", "Projects"],

    ],

  },

  {

    title: "Platform",

    items: [

      ["ai", "🤖", "AI Management"],

      ["analytics", "📈", "Analytics"],

      ["security", "🔐", "Security"],

      ["audit", "📝", "Audit Logs"],

    ],

  },

  {

    title: "Administration",

    items: [

      ["announcements", "📢", "Announcements"],

      ["features", "🚩", "Feature Flags"],

      ["plans", "💳", "Plans & Usage"],

      ["backup", "💾", "Backup & Data"],

      ["settings", "⚙️", "System Settings"],

    ],

  },

];



const initialUsers = [

  { id: 1, name: "Rohan", username: "rohan", email: "rohan@gmail.com", role: "Super Admin", status: "Active", team: "Management", lastLogin: "Just now" },

  { id: 2, name: "Rahul Sharma", username: "rahul", email: "rahul@gmail.com", role: "Tester", status: "Active", team: "QA Team", lastLogin: "12 min ago" },

  { id: 3, name: "Priya Verma", username: "priya", email: "priya@gmail.com", role: "Developer", status: "Active", team: "Development", lastLogin: "1 hr ago" },

  { id: 4, name: "Amit Kumar", username: "amit", email: "amit@gmail.com", role: "Viewer", status: "Suspended", team: "QA Team", lastLogin: "2 days ago" },

];



const permissions = [

  ["Dashboard", "view", "View dashboard"],

  ["Projects", "view", "View projects"],

  ["Projects", "create", "Create projects"],

  ["Projects", "edit", "Edit projects"],

  ["Projects", "delete", "Delete projects"],

  ["Test Cases", "view", "View test cases"],

  ["Test Cases", "create", "Create test cases"],

  ["Test Cases", "edit", "Edit test cases"],

  ["Bug Reports", "view", "View bug reports"],

  ["Bug Reports", "create", "Create bug reports"],

  ["Bug Reports", "edit", "Edit bug reports"],

  ["Automation", "view", "View automation scripts"],

  ["Automation", "create", "Create automation scripts"],

  ["Analytics", "view", "View analytics"],

  ["Analytics", "export", "Export analytics"],

  ["AI Assistant", "use", "Use AI Assistant"],

  ["Admin Panel", "view", "Open Admin Panel"],

];



const activity = [

  ["Rohan", "Created user Rahul Sharma", "2 min ago", "👤"],

  ["Rohan", "Changed Rahul's role to Tester", "18 min ago", "👑"],

  ["Rahul Sharma", "Created project Loan Management", "32 min ago", "📁"],

  ["Priya Verma", "Generated automation scripts", "1 hr ago", "🤖"],

  ["Admin", "Suspended Amit Kumar", "2 hr ago", "🔐"],

];



function StatCard({ icon, label, value, hint }) {

  return (

    <div className="admin-stat-card">

      <div className="admin-stat-top">

        <span className="admin-stat-icon">{icon}</span>

        <span className="admin-stat-hint">{hint}</span>

      </div>

      <strong>{value}</strong>

      <span>{label}</span>

    </div>

  );

}



export default function AdminPanel() {

  const [active, setActive] = useState("dashboard");

  const [users, setUsers] = useState(initialUsers);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [showCreate, setShowCreate] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [showPermissions, setShowPermissions] = useState(false);

  const [newUser, setNewUser] = useState({

    name: "", username: "", email: "", role: "Tester", team: "QA Team",

  });



  const filteredUsers = useMemo(() => {

    const q = search.trim().toLowerCase();

    return users.filter((u) => {

      const matchesSearch =

        !q ||

        [u.name, u.username, u.email, u.role, u.team]

          .join(" ")

          .toLowerCase()

          .includes(q);

      const matchesRole = roleFilter === "All" || u.role === roleFilter;

      const matchesStatus = statusFilter === "All" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;

    });

  }, [users, search, roleFilter, statusFilter]);



  const currentTitle =

    navGroups.flatMap((g) => g.items).find(([id]) => id === active)?.[2] ||

    "Admin Dashboard";



  const createUser = (e) => {

    e.preventDefault();

    if (!newUser.name.trim() || !newUser.email.trim()) return;



    setUsers((prev) => [

      {

        id: Date.now(),

        name: newUser.name.trim(),

        username: newUser.username.trim() || newUser.email.split("@")[0],

        email: newUser.email.trim(),

        role: newUser.role,

        status: "Pending Verification",

        team: newUser.team,

        lastLogin: "Never",

      },

      ...prev,

    ]);

    setNewUser({ name: "", username: "", email: "", role: "Tester", team: "QA Team" });

    setShowCreate(false);

    setActive("users");

  };



  const toggleUserStatus = (id) => {

    setUsers((prev) =>

      prev.map((u) =>

        u.id === id

          ? { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" }

          : u

      )

    );

  };



  const renderDashboard = () => (

    <>

      <div className="admin-page-heading">

        <div>

          <h1>Admin Dashboard</h1>

          <p>Manage users, access, security and the TestCraftAI platform.</p>

        </div>

        <button className="admin-primary-btn" onClick={() => setShowCreate(true)}>+ Create User</button>

      </div>



      <div className="admin-stat-grid">

        <StatCard icon="👥" value="128" label="Total Users" hint="+12%" />

        <StatCard icon="🟢" value="94" label="Active Users" hint="+8%" />

        <StatCard icon="📁" value="56" label="Active Projects" hint="+6%" />

        <StatCard icon="🤖" value="2,341" label="AI Generations" hint="+18%" />

      </div>



      <div className="admin-health-grid">

        {[

          ["API Service", "Online", "🟢"],

          ["Database", "Online", "🟢"],

          ["AI Service", "Online", "🟢"],

          ["Email / OTP", "Online", "🟢"],

        ].map(([name, status, icon]) => (

          <div className="admin-health-card" key={name}>

            <span>{icon}</span><div><strong>{name}</strong><small>{status}</small></div>

          </div>

        ))}

      </div>



      <div className="admin-content-grid">

        <section className="admin-card">

          <div className="admin-card-header"><div><h2>Recent Activity</h2><p>Latest important actions across the platform.</p></div><button className="admin-link-btn" onClick={() => setActive("audit")}>View all</button></div>

          <div className="activity-list">

            {activity.map(([who, what, when, icon]) => (

              <div className="activity-row" key={who + what}>

                <span className="activity-icon">{icon}</span>

                <div><strong>{who}</strong><span>{what}</span></div>

                <small>{when}</small>

              </div>

            ))}

          </div>

        </section>



        <section className="admin-card">

          <div className="admin-card-header"><div><h2>Pending Attention</h2><p>Items that may need admin action.</p></div></div>

          <div className="attention-list">

            <button onClick={() => setActive("users")}><span>📧</span><div><strong>8</strong><small>Pending email verification</small></div><b>›</b></button>

            <button onClick={() => setActive("security")}><span>🚨</span><div><strong>3</strong><small>Failed login alerts</small></div><b>›</b></button>

            <button onClick={() => setActive("ai")}><span>⚡</span><div><strong>12</strong><small>Users near AI quota</small></div><b>›</b></button>

          </div>

        </section>

      </div>

    </>

  );



  const renderUsers = () => (

    <>

      <div className="admin-page-heading">

        <div><h1>User Management</h1><p>Create users, manage status, roles and access.</p></div>

        <button className="admin-primary-btn" onClick={() => setShowCreate(true)}>+ Create User</button>

      </div>



      <div className="admin-toolbar">

        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, username or email..." />

        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>

          <option>All</option><option>Super Admin</option><option>Admin</option><option>Manager</option><option>Tester</option><option>Developer</option><option>Viewer</option>

        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>

          <option>All</option><option>Active</option><option>Suspended</option><option>Pending Verification</option>

        </select>

      </div>



      <div className="admin-card admin-table-card">

        <div className="admin-card-header"><div><h2>All Users</h2><p>{filteredUsers.length} users shown</p></div></div>

        <div className="admin-table-wrap">

          <table className="admin-table">

            <thead><tr><th>User</th><th>Role</th><th>Team</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>

            <tbody>

              {filteredUsers.map((u) => (

                <tr key={u.id}>

                  <td><div className="user-cell"><span className="user-avatar">{u.name.charAt(0).toUpperCase()}</span><div><strong>{u.name}</strong><small>@{u.username} · {u.email}</small></div></div></td>

                  <td><span className="admin-role-badge">{u.role}</span></td>

                  <td>{u.team}</td>

                  <td><span className={`admin-status ${u.status.toLowerCase().replaceAll(" ", "-")}`}>{u.status}</span></td>

                  <td>{u.lastLogin}</td>

                  <td><div className="table-actions"><button onClick={() => setSelectedUser(u)}>View</button><button onClick={() => setShowPermissions(true)}>Access</button><button onClick={() => toggleUserStatus(u.id)}>{u.status === "Suspended" ? "Activate" : "Suspend"}</button></div></td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </>

  );



  const renderRoles = () => (

    <>

      <div className="admin-page-heading"><div><h1>Roles & Permissions</h1><p>Control what each role can view, create, edit, delete and export.</p></div><button className="admin-primary-btn">+ Create Role</button></div>

      <div className="role-grid">

        {[

          ["Super Admin", "Full system access", "12 users", "🛡️"],

          ["Admin", "Platform administration", "4 users", "👑"],

          ["Manager", "Teams and projects", "8 users", "🏢"],

          ["Tester", "Testing workflow", "52 users", "🧪"],

          ["Developer", "Development workflow", "38 users", "💻"],

          ["Viewer", "Read-only access", "14 users", "👁️"],

        ].map(([name, desc, count, icon]) => (

          <div className="role-card" key={name}><span className="role-card-icon">{icon}</span><h3>{name}</h3><p>{desc}</p><small>{count}</small><button onClick={() => setShowPermissions(true)}>Manage permissions →</button></div>

        ))}

      </div>

    </>

  );



  const renderGeneric = (id) => {

    const configs = {

      teams: ["Organizations & Teams", "Create organizations, teams and assign members.", [["Organizations", "12"], ["Teams", "27"], ["Members", "128"]]],

      projects: ["Project Management", "Manage ownership, access and project assignments.", [["Active Projects", "56"], ["Archived", "18"], ["Members", "128"]]],

      ai: ["AI Management", "Control AI feature access, quotas and platform usage.", [["AI Generations", "2,341"], ["Near Quota", "12"], ["Failed", "19"]]],

      analytics: ["Platform Analytics", "Review usage, activity and platform-level trends.", [["DAU", "94"], ["New Users", "12"], ["Active Projects", "56"]]],

      security: ["Security", "Monitor logins, sessions and account security policies.", [["Failed Logins", "3"], ["Active Sessions", "27"], ["Locked Accounts", "1"]]],

      audit: ["Audit Logs", "Track important administrative and user actions.", [["Today", "84"], ["This Week", "421"], ["Security Events", "12"]]],

      announcements: ["Announcements", "Publish platform announcements to selected audiences.", [["Published", "24"], ["Scheduled", "3"], ["Drafts", "5"]]],

      features: ["Feature Flags", "Enable or disable platform features by role or user.", [["Enabled", "18"], ["Beta", "4"], ["Disabled", "3"]]],

      plans: ["Plans & Usage", "Manage plans, quotas and platform usage limits.", [["Free", "84"], ["Pro", "32"], ["Enterprise", "12"]]],

      backup: ["Backup & Data", "Export, archive and protect platform data.", [["Last Backup", "Today"], ["Archives", "18"], ["Exports", "42"]]],

      settings: ["System Settings", "Configure general, email, OTP, password and system policies.", [["Email / OTP", "Online"], ["Password Policy", "Strong"], ["System", "Healthy"]]],

    };

    const [title, desc, cards] = configs[id];

    return (

      <>

        <div className="admin-page-heading"><div><h1>{title}</h1><p>{desc}</p></div><button className="admin-primary-btn">{id === "announcements" ? "+ New Announcement" : id === "features" ? "+ Add Feature" : "Configure"}</button></div>

        <div className="admin-mini-grid">{cards.map(([label, value]) => <div className="admin-mini-card" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>

        <div className="admin-card admin-placeholder-card">

          <div className="placeholder-icon">⚙️</div>

          <h2>{title} workspace</h2>

          <p>The section layout is ready. Its backend actions, database persistence and permission checks will be connected in the next implementation phase.</p>

          <button className="admin-secondary-btn" onClick={() => setActive("users")}>Back to User Management</button>

        </div>

      </>

    );

  };



  return (

    <div className="admin-page">

      <aside className="admin-sidebar">

        <div className="admin-brand"><span>🛡️</span><div><strong>Admin Center</strong><small>TestCraftAI</small></div></div>

        <div className="admin-sidebar-scroll">

          {navGroups.map((group) => (

            <div className="admin-nav-group" key={group.title}>

              <span className="admin-nav-label">{group.title}</span>

              {group.items.map(([id, icon, label]) => (

                <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}><span>{icon}</span>{label}</button>

              ))}

            </div>

          ))}

        </div>

        <div className="admin-sidebar-footer"><span>🟢</span><div><strong>System Healthy</strong><small>All core services online</small></div></div>

      </aside>



      <main className="admin-main">

        <header className="admin-topbar">

          <div><span className="admin-breadcrumb">Admin Center</span><span className="admin-chevron">/</span><strong>{currentTitle}</strong></div>

          <div className="admin-top-actions"><button title="Notifications">🔔</button><button title="Settings" onClick={() => setActive("settings")}>⚙️</button><div className="admin-user-chip"><span>R</span><div><strong>Rohan</strong><small>Super Admin</small></div></div></div>

        </header>



        <div className="admin-content">

          {active === "dashboard" && renderDashboard()}

          {active === "users" && renderUsers()}

          {active === "roles" && renderRoles()}

          {active !== "dashboard" && active !== "users" && active !== "roles" && renderGeneric(active)}

        </div>

      </main>



      {showCreate && (

        <div className="admin-modal-backdrop" onMouseDown={() => setShowCreate(false)}>

          <form className="admin-modal" onSubmit={createUser} onMouseDown={(e) => e.stopPropagation()}>

            <div className="admin-modal-header"><div><h2>Create User</h2><p>Create the account, then verify the email with OTP.</p></div><button type="button" onClick={() => setShowCreate(false)}>×</button></div>

            <div className="admin-form-grid">

              <label>Full Name<input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required placeholder="Rahul Sharma" /></label>

              <label>Username<input value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder="rahul" /></label>

              <label className="full">Gmail / Email<input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required placeholder="rahul@gmail.com" /></label>

              <label>Role<select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}><option>Admin</option><option>Manager</option><option>Tester</option><option>Developer</option><option>Viewer</option></select></label>

              <label>Team<select value={newUser.team} onChange={(e) => setNewUser({ ...newUser, team: e.target.value })}><option>Management</option><option>QA Team</option><option>Development</option><option>Product</option></select></label>

            </div>

            <div className="otp-info"><span>📧</span><div><strong>Email verification required</strong><small>After creation, a 6-digit OTP should be sent to the user's email before activation.</small></div></div>

            <div className="admin-modal-actions"><button type="button" className="admin-secondary-btn" onClick={() => setShowCreate(false)}>Cancel</button><button className="admin-primary-btn">Create & Send OTP</button></div>

          </form>

        </div>

      )}



      {selectedUser && (

        <div className="admin-modal-backdrop" onMouseDown={() => setSelectedUser(null)}>

          <div className="admin-modal" onMouseDown={(e) => e.stopPropagation()}>

            <div className="admin-modal-header"><div><h2>{selectedUser.name}</h2><p>User account details</p></div><button onClick={() => setSelectedUser(null)}>×</button></div>

            <div className="detail-list">

              <div><span>Email</span><strong>{selectedUser.email}</strong></div>

              <div><span>Username</span><strong>@{selectedUser.username}</strong></div>

              <div><span>Role</span><strong>{selectedUser.role}</strong></div>

              <div><span>Team</span><strong>{selectedUser.team}</strong></div>

              <div><span>Status</span><strong>{selectedUser.status}</strong></div>

              <div><span>Last Login</span><strong>{selectedUser.lastLogin}</strong></div>

            </div>

            <div className="admin-modal-actions"><button className="admin-secondary-btn" onClick={() => setShowPermissions(true)}>Manage Access</button><button className="admin-primary-btn" onClick={() => setSelectedUser(null)}>Close</button></div>

          </div>

        </div>

      )}



      {showPermissions && (

        <div className="admin-modal-backdrop" onMouseDown={() => setShowPermissions(false)}>

          <div className="admin-modal admin-permission-modal" onMouseDown={(e) => e.stopPropagation()}>

            <div className="admin-modal-header"><div><h2>Access Control</h2><p>Fine-grained permissions for this role/user.</p></div><button onClick={() => setShowPermissions(false)}>×</button></div>

            <div className="permission-list">

              {permissions.map(([module, action, label], index) => (

                <label key={module + action}><div><strong>{module}</strong><small>{label}</small></div><input type="checkbox" defaultChecked={index < 10 || module === "Dashboard"} /></label>

              ))}

            </div>

            <div className="admin-modal-actions"><button className="admin-secondary-btn" onClick={() => setShowPermissions(false)}>Cancel</button><button className="admin-primary-btn" onClick={() => setShowPermissions(false)}>Save Permissions</button></div>

          </div>

        </div>

      )}

    </div>

  );

}
