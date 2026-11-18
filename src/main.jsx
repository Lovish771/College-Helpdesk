import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Handle dynamic module import failures across new deployments
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite preload error detected: reloading page for newest deployment assets...', event);
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
