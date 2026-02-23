import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFiles } from '../../../redux/slices/filesSlice';
import Cookies from 'js-cookie';
import './FileInput.css';

export default function FileInput() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (comment) {
        formData.append('comment', comment);
      }

      const response = await fetch('http://127.0.0.1:8000/api/files/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully!');
        // Очистить форму
        setFile(null);
        setComment('');
        e.target.reset();
        // Обновить список файлов
        dispatch(fetchFiles());
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('An error occurred while uploading the file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  return (
    <div className="file-input-container">
      <h3 className="file-input-title">📤 Upload New File</h3>
      
      <form onSubmit={handleSubmit} className="file-input-form">
        {error && (
          <div className="upload-error">
            {error}
          </div>
        )}

        <div className="file-select-wrapper">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            disabled={isUploading}
            className="file-input-hidden"
          />
          <label htmlFor="file-upload" className="file-select-label">
            {file ? (
              <span className="file-selected">
                📄 {file.name} <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
              </span>
            ) : (
              <span className="file-select-prompt">
                Click to select a file
              </span>
            )}
          </label>
        </div>

        <input
          type="text"
          placeholder="Add a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isUploading}
          className="comment-input"
          maxLength={100}
        />

        <button 
          type="submit" 
          disabled={!file || isUploading}
          className="upload-button"
        >
          {isUploading ? (
            <>
              <span className="upload-spinner"></span>
              Uploading...
            </>
          ) : (
            <>
              ⬆️ Upload File
            </>
          )}
        </button>
      </form>
    </div>
  );
}
