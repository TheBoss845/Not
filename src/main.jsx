import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { NotflixProvider } from './context/NotflixContext.jsx';
import './styles/global.css';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotflixProvider>
      <App />
    </NotflixProvider>
  </React.StrictMode>,
);
