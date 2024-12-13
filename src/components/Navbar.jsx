import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import useGAEventTracker from "../hooks/useGAEventsTracker";
import toast from "react-hot-toast";

const Navbar = () => {
  const eventTracker = useGAEventTracker("External Links");
  const state = useSelector((state) => state.handleCart);
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("loggedIn") === "true"
  );

  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userFirstName");
    sessionStorage.removeItem("userLastName");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("sessionStart");
    setIsAuthenticated(false);
    toast.success(`You have successfully logged out`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
        <NavLink
          className="navbar-brand fw-bold fs-4 px-2"
          to="/"
          onClick={(e) => eventTracker("Home Page", "/Home")}
        >
          {" "}
          React Ecommerce
        </NavLink>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
                onClick={(e) => eventTracker("Home Page", "/Home")}
              >
                Home{" "}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/product"
                onClick={(e) => eventTracker("Product Page", "/product")}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/about"
                onClick={(e) => eventTracker("About Page", "/about")}
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/contact"
                onClick={(e) => eventTracker("Contact Page", "/contact")}
              >
                Contact
              </NavLink>
            </li>
          </ul>
          <div className="buttons text-center">
            {isAuthenticated && (
              <NavLink
                to="/"
                className="btn btn-outline-dark m-2"
                onClick={handleLogout}
              >
                Logout
                <i className="fa fa-sign-out-alt ml-1"></i>
              </NavLink>
            )}
            {!isAuthenticated && (
              <NavLink
                to="/login"
                className="btn btn-outline-dark m-2"
                onClick={(e) => eventTracker("Login Page", "/login")}
              >
                <i className="fa fa-sign-in-alt mr-1"></i> Login
              </NavLink>
            )}
            {/* <NavLink
              to="/register"
              className="btn btn-outline-dark m-2"
              onClick={(e) => eventTracker("Register Page", "/register")}
            >
              <i className="fa fa-user-plus mr-1"></i> Register
            </NavLink> */}
            <NavLink
              to="/cart"
              className="btn btn-outline-dark m-2"
              onClick={(e) => eventTracker("Cart Page", "/cart")}
            >
              <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}){" "}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
