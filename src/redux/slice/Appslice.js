import { createSlice } from "@reduxjs/toolkit";

const Appslice = createSlice({
  name: "MyStoreApp",
  initialState: {
    cart: [],
    totalItems: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
      state.totalItems = state.cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.cartId !== action.payload);
      state.totalItems = state.cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    updateQuantity: (state, action) => {
      const item = state.cart.find(
        (item) => item.cartId === action.payload.cartId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.cart = state.cart.filter(
            (i) => i.cartId !== action.payload.cartId
          );
        }
      }
      state.totalItems = state.cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  Appslice.actions;
export default Appslice.reducer;
