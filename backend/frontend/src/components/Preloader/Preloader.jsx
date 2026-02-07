import React from 'react';
import preloader from './preloader.gif';
import './Preloader.css';

function Preloader() {
  return (
    <img className="preloader" src={preloader} alt="preloader" />
  );
}

export default Preloader;
