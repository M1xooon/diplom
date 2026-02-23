import React, { useState, useEffect } from 'react';
import User from './User';
import { getDetailUserList } from '../../api/requests';
import '../Preloader/Preloader.css';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getDetailUserList();
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDeleted = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleAdminToggled = (userId, newAdminStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, is_staff: newAdminStatus } : user
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="preloader">Loading users...</div>;
  }

  return (
    <div className="users-list-container">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Files</th>
            <th>Storage Size</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <User
              key={user.id}
              user={user}
              onUserDeleted={handleUserDeleted}
              onAdminToggled={handleAdminToggled}
            />
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <div className="no-users">No users found</div>
      )}
    </div>
  );
}
