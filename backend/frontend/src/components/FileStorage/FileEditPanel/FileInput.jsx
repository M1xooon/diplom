import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadFile } from '../../../redux/slices/filesSlice';
import './FileInput.css';

export default function FileInput() {
  const dispatch = useDispatch();
  const { currentStorageUser } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);

    await dispatch(uploadFile(formData));

    // Очистить форму
    setFile(null);
    setComment('');
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="file-input-form">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <input
        type="text"
        placeholder="Comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">Upload</button>
    </form>
  );
}
