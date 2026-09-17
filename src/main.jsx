import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';

// Mounts the whole React app into <div id="root"> in index.html.
// StrictMode is a development-only helper that highlights potential
// problems (e.g. components with side effects that aren't safe to run
// twice) — it has no effect on the production build.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
