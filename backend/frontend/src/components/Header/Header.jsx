import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Username from './Username';
import Context from '../../GlobalState/state';
import './Header.css';
import UserStorage from './UserStorage';

function Header() {
  const { sessionId, username, currentStorageUser } = useContext(Context);

  return (
    <section className="header">
      <div
        className="header--logo"
      >
        <Link
          to="/"
        >
          bookingCloud
        </Link>
      </div>
      { currentStorageUser
        ? <UserStorage storageUserId={currentStorageUser} />
        : null }
      <div className="header--menu-container">
        {
        !sessionId
          ? (
            <>
              <div
                className="header--menu-container--item"
              >
                <Link
                  to="/sign-in"
                >
                  Sign in
                </Link>
              </div>
              <div
                className="header--menu-container--item"
              >
                <Link
                  to="/sign-up"
                >
                  Sign up
                </Link>
              </div>
            </>
          )
          : <Username username={username} />
      }

      </div>
    </section>
  );
}

export default Header;
