import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import './NotFound.css';

/**
 * NotFound
 * --------
 * Rendered for any URL that doesn't match a route in App.tsx (the
 * `path="*"` catch-all route).
 */
function NotFound() {
  usePageTitle('Page Not Found');

  return (
    <div className="container section not-found">
      <span className="eyebrow">404</span>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist — it might have moved.</p>
      <Link to="/" className="btn">
        Back Home
      </Link>
    </div>
  );
}

export default NotFound;
