/* eslint-disable linebreak-style */
import React from 'react';
import {
  BrowserRouter as Router, Route, Routes,
} from 'react-router-dom';
import StartPage from './components/StartPage/StartPage';
import Header from './components/Header/Header';
import SignUpForm from './components/AuthForms/SignUpForm';
import SignInForm from './components/AuthForms/SignInForm';
import AdminPanel from './components/AdminPanel/AdminPanel';
import FileStorage from './components/FileStorage/FileStorage';
import Page404 from './components/Page404/Page404';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/my-storage" element={<FileStorage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
