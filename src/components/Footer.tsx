import { band } from '../data/band';
import SocialLinks from './SocialLinks';
import './Footer.css';

/**
 * Footer
 * ------
 * Site footer shown on every page (rendered once, from App.tsx).
 * Repeats the social links and a copyright line.
 */
function Footer() {
  // `getFullYear()` keeps the copyright year current automatically —
  // no need to remember to update it each year.
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <SocialLinks />
        <p className="footer__meta">
          © {year} {band.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
