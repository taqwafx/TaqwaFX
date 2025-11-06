import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <div className="flex items-center gap-2">
        <img
          src="../../logo.png"
          alt="RB Invest"
          className="h-[60px] overflow-hidden max-w-md rounded-lg scale-[1.2]"
        />
      </div>
    </Link>
  );
};

export default Logo;
