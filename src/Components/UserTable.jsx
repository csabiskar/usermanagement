import React, { useEffect, useState } from "react";
import axios from "axios";
import EditModal from "./EditModel"; // Ensure path is correct

function UserTable() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const STATUS_ACTIVE = "Active";
  const STATUS_INACTIVE = "Inactive";
  const LOCAL_STORAGE_KEY = "users_with_status";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          setUsers(JSON.parse(savedData));
          setError("");
        }

        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        const usersWithStatus = res.data.map((user) => ({
          ...user,
          status: user.id % 3 === 0 ? STATUS_ACTIVE : STATUS_INACTIVE,
          Role: ["Administrator", "Viewer", "Moderator"][
            Math.floor(Math.random() * 3)
          ],
        }));

        setUsers(usersWithStatus);
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(usersWithStatus)
        );
      } catch (err) {
        console.error(err);
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    if (window.confirm("Delete this user?")) {
      const updated = users.filter((u) => u.id !== userId);
      setUsers(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleToggle = (userId) => {
    const updated = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            status:
              u.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE,
          }
        : u
    );
    setUsers(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleEdit = (user) => setEditingUser({ ...user });
  const handleModalClose = () => setEditingUser(null);
  const handleChange = (field, value) =>
    setEditingUser((prev) => ({ ...prev, [field]: value }));
  const handleSave = () => {
    const updated = users.map((u) =>
      u.id === editingUser.id ? editingUser : u
    );
    setUsers(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setEditingUser(null);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <section className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="text-gray-700 text-sm sm:text-base">
          <p>
            All Users: <span className="font-semibold">{users.length}</span>{" "}
            &nbsp; Projects: <span className="font-semibold">884</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            + Add new user
          </button>
          <button className="border px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
            Suspend all
          </button>
          <button className="border px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
            Archive all
          </button>
          <button className="border px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm">
            Delete all
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="bg-gray-100 text-gray-600 border-amber-200 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Toggle</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isActive = user.status === STATUS_ACTIVE;
              return (
                <tr
                  key={user.id}
                  className="border-t border-gray-400 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {user.username}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <span
                      className={`${
                        isActive ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Toggle */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isActive}
                        onChange={() => handleToggle(user.id)}
                      />
                      <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 relative transition-all duration-300">
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
                      </div>
                    </label>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.Role === "Administrator"
                          ? "bg-blue-100 text-blue-700"
                          : user.Role === "Viewer"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {user.Role}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 flex gap-3 text-sm whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={handleModalClose}
          onSave={handleSave}
          onChange={handleChange}
        />
      )}
    </section>
  );
}

export default UserTable;
