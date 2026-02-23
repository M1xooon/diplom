import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username, isAdmin } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">Cloud Storage</Link>
        </div>
        
        <nav className="header-nav">
          {username ? (
            <>
              <span className="username">👤 {username}</span>
              <Link to="/my-storage" className="nav-link">My Files</Link>
              {isAdmin && <Link to="/admin" className="nav-link">Admin Panel</Link>}
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="nav-link">Sign In</Link>
              <Link to="/sign-up" className="btn-signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
