import Appslice from "./slice/Appslice";
import ProductsSlice from "./slice/ProductsSlice";
import FavouritesSlice from "./slice/FavouritesSlice";
import AuthSlice from "./slice/AuthSlice";
import OrdersSlice from "./slice/OrdersSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    StoreApp: Appslice,
    Products: ProductsSlice,
    Favourites: FavouritesSlice,
    Auth: AuthSlice,
    Orders: OrdersSlice,
  },
});
export default store;
