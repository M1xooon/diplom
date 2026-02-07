import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './router';
import ContextProvider from './GlobalState/provider';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
);
