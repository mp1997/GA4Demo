import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navbar, Main, Product } from "../components";
import { gtag } from "ga-gtag";

function Home() {
  const {product} = useSelector((state) => state.productReducer);

  const sendCustomEvent = () => {
    const eventTimestamp = Date.now(); // or a specific timestamp

    gtag("event", "custom_event", {
      event_timestamp: Date.now(), // Add this custom parameter
      item_category: product?.category,
      item_id: product?.id,
      price: product?.price,
      // quantity: addedQuantity,
      // total_item_quantity: totalItemsInCart,
      item_name: product?.title,
      transaction_id: "abc1056",
      debug_mode: true,
    });

    console.log(
      "Custom event triggered with timestamp:",
      eventTimestamp,
      product
    );
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
  },[product]);

  return (
    <>
      <Navbar />
      <Main />
      <Product />
    </>
  );
}

export default Home;
