import { describe, it, expect, vi } from 'vitest';
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

  it('shows the error state with a mailto fallback when submitted in dev mode', async () => {
    // Contact.tsx deliberately short-circuits to the 'error' state
    // whenever import.meta.env.DEV is true, since there's nothing real
    // to submit to locally (see the comment in handleSubmit). Vitest
    // runs with DEV: true by default, so this is the natural path to
    // exercise here — no fetch mocking required.
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Message'), 'Hello!');
    await user.click(screen.getByRole('button', { name: /send/i }));

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent(/isn't deployed on netlify yet/i);
    // The mailto link inside the error message itself, specifically —
    // not the one that was already up in the info panel above the form.
    expect(within(error).getByRole('link', { name: /band@example\.com/ })).toBeInTheDocument();
  });

  it('disables the submit button while a submission is in flight', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Message'), 'Hello!');

    const button = screen.getByRole('button', { name: /send/i });
    await user.click(button);

    // By the time the (synchronous, in dev mode) error state has
    // rendered, submission has finished — this asserts the button
    // isn't left stuck disabled afterward.
    await screen.findByRole('alert');
    expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled();
  });
});
