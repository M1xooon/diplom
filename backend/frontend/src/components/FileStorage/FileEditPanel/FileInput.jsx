import PropTypes from 'prop-types';
import React, { useRef, useState, useContext } from 'react';
import Context from '../../../GlobalState/state';
import './FileInput.css';

function FileInput({ sendFile }) {
  const file = useRef();
  const [fileChosen, setFileChosen] = useState();
  const { currentStorageUser } = useContext(Context);

  const onChangeHandler = () => {
    setFileChosen(file.current.files);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    sendFile(fileChosen.item(0));
    setFileChosen();
    file.current.value = '';
  };

  return (
    !currentStorageUser
      ? (
        <form className="file-input-form" onSubmit={onSubmitHandler}>
          <div className="input-wrapper button">
            <label htmlFor="input_file">
              Add file
              <input
                type="file"
                id="input_file"
                ref={file}
                onChange={onChangeHandler}
              />
            </label>
            { fileChosen && fileChosen.length
              ? <span className="preview">{ fileChosen.item(0).name }</span>
              : null }
          </div>
          { fileChosen && fileChosen.length
            ? <input type="submit" value="send" />
            : null }
        </form>
      )
      : null
  );
}

FileInput.propTypes = {
  sendFile: PropTypes.func.isRequired,
};

export default FileInput;
