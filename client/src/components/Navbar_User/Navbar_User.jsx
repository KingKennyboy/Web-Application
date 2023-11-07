import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar_User.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

const Navbar_User = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {user && (
        <div className="navbar">
          <div className="navContainer">
            <div>
              <img src="/gasoline.png" alt="" className="gashandle" />
              <span className="gashandle">{user.email}</span>
            </div>
            <div>
              <Link to="/displayProfile" className="user-link-button">
                <button className="navButton">Profile</button>
              </Link>
              <Link to="/fuelquote" className="user-link-button">
                <button className="navButton">Fuel Quote Form</button>
              </Link>
              <Link to="/fuelquotehistory" className="user-link-button">
                <button className="navButton">Fuel Quote History</button>
              </Link>
              <button className="user-link-button" onClick={handleClick}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
      {!user && (
        <div className="navbar">
          <div className="navContainer">
            <div>
              <Link to='/'>
              <img src="/gasoline.png" alt="" className="gashandle" />
              </Link>
            </div>
            <div className="navItems">
              <Link to="/profile" className="user-link-button">
                <button className="navButton">Profile</button>
              </Link>
              <Link to="/fuelquote" className="user-link-button">
                <button className="navButton">Fuel Quote Form</button>
              </Link>
              <Link to="/fuelquotehistory" className="user-link-button">
                <button className="navButton">Fuel Quote History</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar_User;
