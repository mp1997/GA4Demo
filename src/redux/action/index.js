
export const VIEW_PRODUCT = "ADD_PRODUCT";
export const SET_PRODUCT_LIST = "SET_PRODUCT_LIST";

// to View Product
export const viewProduct = (product) => ({
  type: VIEW_PRODUCT,
  payload: product,
});

// to Store Product
export const setProductList = (product) => ({
  type: SET_PRODUCT_LIST,
  payload: product,
});

// For Add Item to Cart
export const addCart = (product) => {
  return {
    type: "ADDITEM",
    payload: product,
  };
};

// For Delete Item to Cart
export const delCart = (product) => {
  return {
    type: "DELITEM",
    payload: product,
  };
};
