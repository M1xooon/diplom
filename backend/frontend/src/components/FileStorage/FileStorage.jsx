import React, { useContext, useEffect, useState } from 'react';
import FileInput from './FileEditPanel/FileInput';
import FileList from './FileList/FileList';
import FileEditPanel from './FileEditPanel/FileEditPanel';
import { postFile, getFiles, getUserFiles } from '../../api/requests';
import state from '../../GlobalState/state';

function FileStorage() {
  const [currentFile, setCurrentFile] = useState();
  const [files, setFiles] = useState([]);
  const { currentStorageUser: currentStorageUserId } = useContext(state);

  useEffect(() => {
    const fetchData = async () => {
      let response;

      if (currentStorageUserId) {
        response = await getUserFiles(currentStorageUserId);
      } else {
        response = await getFiles();
      }

      const data = await response.json();

      setFiles(data);
    };

    fetchData();
  }, []);

  const sendFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', '');
    const response = await postFile(formData);
    const data = await response.json();

    setFiles(data);
  };

  return (
    <>
      <FileList
        fileList={files}
        setCurrentFile={setCurrentFile}
        currentFile={currentFile}
      />
      <FileInput sendFile={sendFile} />
      { currentFile
        ? (
          <FileEditPanel
            currentFile={currentFile}
            setFiles={setFiles}
            setCurrentFile={setCurrentFile}
          />
        )
        : null }
    </>
  );
}

export default FileStorage;
