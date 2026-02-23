import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './StartPage.css';
import logo from './StartPage.svg';

export default function StartPage() {
  const { username } = useSelector((state) => state.auth);

  return (
    <div className="start-page">
      <img src={logo} alt="Cloud Storage" className="logo" />
      <h1>Welcome to Cloud Storage</h1>
      {username ? (
        <Link to="/storage">Go to Storage</Link>
      ) : (
        <div>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </div>
  );
}
