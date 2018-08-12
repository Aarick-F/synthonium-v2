import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <h1>&copy; SYNTHONIUM {new Date().getFullYear()}</h1>
      <a href="https://github.com/Aarick-F/synthonium-v2" target="_blank">
        <i class="fab fa-github-square fa-2x"></i>
      </a>
    </div>
  );
}

export default Footer;