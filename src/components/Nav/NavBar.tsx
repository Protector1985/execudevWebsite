import React, { useState } from "react";
import css from "./styles/styles.module.css";
import useWidth from "@/hooks/useWidth";
import { GiHamburgerMenu } from "react-icons/gi";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  let touchStartX = 0;
  let touchEndX = 0;
  const width = useWidth();

  const handleTouchStart = (e: any) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e: any) => {
    touchEndX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 75) {
      setIsOpen(false); // Swipe left to close
    }
    if (touchEndX - touchStartX > 75) {
      setIsOpen(true); // Swipe right to open
    }
  };

  return (
    <div className={css.wrapper}>
      {width! < 768 ? (
        <>
          <GiHamburgerMenu
            onClick={() => setIsOpen(!isOpen)}
            className={css.hamburgerMenu}
          />
          <div
            className={isOpen ? css.slideIn : css.slideInClosed}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={css.menuMobileSub}>
              <a className={css.menuItemMobile}>BLOG</a>
              <a className={css.menuItemMobile}>ABOUT</a>
              <a className={css.menuItemMobile}>CONTACT</a>
            </div>
          </div>
        </>
      ) : (
        <>
          <a className={css.menuItem}>BLOG</a>
          <a className={css.menuItem}>ABOUT</a>
          <a className={css.menuItem}>CONTACT</a>
        </>
      )}
    </div>
  );
};

export default NavBar;
