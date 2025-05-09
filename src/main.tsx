
import { createRoot } from 'react-dom/client'
import React from 'react' // Add explicit React import
import App from './App.tsx'
import './index.css'

// Create root with React.StrictMode wrapper
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
