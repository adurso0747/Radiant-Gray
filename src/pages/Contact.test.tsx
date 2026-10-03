import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';

vi.mock('../data/band', () => ({
  band: {
    name: 'Test Band',
    tagline: 'Testing, testing',
    location: 'Nowhere',
    email: 'band@example.com',
    bookingEmail: null,
  },
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

async function fillOutForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Jane');
  await user.type(screen.getByLabelText('Email'), 'jane@example.com');
  await user.type(screen.getByLabelText('Message'), 'Hello!');
}

describe('Contact', () => {
  it('shows a mailto link using the configured email', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: /band@example\.com/ })).toHaveAttribute(
      'href',
      'mailto:band@example.com',
    );
  });

  it('lets you type into the form fields', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText('Name');
    await user.type(nameInput, 'Jane');
    expect(nameInput).toHaveValue('Jane');
  });

  it('shows the error state with a mailto fallback when no API URL is configured', async () => {
    // Vitest loads the repo's .env.local the same way Vite's dev/build
    // does, so this stubs it back to empty explicitly rather than
    // relying on it being unset — Contact.tsx treats that as "can't
    // submit" and skips straight to the error state without attempting
    // a fetch.
    vi.stubEnv('VITE_CONTACT_API_URL', '');

    const user = userEvent.setup();
    render(<Contact />);

    await fillOutForm(user);
    await user.click(screen.getByRole('button', { name: /send/i }));

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent(/something went wrong/i);
    // The mailto link inside the error message itself, specifically —
    // not the one that was already up in the info panel above the form.
    expect(within(error).getByRole('link', { name: /band@example\.com/ })).toBeInTheDocument();
  });

  it('disables the submit button while a submission is in flight, and re-enables it after', async () => {
    vi.stubEnv('VITE_CONTACT_API_URL', '');

    const user = userEvent.setup();
    render(<Contact />);

    await fillOutForm(user);

    const button = screen.getByRole('button', { name: /send/i });
    await user.click(button);

    await screen.findByRole('alert');
    expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled();
  });

  it('shows a thank-you message when the API accepts the submission', async () => {
    vi.stubEnv('VITE_CONTACT_API_URL', 'http://localhost:8000');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    const user = userEvent.setup();
    render(<Contact />);

    await fillOutForm(user);
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/thanks for reaching out/i);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/contact',
      expect.objectContaining({
        method: 'POST',
        // The honeypot field is read from the uncontrolled DOM input,
        // not React state — an untouched text input reports '' via
        // FormData, matching what a real visitor (who never sees or
        // fills it) would send.
        body: JSON.stringify({
          name: 'Jane',
          email: 'jane@example.com',
          message: 'Hello!',
          'bot-field': '',
        }),
      }),
    );
  });

  it('shows the error state when the API responds with a non-2xx status', async () => {
    vi.stubEnv('VITE_CONTACT_API_URL', 'http://localhost:8000');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    const user = userEvent.setup();
    render(<Contact />);

    await fillOutForm(user);
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);
  });
});
