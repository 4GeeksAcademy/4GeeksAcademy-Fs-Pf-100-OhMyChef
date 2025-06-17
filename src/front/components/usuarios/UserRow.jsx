import React from 'react';

const UserRow = ({ user }) => {
  return (
    <tr>
      <td>
        <div className="user-info-name">{user.name}</div>
        <div className="user-info-email">{user.email}</div>
      </td>
      <td>
        <span className={`badge ${user.role}`}>{user.role}</span>
      </td>
      <td>
        <span className={`badge ${user.status}`}>{user.status}</span>
      </td>
      <td>{user.restaurant}</td>
      <td>
        <div className="user-actions">
          <button title="View">👁️</button>
          <button title="Edit">✏️</button>
          <button className="delete" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
