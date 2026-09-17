import { useState } from 'react';
import { band } from '../data/band';
import { usePageTitle } from '../hooks/usePageTitle';
import './Contact.css';

/**
 * Contact
 * -------
 * Contact info (email + socials) plus a message form, wired up to
 * Netlify Forms — submitting actually sends the band an email, no
 * backend code of our own required. This only works once the site is
 * deployed on Netlify (see README.md → "Deployment"); in local dev, or
 * if it's ever deployed somewhere else instead, submitting shows an
 * error message with the mailto link as a fallback rather than
 * pretending it worked.
 *
 * HOW THIS WORKS (React + Netlify Forms is a little unusual):
 * Netlify normally detects forms by scanning the plain HTML it deploys
 * at build time. That doesn't work here, because this form only exists
 * once React renders it in the browser — too late for Netlify's build
 * to see it. The fix (Netlify's own documented workaround for
 * JS-rendered forms) is a hidden, plain-HTML copy of this exact form in
 * `index.html`, which is what Netlify actually reads to register the
 * form and its fields. If you ever add/remove/rename a field below,
 * update that hidden copy in `index.html` to match, or the new field
 * won't be captured.
 *
 * Once Netlify knows about the form, submitting it normally would do a
 * full-page POST — but since this is a single-page app, we instead
 * `fetch()` POST the data ourselves (`handleSubmit` below) and just
 * swap in a thank-you message, no page reload.
 *
 * There's also a honeypot field (`bot-field`) — a normal-looking field
 * that's hidden from real visitors via the `hidden` attribute on its
 * wrapper, but visible to simple spam bots that fill in every field
 * they find. Netlify silently discards submissions where it's filled
 * in. See Netlify's docs on form spam filtering for more options
 * (reCAPTCHA, Akismet) if spam becomes a problem.
 *
 * First-submission note: Netlify only starts accepting a form's
 * submissions after it's seen at least one deploy with that form
 * present — so this won't work until *after* you've deployed once with
 * this file in place.
 */
function Contact() {
  usePageTitle('Contact');

  // One state object holding all three field values, rather than three
  // separate `useState` calls — keeps `handleChange` reusable for every
  // field via its `name` attribute (see the input below).
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Netlify Forms expects a standard URL-encoded form submission (the
  // same format a plain HTML <form> would send), not JSON — this turns
  // { name: 'value' } into 'name=value&...' with everything properly
  // escaped.
  function encodeForNetlify(data) {
    return Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser's default full-page form submit
    setStatus('submitting');

    // In local dev (`npm run dev`), there's no Netlify behind this URL
    // to actually receive the submission — but Vite's dev server still
    // responds with a 200 for the POST (it just serves the app's normal
    // fallback page), so `fetch` would resolve successfully and this
    // would silently claim success without truly submitting anywhere.
    // Skip straight to the explanatory message instead of pretending it
    // worked. `import.meta.env.DEV` is Vite's built-in flag for this —
    // it's `false` in the production build, so real deploys still go
    // through the actual fetch below.
    if (import.meta.env.DEV) {
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // 'form-name' tells Netlify which registered form this
        // submission belongs to — has to match the `name="contact"` on
        // both this form and its hidden twin in index.html.
        body: encodeForNetlify({ 'form-name': 'contact', ...formData }),
      });
      // fetch() only rejects on a genuine network failure — a "form not
      // found" or similar from Netlify still comes back as a normal,
      // non-throwing response, just with a non-2xx status, so that has
      // to be checked for explicitly too.
      if (!response.ok) throw new Error(`Netlify responded with ${response.status}`);
      setStatus('success');
    } catch {
      // Most likely cause if this ever triggers on the real deployed
      // site: the form hasn't been registered with Netlify yet (only
      // happens after a deploy that includes this page — see the
      // "First-submission note" above) or the site isn't actually
      // hosted on Netlify. See the comment at the top of this file.
      setStatus('error');
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
          <form
            name="contact"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            className="contact-form"
            onSubmit={handleSubmit}
          >
            {/* Honeypot field — real visitors never see this (the
                wrapping <p> is hidden), but simple spam bots that fill
                in every field they find will trip it, and Netlify
                quietly drops the submission. */}
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
                Something went wrong sending that — it happens if this site isn't deployed on
                Netlify yet. In the meantime, email{' '}
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
