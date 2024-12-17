import { SET_PRODUCT } from '../action/index';

const initialState = {
  product: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT:
      return {
        ...state,
        product: [...state.product, action.payload],
      };
    default:
      return state;
  }
};

export default productReducer;