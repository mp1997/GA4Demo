import { useEffect } from "react";
import { Navbar, Main, Product, Footer } from "../components";

function Home() {
  const sendCustomEvent = () => {
    const eventTimestamp = Date.now(); // Capture current timestamp

    window.gtag("event", "event_timestamp", {
      event_timestamp: eventTimestamp,
      additional_param1: "value1",
      additional_param2: "value2",
    });

    console.log("Custom event triggered with timestamp:", eventTimestamp);
  };

  useEffect(()=>
    {
      sendCustomEvent();
    },[]);

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
