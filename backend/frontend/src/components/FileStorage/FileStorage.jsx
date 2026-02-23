import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFiles } from '../../redux/slices/filesSlice';
import FileInput from './FileEditPanel/FileInput';
import FileList from './FileList/FileList';
import FileEditPanel from './FileEditPanel/FileEditPanel';

export default function FileStorage() {
  const dispatch = useDispatch();
  const { currentStorageUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFiles(currentStorageUser));
  }, [dispatch, currentStorageUser]);

  return (
    <div className="file-storage">
      <h2>File Storage</h2>
      <FileInput />
      <FileList />
      <FileEditPanel />
    </div>
  );
}
