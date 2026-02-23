import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

export default function FileActions({ file, onFileUpdated }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFilename, setNewFilename] = useState(file.native_file_name);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/get/${file.public_download_id}`;

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
      const response = await fetch('/api/files/rename/', {
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
        }
        // Перезагрузить страницу для обновления списка
        window.location.reload();
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

  const handleCancelRename = () => {
    setIsRenaming(false);
    setNewFilename(file.native_file_name);
  };

  if (isRenaming) {
    return (
      <div className="file-rename-container">
        <input
          type="text"
          value={newFilename}
          onChange={(e) => setNewFilename(e.target.value)}
          className="rename-input"
          disabled={isProcessing}
          autoFocus
        />
        <div className="rename-buttons">
          <button
            onClick={handleRename}
            disabled={isProcessing}
            className="btn-save"
          >
            ✓ Save
          </button>
          <button
            onClick={handleCancelRename}
            disabled={isProcessing}
            className="btn-cancel"
          >
            ✗ Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="file-actions">
      <button
        onClick={handleCopyLink}
        className="btn-action btn-copy"
        title="Copy link"
      >
        🔗 Copy Link
      </button>
      <button
        onClick={() => setIsRenaming(true)}
        className="btn-action btn-rename"
        title="Rename file"
      >
        ✏️ Rename
      </button>
    </div>
  );
}

FileActions.propTypes = {
  file: PropTypes.shape({
    id: PropTypes.number.isRequired,
    native_file_name: PropTypes.string.isRequired,
    public_download_id: PropTypes.string.isRequired,
  }).isRequired,
  onFileUpdated: PropTypes.func,
};
