import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { patchFile } from '../../../api/requests';
import state from '../../../GlobalState/state';
import '../../formStyle/Form.css';
import img from '../../formStyle/icons8-close.svg';

function ChangeCommentForm({ currentFile, setForm, setFiles }) {
  const newComment = useRef();
  const { currentStorageUser } = useContext(state);

  useEffect(() => {
    newComment.current.value = currentFile.comment;
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const patchData = currentFile;
    patchData.comment = newComment.current.value;

    let response;

    if (currentStorageUser) {
      response = await patchFile(patchData, currentStorageUser);
    } else {
      response = await patchFile(patchData);
    }

    const data = await response.json();

    if (response.ok) {
      setFiles(data);
      setForm();
    }
  };

  const onCloseHandler = () => {
    setForm();
  };

  return (
    <form className="form" onSubmit={onSubmitHandler}>
      <h2 className="form-title">Change comment</h2>
      <textarea type="text" placeholder="New comment" ref={newComment} />
      <input type="submit" value="OK" required />
      <button
        className="close"
        onClick={onCloseHandler}
        onKeyDown={onCloseHandler}
        type="button"
        aria-label="Close"
      >
        <img
          src={img}
          alt="Close"
        />
      </button>
    </form>
  );
}

ChangeCommentForm.propTypes = {
  currentFile: PropTypes.instanceOf(Object).isRequired,
  setForm: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
};

export default ChangeCommentForm;
