import { useEffect } from "react";
import { Navbar, Main, Product } from "../components";
import { gtag } from 'ga-gtag';

function Home() {
  const sendCustomEvent = () => {
    const eventTimestamp = Date.now(); // or a specific timestamp

    gtag('event', 'custom_event', {
      event_timestamp: Date.now(), // Add this custom parameter
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
