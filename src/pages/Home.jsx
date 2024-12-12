import { useEffect } from "react";
import { Navbar, Main, Product } from "../components";
import { gtag } from 'ga-gtag';

function Home() {
  const sendCustomEvent = () => {
    const eventTimestamp = Date.now(); // or a specific timestamp

    gtag('event', 'custom_event', {
      event_timestamp: Date.now(), // Add this custom parameter
      debug_mode: true,
    });

    console.log("Custom event triggered with timestamp:", eventTimestamp);
  };
  useEffect(() => {
    if (window.location.hostname != 'localhost') { // Only for local development
      window.dataLayer = window.dataLayer || [];
     window.dataLayer.push({
      'event': 'custom_event',  // Your event name
      'event_category': 'debug_mode', // Category (optional)
      'event_timestamp': Date.now(), // Custom parameter for event_timestamp
      'debug_mode':true,
    })
  }
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
