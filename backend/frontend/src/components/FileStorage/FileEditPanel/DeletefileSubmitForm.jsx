import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { removeFile } from '../../../redux/slices/filesSlice';

export default function DeleteFileSubmitForm({ fileId }) {
  const dispatch = useDispatch();
  const { currentStorageUser } = useSelector((state) => state.auth);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      await dispatch(removeFile({
        fileId,
        userStorageId: currentStorageUser
      }));
    }
  };

  return (
    <button onClick={handleDelete} className="delete-button">
      Delete File
    </button>
  );
}

DeleteFileSubmitForm.propTypes = {
  fileId: PropTypes.number.isRequired,
};
