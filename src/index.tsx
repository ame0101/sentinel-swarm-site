// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  // If running locally in development, you can set the basename to '/ame0101/sentinel_swarm.io'
  root.render(
    <React.StrictMode>
      <BrowserRouter basename="/ame0101/sentinel_swarm.io">
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
