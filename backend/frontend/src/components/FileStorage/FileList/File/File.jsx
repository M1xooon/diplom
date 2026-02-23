import React from 'react';
import PropTypes from 'prop-types';
import FileDescription from './FileDescription';
import FileActions from './FileActions';
import './File.css';

export default function File({ file }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-card">
      <div className="file-header">
        <h3 className="file-name">{file.native_file_name}</h3>
        <span className="file-size">{formatBytes(file.size)}</span>
      </div>

      <div className="file-info">
        <div className="info-row">
          <span className="info-label">Uploaded:</span>
          <span className="info-value">{formatDate(file.upload_date)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Last Downloaded:</span>
          <span className="info-value">{formatDate(file.last_download_date)}</span>
        </div>
        {file.comment && (
          <div className="info-row comment-row">
            <span className="info-label">Comment:</span>
            <span className="info-value comment">{file.comment}</span>
          </div>
        )}
      </div>

      <FileDescription file={file} />

      <FileActions file={file} />
    </div>
  );
}

File.propTypes = {
  file: PropTypes.shape({
    id: PropTypes.number.isRequired,
    native_file_name: PropTypes.string.isRequired,
    size: PropTypes.number,
    upload_date: PropTypes.string,
    last_download_date: PropTypes.string,
    comment: PropTypes.string,
    public_download_id: PropTypes.string.isRequired,
  }).isRequired,
};
