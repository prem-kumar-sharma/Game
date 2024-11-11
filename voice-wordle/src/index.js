import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Ensures global styles are loaded first
import './App.css';    // Specific component styles
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);