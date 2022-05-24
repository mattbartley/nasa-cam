import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab } from "@mui/material/";
import "../css/ScrollToTop.css";

const ScrollToTop = () => {
  const [showTopButton, setShowTopButton] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`scroll__button ${showTopButton ? "showBtn" : "hideBtn"}`}>
      <Fab
        className="scroll__button"
        sx={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
        }}
        color="secondary"
        size="small"
        aria-label="scroll back to top"
        onClick={goToTop}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </div>
  );
};
export default ScrollToTop;
