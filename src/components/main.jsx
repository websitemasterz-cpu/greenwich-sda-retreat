// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Web Vitals monitoring for production
if (import.meta.env.PROD) {
  // Report web vitals to analytics
  const reportWebVitals = (metric) => {
    console.log(metric);
    // Send to analytics endpoint if needed
    // analytics.track(metric.name, metric.value);
  };
  
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  }).catch(() => {
    // Web vitals not available
  });
}
