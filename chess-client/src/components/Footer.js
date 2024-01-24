/*
Copyright 2024 PRADUMN

Chess With Friends is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Chess With Friends is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Chess With Friends. If not, see <https://www.gnu.org/licenses/>.
*/

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
