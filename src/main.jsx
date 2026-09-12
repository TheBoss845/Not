import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {NotflixProvider} from './context/NotflixContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/global.css';
import './styles/complete.css';

if('serviceWorker' in navigator&&import.meta.env.PROD){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}
createRoot(document.getElementById('root')).render(<React.StrictMode><ErrorBoundary><NotflixProvider><App/></NotflixProvider></ErrorBoundary></React.StrictMode>);
