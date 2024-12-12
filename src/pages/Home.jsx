import { useEffect } from "react";
import { Navbar, Main, Product } from "../components";

function Home() {
  const sendCustomEvent = () => {
    const eventTimestamp = Date.now(); // or a specific timestamp

    window.gtag("event", "custom_event", {
      event_timestamp: eventTimestamp, // Matches the parameter name in GA4 custom dimension
      additional_param1: "value1",
      additional_param2: "value2",
      debug_mode: true,
    });

    console.log("Custom event triggered with timestamp:", eventTimestamp);
  };

  useEffect(() => {
    sendCustomEvent();
  }, []);

  return (
    <>
      <Navbar />
      <Main />
      <Product />
    </>
  );
}

export default Home;
