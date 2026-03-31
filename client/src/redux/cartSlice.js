import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  totalPrice: localStorage.getItem("totalPrice")
    ? Number(localStorage.getItem("totalPrice"))
    : 0,
  totalQuantity: localStorage.getItem("totalQuantity")
    ? Number(localStorage.getItem("totalQuantity"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        state.items.push({ ...product, quantity: product.quantity || 1 });
      }

      // Recalculate totals
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalPrice", state.totalPrice.toString());
      localStorage.setItem("totalQuantity", state.totalQuantity.toString());
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item._id !== productId);

      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalPrice", state.totalPrice.toString());
      localStorage.setItem("totalQuantity", state.totalQuantity.toString());
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item._id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }

      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalPrice", state.totalPrice.toString());
      localStorage.setItem("totalQuantity", state.totalQuantity.toString());
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;

      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalPrice");
      localStorage.removeItem("totalQuantity");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
