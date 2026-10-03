import { useState, type ChangeEvent, type FormEvent } from 'react';
import { band } from '../data/band';
import { usePageTitle } from '../hooks/usePageTitle';
import './Contact.css';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Contact
 * -------
 * Contact info (email + socials) plus a message form, POSTed to the
 * Contact API — a small FastAPI service in its own repo:
 * github.com/adurso0747/Radiant-Gray-Api (see its README for
 * what it does and how to run/deploy it). If `VITE_CONTACT_API_URL`
 * isn't set, or the request fails or times out, this shows an error
 * message with a mailto link as a fallback rather than pretending it
 * worked.
 *
 * There's also a honeypot field (`bot-field`) — a normal-looking field
 * that's hidden from real visitors via the `hidden` attribute on its
 * wrapper, but visible to simple spam bots that fill in every field
 * they find. The API accepts but silently drops submissions where it's
 * filled in (see routers/contact.py in that repo), so the response
 * still looks like success to whatever filled it in.
 */
function Contact() {
  usePageTitle('Contact');

  // One state object holding all three field values, rather than three
  // separate `useState` calls — keeps `handleChange` reusable for every
  // field via its `name` attribute (see the input below).
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser's default full-page form submit

    // Base URL of the Contact API (its own repo — see the file-level
    // comment above) — e.g. 'https://radiant-gray-api.onrender.com'
    // in production, or 'http://localhost:8000' for local dev against
    // `uvicorn` running out of that repo. Unset in an environment with
    // no backend configured yet, which is treated as "can't submit"
    // rather than attempting a doomed request. Read here rather than at
    // module scope so it's re-checked on every submit, not frozen at
    // the value it happened to have when this file was first imported.
    const API_URL = import.meta.env.VITE_CONTACT_API_URL;

    if (!API_URL) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    // The honeypot input is deliberately uncontrolled (no value/onChange
    // props below) — reading it straight from the DOM at submit time
    // the same way a bot filling in every visible-to-it field would
    // leave a value behind, without needing a second piece of React
    // state just for this.
    const botField = new FormData(event.currentTarget).get('bot-field');

    // Guards against a slow/sleeping backend (Render's free tier spins
    // down when idle) hanging the UI in "submitting" indefinitely
    // instead of falling into the error state.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, 'bot-field': botField }),
        signal: controller.signal,
      });
      // fetch() only rejects on a genuine network failure/timeout — a
      // validation error or similar from the API still comes back as a
      // normal, non-throwing response, just with a non-2xx status, so
      // that has to be checked for explicitly too.
      if (!response.ok) throw new Error(`API responded with ${response.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <div className="container section contact-page">
      <span className="eyebrow">Get In Touch</span>
      <h1>Contact</h1>

      <div className="contact-page__grid">
        <div className="contact-page__info">
          <p>
            For booking, press, or just to say hi, reach out at{' '}
            <a href={`mailto:${band.bookingEmail ?? band.email}`}>
              {band.bookingEmail ?? band.email}
            </a>
            .
          </p>
        </div>

        {status === 'success' ? (
          <p className="contact-page__thanks" role="status">
            Thanks for reaching out — we'll get back to you soon.
          </p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Honeypot field — real visitors never see this (the
                wrapping <p> is hidden), but simple spam bots that fill
                in every field they find will trip it, and the API
                quietly drops the submission (see handleSubmit above). */}
            <p hidden>
              <label>
                Leave this field blank
                <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <label className="contact-form__field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="contact-form__field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="contact-form__field">
              <span>Message</span>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>

            {status === 'error' && (
              <p className="contact-page__error" role="alert">
                Something went wrong sending that. In the meantime, email{' '}
                <a href={`mailto:${band.bookingEmail ?? band.email}`}>
                  {band.bookingEmail ?? band.email}
                </a>{' '}
                directly.
              </p>
            )}

            <button type="submit" className="btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
