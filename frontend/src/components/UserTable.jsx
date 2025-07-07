// ✅ File: src/components/UserTable.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const roles = ["staff", "coordinator", "admin"];

const UserTable = ({ users, setUsers }) => {
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axiosInstance.patch(`/users/${userId}/`, {
        role: newRole,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success("Role updated successfully!");
    } catch (error) {
      toast.error("Failed to update role");
      console.error(error);
    }
  };

  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        <table className="w-full border text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Current Role</th>
              <th className="p-2">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.full_name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white text-sm ${
                    user.role === "admin"
                      ? "bg-red-500"
                      : user.role === "coordinator"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-2">
                  <select
                    className="border rounded p-1"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {roles.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default UserTable;
