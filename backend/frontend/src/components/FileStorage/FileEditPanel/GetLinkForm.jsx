import React from 'react';
import PropTypes from 'prop-types';
import '../../formStyle/Form.css';
import img from '../../formStyle/icons8-close.svg';

function GetLinkForm({ link, setForm }) {
  const onCloseHandler = () => {
    setForm();
  };

  return (
    <form className="form">
      <h2 className="form--title">Download link</h2>
      <input type="text" readOnly value={link} />
      <button className="close" onClick={onCloseHandler} aria-label="Close" type="button"><img src={img} alt="close" /></button>
    </form>
  );
}

GetLinkForm.propTypes = {
  link: PropTypes.string.isRequired,
  setForm: PropTypes.func.isRequired,
};

export default GetLinkForm;
