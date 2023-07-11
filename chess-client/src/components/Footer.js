import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div>
      <div className="socials container-fluid">
        <a href="https://www.linkedin.com/in/pradumn-prasad/">
          <i className="fa-brands fa-linkedin-in fa-xl social-icon "></i>
        </a>
        <a href="https://twitter.com/PradumnPrasad7">
          <i className="fa-brands fa-twitter fa-xl social-icon "></i>
        </a>

        <a href="mailto:pradumnprasad883@gmail.com">
          <i className="fa-solid fa-envelope fa-xl social-icon "></i>
        </a>
        <a href="https://example.com">
          <i className="fa-brands fa-discord fa-xl social-icon "></i>
        </a>
      </div>
      <div className="copyright">
        Chess with Friends &copy; {currentYear} Pradumn
      </div>
    </div>
  );
}

export default Footer;
