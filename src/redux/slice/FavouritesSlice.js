import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const FavouritesSlice = createSlice({
  name: "Favourites",
  initialState,
  reducers: {
    toggleFavourite: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex >= 0) {
        // Remove from favorites
        state.items.splice(existingIndex, 1);
      } else {
        // Add to favorites
        state.items.push(product);
      }
    },
    removeFavourite: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
    clearFavourites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavourite, removeFavourite, clearFavourites } =
  FavouritesSlice.actions;
export default FavouritesSlice.reducer;
