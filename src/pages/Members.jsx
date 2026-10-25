import { useState, useEffect } from "react";
import api from "../api";

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const emptyForm = { name: "", email: "", phone: "", plan: "Monthly", status: "Active" };
  const [form, setForm] = useState(emptyForm);

  // Load members from backend on mount
  useEffect(() => {
    api.get("/api/members")
      .then((res) => setMembers(res.data))
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) =>
    `${m.name} ${m.email} ${m.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  function openAddForm() { setEditId(null); setForm(emptyForm); setShowForm(true); }
  function openEditForm(m) { setEditId(m.id); setForm({ name: m.name, email: m.email, phone: m.phone, plan: m.plan, status: m.status }); setShowForm(true); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId !== null) {
      const res = await api.put(`/api/members/${editId}`, form);
      setMembers((curr) => curr.map((m) => m.id === editId ? res.data : m));
    } else {
      const res = await api.post("/api/members", form);
      setMembers((curr) => [...curr, res.data]);
    }
    setShowForm(false); setEditId(null); setForm(emptyForm);
  }

  async function deleteMember(id) {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    await api.delete(`/api/members/${id}`);
    setMembers((curr) => curr.filter((m) => m.id !== id));
  }

  if (loading) return <p style={{ padding: "2rem" }}>Loading members...</p>;
  if (error)   return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <section className="members-page">
      <div className="members-heading">
        <div>
          <h1>Members</h1>
          <p className="page-subtitle">Manage your gym members and membership details.</p>
        </div>
        <button className="primary-button" onClick={openAddForm}>+ Add Member</button>
      </div>

      <div className="members-toolbar">
        <input
          type="search"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search members"
        />
        <span>{filtered.length} members</span>
      </div>

      {showForm && (
        <div className="content-card member-form-card">
          <h2>{editId !== null ? "Edit Member" : "Add New Member"}</h2>
          <form onSubmit={handleSubmit} className="member-form">
            <label>Full Name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
            </label>
            <label>Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email address" />
            </label>
            <label>Phone
              <input required type="tel" pattern="[0-9]{10}" title="Enter a 10-digit phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit phone number" />
            </label>
            <label>Membership Plan
              <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </label>
            <label>Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
            <div className="form-actions">
              <button className="primary-button" type="submit">{editId !== null ? "Save Changes" : "Add Member"}</button>
              <button className="secondary-button" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card members-table-card">
        <div className="table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Member</th><th>Phone</th><th>Plan</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong><small>{m.email}</small></td>
                  <td>{m.phone}</td>
                  <td>{m.plan}</td>
                  <td>
                    <span className={`status-badge ${m.status === "Active" ? "status-active" : "status-inactive"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => openEditForm(m)}>Edit</button>
                      <button className="delete-button" onClick={() => deleteMember(m.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="empty-state">No members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Members;
