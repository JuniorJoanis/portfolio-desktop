import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * React Router keeps the current scroll position across client-side navigations,
 * so clicking a link near the bottom of a page (e.g. the case study cards on the
 * consultancy page) drops you into the middle of the next one. Reset to the top
 * on every push/replace, and let the browser restore the position on back/forward.
 */
const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;

    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, search, hash, navigationType]);

  return null;
};

export default ScrollToTop;
