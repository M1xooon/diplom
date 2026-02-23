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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="file-list">
      {files.map((file) => (
        <File key={file.id} file={file} />
      ))}
    </div>
  );
}
