import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.tsx';

// Mounts the whole React app into <div id="root"> in index.html.
// StrictMode is a development-only helper that highlights potential
// problems (e.g. components with side effects that aren't safe to run
// twice) — it has no effect on the production build.
//
// The `!` (non-null assertion) tells TypeScript "trust me, this exists"
// — index.html always has a <div id="root">, so getElementById can't
// actually return null here, but TypeScript can't know that on its own.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
