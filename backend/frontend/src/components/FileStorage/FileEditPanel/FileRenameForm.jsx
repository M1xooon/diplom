import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { updateFile } from '../../../redux/slices/filesSlice';

export default function FileRenameForm({ fileId, currentName }) {
  const dispatch = useDispatch();
  const { currentStorageUser } = useSelector((state) => state.auth);
  const [newName, setNewName] = useState(currentName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newName.trim()) {
      alert('Filename cannot be empty');
      return;
    }

    await dispatch(updateFile({
      fileData: { id: fileId, native_file_name: newName },
      userStorageId: currentStorageUser
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Enter new filename"
      />
      <button type="submit">Rename</button>
    </form>
  );
}

FileRenameForm.propTypes = {
  fileId: PropTypes.number.isRequired,
  currentName: PropTypes.string,
};
