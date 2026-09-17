import { bio } from '../data/band';
import { members } from '../data/members';
import { usePageTitle } from '../hooks/usePageTitle';
import './Bio.css';

/**
 * Bio
 * ---
 * Band story + member roster.
 *
 * The portrait photo, bio paragraphs, and member roster (including each
 * member's photo) all come from data — `bio` from `src/data/band.js`
 * (backed by `src/content/site.json`) and `members` from
 * `src/data/members.js` (backed by `src/content/members.json`). Edit
 * those files, or use the admin panel (see README.md → "Managing
 * content with the admin panel"), rather than editing this file.
 */
function Bio() {
  usePageTitle('Bio');

  return (
    <div className="container section bio-page">
      <span className="eyebrow">About</span>
      <h1>The Story So Far</h1>

      <img className="bio-page__portrait" src={bio.portraitImage} alt={bio.portraitImageAlt} />

      <div className="bio-page__copy">
        {bio.paragraphs.map((paragraph, index) => (
          // Array index is fine as a key here — this list is only ever
          // read from content, never reordered/added-to at runtime.
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <h2 className="bio-page__members-heading">The Band</h2>
      <ul className="bio-page__members">
        {members.map((member) => (
          <li key={member.id} className="member-card">
            <img className="member-card__photo" src={member.photo} alt={member.photoAlt} />
            <h3>{member.name}</h3>
            <p className="member-card__instrument">{member.instrument}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bio;
