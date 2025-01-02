import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import toast from "react-hot-toast";
import { gtag } from "ga-gtag";
import users from "../users.json"; // Import the mock user credentials

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    sendCustomEvent();
  }, [loggedIn]);

  const sendCustomEvent = () => {
    if (loggedIn) {
      const firstName = sessionStorage.getItem("userFirstName");
      const lastName = sessionStorage.getItem("userLastName");
      const userID = sessionStorage.getItem("userID");
      const sessionLogin = sessionStorage.getItem("sessionStart");
      gtag("event", "signin_info", {
        pseudo_user_id: userID,
        first_name: firstName,
        last_name: lastName,
        user_first_touch_timestamp: sessionLogin,
        is_active_user: "True",
        user_timestamp: Date.now(),
        debug_mode: true,
      });
    }
  };

  async function sendEvent(eventType, eventPayload) {
    try {
      const response = await fetch("http://localhost:3000/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventType, ...eventPayload }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();
      console.log(`${eventType} event sent successfully:`, data);
    } catch (error) {
      console.error(`Error sending ${eventType} event:`, error);
    }
  }

  // Add To Cart Event
  async function sendSigninEvent() {
    const firstName = sessionStorage.getItem("userFirstName");
    const lastName = sessionStorage.getItem("userLastName");
    const userID = sessionStorage.getItem("userID");
    const sessionLogin = sessionStorage.getItem("sessionStart");
    const eventPayload = {
      user: {
        pseudo_user_id: userID,
        first_name: firstName,
        last_name: lastName,
        is_active_user: "True",
        user_first_touch_timestamp: sessionLogin,
      },
    };
    await sendEvent("signin_info", eventPayload);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the credentials match any user in the JSON file
    const user = users.find((u) => u.email === email && u.idpass === password);

    if (user) {
      const currentTime = Date.now();
      setLoggedIn(true);
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("userEmail", user?.email);
      sessionStorage.setItem("userFirstName", user?.firstname);
      sessionStorage.setItem("userLastName", user?.lastname);
      sessionStorage.setItem("userID", user?.pseudo_user_id);
      sessionStorage.setItem("sessionStart", currentTime); // Save login time
      // Navigate to home page or dashboard
      navigate("/");
      toast.success(`Welcome, ${user?.firstname}`);
      sendSigninEvent();
    } else {
      // Show error message
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-danger my-2">{error}</div>}
              {/* <div className="my-3">
                <p>
                  New Here?{" "}
                  <Link
                    to="/register"
                    className="text-decoration-underline text-info"
                  >
                    Register
                  </Link>
                </p>
              </div> */}
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
