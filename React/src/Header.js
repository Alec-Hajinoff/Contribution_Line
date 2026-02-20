import React from "react";
import { Link } from "react-router-dom";
import blue from "./ContributionLineLogoColoured.png";
import "./Header.css";

function Header() {
  return (
    <div className="container">
      <div className="row">
        <Link to="/">
          <img 
            id="logo" 
            src={blue} 
            alt="A company logo" 
            title="A company logo"
          />
        </Link>
      </div>
      <div className="row-auto">
        <br />
      </div>
    </div>
  );
}

export default Header;

/*
import React from "react";
import blue from "./ContributionLineLogoColoured.png";

import "./Header.css";

function Header() {
  return (
    <div className="container text-center">
      <div className="row">
        <img id="logo" src={blue} alt="A company logo" title="A company logo" />
      </div>
      <div className="row-auto">
        <br />
      </div>
    </div>
  );
}

export default Header;
*/
