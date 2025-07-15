import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <footer id="footer" className="footer">
      <div className="copyright">
        &copy; Copyright 2024. All Rights Reserved
      </div>
      <div className="credits">
        <strong>
          <i>
            Project Based Learning ||{" "}
            <Link to="https://github.com/Rmdsketch">DutaKu Sleman </Link>
            || TECNOVATION EXPO 2024
          </i>
        </strong>
      </div>

      <Link
        to="#"
        onClick={scrollToTop}
        className={`back-to-top d-flex align-items-center justify-content-center ${
          isVisible ? "active" : ""
        }`}
      >
        <i className="bi bi-arrow-up-short"></i>
      </Link>
    </footer>
  );
};

export default Footer;