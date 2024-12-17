import { SET_PRODUCT_LIST, VIEW_PRODUCT } from '../action/index';

const initialState = {
  productList: [],
  selectedProduct: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
      };
    case SET_PRODUCT_LIST:
      return {
        ...state,
        productList: [...state.productList, action.payload],
      };
    default:
      return state;
  }
};

export default productReducer;