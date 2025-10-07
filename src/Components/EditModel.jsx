import React from "react";

export default function EditModal({ user, onClose, onSave, onChange }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] sm:w-[400px] shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-center">Edit User</h3>

        {["name", "email",].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-sm mb-1 capitalize">{field}</label>
            <input
              type="text"
              value={user[field]}
              onChange={(e) => onChange(field, e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
