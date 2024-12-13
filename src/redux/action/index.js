// to Store Product
export const SET_PRODUCT = 'SET_PRODUCT';

export const storeProduct = (product) => ({
  type: SET_PRODUCT,
  payload: product,
});

// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}