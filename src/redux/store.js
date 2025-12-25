import Appslice from "./slice/Appslice";
import ProductsSlice from "./slice/ProductsSlice";
import FavouritesSlice from "./slice/FavouritesSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    StoreApp: Appslice,
    Products: ProductsSlice,
    Favourites: FavouritesSlice,
  },
});
export default store;
