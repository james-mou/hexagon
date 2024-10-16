import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav>
        <ul className="flex space-x-4 list-none">
          <li>
            <Link
              to="/host"
              className={`bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded transition duration-300 ${
                location.pathname === "/host" ? "font-bold" : ""
              }`}
            >
              Host
            </Link>
          </li>
          <li>
            <Link
              to="/resource"
              className={`bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded transition duration-300 ${
                location.pathname === "/resource" ? "font-bold" : ""
              }`}
            >
              Resource
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
