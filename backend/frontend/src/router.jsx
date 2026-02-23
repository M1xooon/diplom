/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { initializeCsrf, fetchUserData } from './redux/slices/authSlice';
import StartPage from './components/StartPage/StartPage';
import Header from './components/Header/Header';
import SignUpForm from './components/AuthForms/SignUpForm';
import SignInForm from './components/AuthForms/SignInForm';
import AdminPanel from './components/AdminPanel/AdminPanel';
import FileStorage from './components/FileStorage/FileStorage';
import Page404 from './components/Page404/Page404';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeCsrf());
    dispatch(fetchUserData());
  }, [dispatch]);
  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/my-storage" element={<FileStorage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
