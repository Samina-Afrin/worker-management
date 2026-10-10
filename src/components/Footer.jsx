
import React from "react";

const Footer = () => {
  return (
    <footer className="Footer-custom">

      {/* Footer Left */}
      <div className="footer-left">

        <span className="footer-logo">
          <i className="bi bi-asterisk"></i>
          Spark Admin
        </span>

        <span className="footer-separator">|</span>

        <span className="footer-copy">
          &copy; 2026 Made with{" "}
          <i className="bi bi-heart-fill text-danger footer-heart"></i>{" "}
          by{" "}
          <a
            href="https://sparkadminpro.gumroad.com/"
            target="_blank"
            rel="noreferrer"
          >
            Spark Admin
          </a>
          {" "}• Distributed by{" "}
          <a
            href="https://www.themewagon.com/"
            target="_blank"
            rel="noreferrer"
          >
            ThemeWagon
          </a>
        </span>

      </div>

      {/* Footer Right */}
      <div className="footer-right">

        <ul className="footer-links">

          <li>
            <a href="#" className="footer-link">
              Overview
            </a>
          </li>

          <li>
            <a href="#" className="footer-link">
              Statistics
            </a>
          </li>

          <li>
            <a href="#" className="footer-link">
              Help &amp; Documentation
            </a>
          </li>

          <li>
            <a href="#" className="footer-link">
              Status <span className="status-dot"></span>
            </a>
          </li>

        </ul>

      </div>

    </footer>
  );
}

export default Footer;
