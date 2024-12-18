import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart, setProductList, viewProduct } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { gtag } from "ga-gtag";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;
  const state = useSelector((state) => state.productReducer);
  const cartState = useSelector((state) => state.handleCart);

  const dispatch = useDispatch();

  const sendCustomEvent = () => {
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
      quantity: prod?.qty,
    }));
    let totalItems = 0;
    cartState.map((item) => {
      return (totalItems += item.qty);
    });

    gtag("event", "view_product", {
      event_timestamp: eventTimestamp,
      items: [
        {
          id: state?.selectedProduct?.id?.toString(),
          name: state?.selectedProduct?.title,
          price: state?.selectedProduct?.price,
          category: state?.selectedProduct?.category,
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

    gtag("event", "add_to_cart", {
      event_timestamp: eventTimestamp,
      items: items,
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

    console.log("Custom event triggered with timestamp:", totalItems);
  };

  const addProduct = (product) => {
    dispatch(setProductList(product));
    dispatch(addCart(product));
  };

  const selectProduct = (product) => {
    dispatch(viewProduct(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  useEffect(() => {
    sendCustomEvent();
  }, [state, cartState]);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => {
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.title.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">$ {product.price}</li>
                  {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Vestibulum at eros</li> */}
                </ul>
                <div className="card-body">
                  <Link
                    to={"/product/" + product.id}
                    className="btn btn-dark m-1"
                    onClick={() => selectProduct(product)}
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => {
                      toast.success("Added to cart");
                      addProduct(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  sendCustomEvent();

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
