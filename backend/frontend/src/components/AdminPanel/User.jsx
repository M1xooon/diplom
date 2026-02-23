import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IsStaffButton from './IsStaffButton';
import ToStorageBtn from './ToStorageBtn';
import { deleteUser, toggleAdminStatus } from '../../api/requests';

export default function User({ user, onUserDeleted, onAdminToggled }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingAdmin, setIsTogglingAdmin] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete user ${user.username}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteUser(user.id);
      if (response.ok) {
        alert('User deleted successfully');
        onUserDeleted(user.id);
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAdmin = async () => {
    const action = user.is_staff ? 'remove admin rights from' : 'make admin';
    if (!window.confirm(`Are you sure you want to ${action} ${user.username}?`)) {
      return;
    }

    setIsTogglingAdmin(true);
    try {
      const response = await toggleAdminStatus(user.id);
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        onAdminToggled(user.id, data.is_staff);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to change admin status');
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      alert('An error occurred while changing admin status');
    } finally {
      setIsTogglingAdmin(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.count || 0}</td>
      <td>{formatBytes(user.size)}</td>
      <td>
        <IsStaffButton isStaff={user.is_staff} />
      </td>
      <td className="action-buttons">
        <button
          onClick={handleToggleAdmin}
          disabled={isTogglingAdmin}
          className="btn-toggle-admin"
        >
          {isTogglingAdmin ? 'Processing...' : (user.is_staff ? 'Remove Admin' : 'Make Admin')}
        </button>
        <ToStorageBtn userId={user.id} />
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn-delete"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </td>
    </tr>
  );
}

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string,
    count: PropTypes.number,
    size: PropTypes.number,
    is_staff: PropTypes.bool.isRequired,
  }).isRequired,
  onUserDeleted: PropTypes.func.isRequired,
  onAdminToggled: PropTypes.func.isRequired,
};
