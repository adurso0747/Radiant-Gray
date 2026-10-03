/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Base URL of the Contact API (its own repo — see
  // src/pages/Contact.tsx) — e.g. 'http://localhost:8000' locally, or
  // the deployed Render URL in production. Unset means the Contact
  // page can't submit yet.
  readonly VITE_CONTACT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
