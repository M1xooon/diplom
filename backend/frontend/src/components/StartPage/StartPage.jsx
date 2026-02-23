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
      <p className="subtitle">Store, manage, and share your files securely</p>
      
      {username ? (
        <div className="start-actions">
          <p className="welcome-text">Welcome back, {username}!</p>
          <Link to="/my-storage" className="btn-primary">Go to My Files</Link>
        </div>
      ) : (
        <div className="start-actions">
          <Link to="/sign-in" className="btn-primary">Sign In</Link>
          <Link to="/sign-up" className="btn-secondary">Sign Up</Link>
        </div>
      )}
    </div>
  );
}
