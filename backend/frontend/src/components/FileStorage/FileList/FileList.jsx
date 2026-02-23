import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFiles } from '../../../redux/slices/filesSlice';
import File from './File/File';
import './FileList.css';

export default function FileList() {
  const dispatch = useDispatch();
  const { files, loading } = useSelector((state) => state.files);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  const handleFileUpdated = (updatedFile) => {
    // Обновление произойдет через перезагрузку или Redux action
    dispatch(fetchFiles());
  };

  const handleFileDeleted = (fileId) => {
    // Обновление произойдет через перезагрузку или Redux action
    dispatch(fetchFiles());
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading files...</p>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="no-files">
        <p>📁 No files yet</p>
        <p className="no-files-hint">Upload your first file to get started!</p>
      </div>
    );
  }

  return (
    <div className="file-list">
      {files.map((file) => (
        <File
          key={file.id}
          file={file}
          onFileUpdated={handleFileUpdated}
          onFileDeleted={handleFileDeleted}
        />
      ))}
    </div>
  );
}
