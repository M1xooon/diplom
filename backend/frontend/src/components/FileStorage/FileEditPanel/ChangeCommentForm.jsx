import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { updateFile } from '../../../redux/slices/filesSlice';

export default function ChangeCommentForm({ fileId, currentComment }) {
  const dispatch = useDispatch();
  const { currentStorageUser } = useSelector((state) => state.auth);
  const [comment, setComment] = useState(currentComment || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(updateFile({
      fileData: { id: fileId, comment },
      userStorageId: currentStorageUser
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter comment"
      />
      <button type="submit">Update Comment</button>
    </form>
  );
}

ChangeCommentForm.propTypes = {
  fileId: PropTypes.number.isRequired,
  currentComment: PropTypes.string,
};
