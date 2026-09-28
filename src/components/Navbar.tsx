import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { band } from '../data/band';
import MoonMark from './icons/MoonMark';
import './Navbar.css';

interface NavLinkItem {
  to: string;
  label: string;
}

// Every page link shown in the nav. Add/remove/reorder entries here to
// change the site's main navigation — the rest of the component just
// renders whatever is in this list.
const navLinks: NavLinkItem[] = [
  { to: '/', label: 'Home' },
  { to: '/bio', label: 'Bio' },
  { to: '/shows', label: 'Shows' },
  { to: '/music', label: 'Music' },
  { to: '/merch', label: 'Merch' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Navbar
 * ------
 * Site header: band name/logo (links home), main navigation, and a
 * mobile hamburger toggle.
 *
 * `useState` here holds whether the mobile menu is open. Whenever
 * `setIsMenuOpen` is called, React re-renders this component with the
 * new value of `isMenuOpen`, which flips the `is-open` class in the JSX
 * below (styled in Navbar.css) to show/hide the menu.
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="navbar">
      {/* Visually hidden until focused (Tab key) — lets keyboard users
          jump straight to the page content, skipping repeated nav links. */}
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={closeMenu}>
          <MoonMark className="navbar__brand-icon" />
          {band.name}
        </NavLink>

        {/* Hamburger button — only visible on small screens (see CSS).
            aria-expanded tells screen readers whether the menu is open. */}
        <button
          type="button"
          className="navbar__toggle"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
        </button>

        <nav
          className={`navbar__nav ${isMenuOpen ? 'is-open' : ''}`}
          aria-label="Main"
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                {/* NavLink (vs. plain <a>/Link) automatically adds an
                    "active" class when its `to` matches the current URL,
                    which Navbar.css uses to underline the current page. */}
                <NavLink
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? 'navbar__link is-active' : 'navbar__link'
                  }
                  // Only match "/" exactly, so Home isn't marked active
                  // on every other page too.
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
