/**
 * setup.ts
 * --------
 * Runs once before every test file (wired up via `test.setupFiles` in
 * vite.config.ts).
 *
 * Importing this registers jest-dom's matchers (`toBeInTheDocument()`,
 * `toHaveAttribute()`, etc.) onto Vitest's `expect`, and does automatic
 * cleanup of whatever React Testing Library rendered into the fake DOM
 * after each test, so one test's leftover markup can't affect the next.
 */
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});
