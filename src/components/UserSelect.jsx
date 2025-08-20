import React from "react";

export default function UserSelect({ users, selectedUser, onChange }) {
  return (
    <select
      id="user-select"
      value={selectedUser}
      onChange={onChange}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
        fontSize: "1rem"
      }}
    >
      <option value=""></option>
      {users.map((user) => (
        <option key={user} value={user}>{user}</option>
      ))}
    </select>
  );
}
