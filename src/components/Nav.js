import { useEffect, useState } from 'react';
import '../css/Nav.css';

export default function Nav() {
  const [showNav, handleShowNav] = useState(false);

  const transitionNav = () => {
    if (window.scrollY > 100) {
      handleShowNav(true);
    } else {
      handleShowNav(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', transitionNav);
    return () => window.removeEventListener('scroll', transitionNav);
  }, []);

  return (
    <div className={`nav ${showNav && 'nav__black'}`}>
      <div className="nav__wrapper">
        <div className="nav__content">
          <div className="nav__logo">
            <span className={`logo__nasa ${showNav && 'nasa__scroll'}`}>
              NASA
            </span>
            <span className={`logo__cam ${showNav && 'cam__scroll'}`}>
              .CAM
            </span>
          </div>
          <div className="nav__menu">
            <span className="menu__btn"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
