import { useEffect } from "react";
import { Navbar, Main, Product, Footer } from "../components";

function Home() {
  const sendCustomEvent = () => {
    const eventTimestamp = Date.now(); // or a specific timestamp

    window.gtag("event", "custom_event", {
      event_timestamp: eventTimestamp, // Matches the parameter name in GA4 custom dimension
      additional_param1: "value1",
      additional_param2: "value2",
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
      <Footer />
    </>
  );
}

export default Home;
