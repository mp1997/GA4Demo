import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navbar, Main, Product } from "../components";
import { gtag } from "ga-gtag";
import { useNavigate } from "react-router-dom";

function Home() {
  const { product } = useSelector((state) => state.productReducer);
  const state = useSelector((state) => state.handleCart);
  const sessionTimeout = 2 * 60 * 1000; // 2 minutes in milliseconds
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("loggedIn") === "true"
  );
  
  const eventTimestamp = Date.now(); // or a specific timestamp
  const firstName = sessionStorage.getItem("userFirstName");
  const lastName = sessionStorage.getItem("userLastName");
  const userID = sessionStorage.getItem("userID");
  const userEmail = sessionStorage.getItem("userEmail");
  let totalItems =0;
  const sessionLogin=sessionStorage.getItem("sessionStart");
  state.map((item) => {
    return (totalItems += item.qty);
  });

  const navigate = useNavigate();

  const sendCustomEvent = () => {
    gtag("event", "custom_event", {
      event_timestamp: eventTimestamp,
      item_category: product?.category,
      item_id: product?.id,
      item_price: product?.price,
      item_name: product?.title,
      total_item_quantity: totalItems,
      first_name: firstName,
      last_name: lastName,
      pseudo_user_id: userID,
      user_email: userEmail,
      is_active_user: "True",
      user_first_touch_timestamp: sessionLogin,
      debug_mode: true,
    });

    console.log("Custom event triggered with timestamp:");
  };

  useEffect(() => {
    if (isAuthenticated) {
      sendCustomEvent();
    
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      const currentTime = new Date().toISOString();
      sessionStorage.setItem("lastActivity", currentTime); // Update last activity time
      timeout = setTimeout(() => {
        handleLogout();
      }, sessionTimeout);
    };

    // Set timeout on initial load
    resetTimeout();

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);

    return () => {
      // Cleanup on component unmount
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
    };
  }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userFirstName");
    sessionStorage.removeItem("userLastName");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("sessionStart");
    setIsAuthenticated(false);
    navigate("/");
    alert("Session expired due to inactivity. Please log in again.");
  };

  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      // Only for local development
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "custom_event", // Your event name
        event_category: "debug_mode", // Category (optional)
        event_timestamp: Date.now(), // Custom parameter for event_timestamp
        debug_mode: true,
      });
    }
    sendCustomEvent();
  }, [product]);

  return (
    <>
      <Navbar />
      <Main />
      <Product />
    </>
  );
}

export default Home;
