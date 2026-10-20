

import { useState } from "react";

const initialMembers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    plan: "Monthly",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "9876543211",
    plan: "Quarterly",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "9876543212",
    plan: "Yearly",
    status: "Inactive",
  },
];

function Members() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    plan: "Monthly",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);

  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.email} ${member.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(member) {
    setEditId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      plan: member.plan,
      status: member.status,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editId !== null) {
      setMembers((current) =>
        current.map((member) =>
          member.id === editId ? { ...form, id: editId } : member
        )
      );
    } else {
      setMembers((current) => [
        ...current,
        { ...form, id: Date.now() },
      ]);
    }

    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  }

  function deleteMember(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (confirmed) {
      setMembers((current) =>
        current.filter((member) => member.id !== id)
      );
    }
  }

  return (
    <section className="members-page">
      <div className="members-heading">
        <div>
          <h1>Members</h1>
          <p className="page-subtitle">
            Manage your gym members and membership details.
          </p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          + Add Member
        </button>
      </div>

      <div className="members-toolbar">
        <input
          type="search"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search members"
        />
        <span>{filteredMembers.length} members</span>
      </div>

      {showForm && (
        <div className="content-card member-form-card">
          <h2>{editId !== null ? "Edit Member" : "Add New Member"}</h2>

          <form onSubmit={handleSubmit} className="member-form">
            <label>
              Full Name
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Enter full name"
              />
            </label>

            <label>
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="Enter email address"
              />
            </label>

            <label>
              Phone
              <input
                required
                type="tel"
                pattern="[0-9]{10}"
                title="Enter a 10-digit phone number"
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="10-digit phone number"
              />
            </label>

            <label>
              Membership Plan
              <select
                value={form.plan}
                onChange={(event) =>
                  setForm({ ...form, plan: event.target.value })
                }
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editId !== null ? "Save Changes" : "Add Member"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card members-table-card">
        <div className="table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <strong>{member.name}</strong>
                    <small>{member.email}</small>
                  </td>
                  <td>{member.phone}</td>
                  <td>{member.plan}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        member.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => openEditForm(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteMember(member.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Members;
