import { createSlice } from "@reduxjs/toolkit";

// Load orders from localStorage
const loadOrdersFromStorage = () => {
  try {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
  } catch (error) {
    console.error("Error loading orders from localStorage:", error);
  }
  return [];
};

const OrdersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: loadOrdersFromStorage(),
  },
  reducers: {
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      // Save to localStorage
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
    clearOrders: (state) => {
      state.orders = [];
      localStorage.removeItem("orders");
    },
  },
});

export const { addOrder, clearOrders } = OrdersSlice.actions;

export default OrdersSlice.reducer;
