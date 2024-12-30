import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch, useSelector } from "react-redux";
import { addCart, setProductList, viewProduct } from "../redux/action";

import { Navbar } from "../components";
import useGAEventTracker from "../hooks/useGAEventsTracker";
import { gtag } from "ga-gtag";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const eventTracker = useGAEventTracker("External Links");
  const state = useSelector((state) => state.productReducer);
  const cartState = useSelector((state) => state.handleCart);
  const eventTimestamp = Date.now();
  const firstName = sessionStorage.getItem("userFirstName");
  const lastName = sessionStorage.getItem("userLastName");
  const userID = sessionStorage.getItem("userID");
  const sessionLogin = sessionStorage.getItem("sessionStart");
  const items = state?.productList?.map((prod) => ({
    id: prod?.id?.toString(),
    name: prod?.title,
    price: prod?.price,
    category: prod?.category,
    quantity: prod?.qty || 1,
  }));

  const dispatch = useDispatch();

  const sendCustomEvent = () => {
    let totalItems = 0;
    cartState.map((item) => {
      return (totalItems += item.qty);
    });

    // Send the page_view event
    gtag("event", "page_view", {
      // page_title: 'Product Details Page',
      // page_location: 'https://example.com/product-details',
      // page_referrer: 'https://example.com/home',
      engagement_time_msec: eventTimestamp,
      currency: "INR",
      total_item_quantity: totalItems,
      items: items,
      debug_mode: true,
    });

    gtag("event", "view_product", {
      event_timestamp: eventTimestamp,
      items: [
        {
          item_id: state?.selectedProduct?.id?.toString(),
          item_name: state?.selectedProduct?.title,
          price: state?.selectedProduct?.price,
          item_category: state?.selectedProduct?.category,
        },
      ],
      total_item_quantity: totalItems,
      pseudo_user_id: userID,
      first_name: firstName,
      last_name: lastName,
      is_active_user: "True",
      user_first_touch_timestamp: sessionLogin,
      item_timestamp: Date.now(),
      user_timestamp: Date.now(),
      debug_mode: true,
    });

    // Send the add_to_cart event
    gtag("event", "add_to_cart", {
      currency: "INR",
      total_item_quantity: totalItems,
      items: items,
    });

    console.log("Custom event triggered with timestamp:", totalItems);
  };

  // async function sendAddToCartEvent() {
  //   const eventPayload = {
  //     eventType: "add_to_cart",
  //     user: {
  //       pseudo_user_id: userID,
  //       first_name: firstName,
  //       last_name: lastName,
  //       is_active_user: "True",
  //       user_first_touch_timestamp: sessionLogin,
  //     },
  //     products: items,
  //   };

  //   try {
  //     const response = await fetch("http://localhost:3000/track-event", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(eventPayload),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     // Parse the JSON response
  //     const data = await response.json();
  //     console.log("Event sent successfully:", data);
  //   } catch (error) {
  //     console.error("Error sending event:", error);
  //   }
  // }

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
  async function sendAddToCartEvent() {
    const eventPayload = {
      user: {
        pseudo_user_id: userID,
        first_name: firstName,
        last_name: lastName,
        is_active_user: "True",
        user_first_touch_timestamp: sessionLogin,
      },
      products: items,
    };
    await sendEvent("add_to_cart", eventPayload);
  }

  // View Product Event
  async function sendViewProductEvent() {
    const eventPayload = {
      eventType: "view_product",
      user: {
        pseudo_user_id: userID,
        first_name: firstName,
        last_name: lastName,
        is_active_user: "True",
        items: [
          {
            item_id: state?.selectedProduct?.id?.toString(),
            item_name: state?.selectedProduct?.title,
            price: state?.selectedProduct?.price,
            item_category: state?.selectedProduct?.category,
          },
        ],
        user_first_touch_timestamp: sessionLogin,
      },
      products: items,
    };
    await sendEvent("view_product", eventPayload);
  }

  useEffect(() => {
    sendCustomEvent();
  }, [state, cartState]);

  const addProduct = (product) => {
    dispatch(setProductList(product));
    dispatch(addCart(product));
    sendAddToCartEvent();
  };

  const selectProduct = (product) => {
    sendViewProductEvent();
    dispatch(viewProduct(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <img
                className="img-fluid"
                src={product.image}
                alt={product.title}
                width="400px"
                height="400px"
              />
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{product.category}</h4>
              <h1 className="display-5">{product.title}</h1>
              <p className="lead">
                {product.rating && product.rating.rate}{" "}
                <i className="fa fa-star"></i>
              </p>
              <h3 className="display-6  my-4">${product.price}</h3>
              <p className="lead">{product.description}</p>
              <button
                className="btn btn-outline-dark"
                onClick={() => addProduct(product)}
              >
                Add to Cart
              </button>
              <Link
                to="/cart"
                className="btn btn-dark mx-3"
                onClick={(e) => eventTracker("Cart Page", "/cart")}
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="card mx-4 text-center">
                  <img
                    className="card-img-top p-3"
                    src={item.image}
                    alt="Card"
                    height={300}
                    width={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.title.substring(0, 15)}...
                    </h5>
                  </div>
                  {/* <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">${product.price}</li>
                  </ul> */}
                  <div className="card-body">
                    <Link
                      to={"/product/" + item.id}
                      className="btn btn-dark m-1"
                      onClick={() => selectProduct(item)}
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
