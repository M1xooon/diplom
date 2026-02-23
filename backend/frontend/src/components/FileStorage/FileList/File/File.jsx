import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import './File.css';

export default function File({ file, onFileUpdated, onFileDeleted }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [newFilename, setNewFilename] = useState(file.native_file_name);
  const [newComment, setNewComment] = useState(file.comment || '');
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Скачать файл
  const handleDownload = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/files/?id=${file.id}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.native_file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  // Копировать ссылку
  const handleCopyLink = async () => {
    if (!file.public_download_id) {
      alert('Download link not available');
      return;
    }

    const link = `http://127.0.0.1:8000/api/link/${file.public_download_id}/`;
    
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    } catch (error) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  };

  // Переименовать файл
  const handleRename = async () => {
    if (!newFilename.trim()) {
      alert('Filename cannot be empty');
      return;
    }

    if (newFilename === file.native_file_name) {
      setIsRenaming(false);
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/files/rename/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        credentials: 'include',
        body: JSON.stringify({
          id: file.id,
          native_file_name: newFilename,
        }),
      });

      if (response.ok) {
        alert('File renamed successfully');
        setIsRenaming(false);
        if (onFileUpdated) {
          onFileUpdated({ ...file, native_file_name: newFilename });
        } else {
          window.location.reload();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to rename file');
      }
    } catch (error) {
      console.error('Error renaming file:', error);
      alert('An error occurred while renaming the file');
    } finally {
      setIsProcessing(false);
    }
  };

  // Изменить комментарий
  const handleUpdateComment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/files/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        credentials: 'include',
        body: JSON.stringify({
          id: file.id,
          comment: newComment,
        }),
      });

      if (response.ok) {
        alert('Comment updated successfully');
        setIsEditingComment(false);
        if (onFileUpdated) {
          onFileUpdated({ ...file, comment: newComment });
        } else {
          window.location.reload();
        }
      } else {
        alert('Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('An error occurred while updating the comment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Удалить файл
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${file.native_file_name}"?`)) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/files/?id=${file.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        credentials: 'include',
      });

      if (response.ok) {
        alert('File deleted successfully');
        if (onFileDeleted) {
          onFileDeleted(file.id);
        } else {
          window.location.reload();
        }
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('An error occurred while deleting the file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="file-card">
      <div className="file-header">
        {isRenaming ? (
          <div className="rename-container">
            <input
              type="text"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              className="rename-input"
              disabled={isProcessing}
            />
            <button onClick={handleRename} disabled={isProcessing} className="btn-save-small">
              ✓
            </button>
            <button onClick={() => setIsRenaming(false)} disabled={isProcessing} className="btn-cancel-small">
              ✗
            </button>
          </div>
        ) : (
          <>
            <h3 className="file-name">{file.native_file_name}</h3>
            <span className="file-size">{formatBytes(file.size)}</span>
          </>
        )}
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
        
        {isEditingComment ? (
          <div className="comment-edit-row">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-textarea"
              placeholder="Enter comment..."
              disabled={isProcessing}
            />
            <div className="comment-buttons">
              <button onClick={handleUpdateComment} disabled={isProcessing} className="btn-save-small">
                Save
              </button>
              <button onClick={() => setIsEditingComment(false)} disabled={isProcessing} className="btn-cancel-small">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="info-row comment-row">
            <span className="info-label">Comment:</span>
            <span className="info-value comment">{file.comment || 'No comment'}</span>
          </div>
        )}
      </div>

      <div className="file-actions">
        <button onClick={handleDownload} className="btn-action btn-download" title="Download file">
          ⬇️ Download
        </button>
        <button onClick={handleCopyLink} className="btn-action btn-copy" title="Copy link">
          🔗 Copy Link
        </button>
        <button onClick={() => setIsRenaming(true)} className="btn-action btn-rename" title="Rename file">
          ✏️ Rename
        </button>
        <button onClick={() => setIsEditingComment(true)} className="btn-action btn-comment" title="Edit comment">
          💬 Comment
        </button>
        <button onClick={handleDelete} disabled={isProcessing} className="btn-action btn-delete" title="Delete file">
          🗑️ Delete
        </button>
      </div>
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
    public_download_id: PropTypes.string,
  }).isRequired,
  onFileUpdated: PropTypes.func,
  onFileDeleted: PropTypes.func,
};
