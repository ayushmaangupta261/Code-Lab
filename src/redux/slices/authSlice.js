import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null,
  authLoading: false,
  modal: false,
  // token: localStorage.getItem("token")
  //   ? JSON.parse(localStorage.getItem("token"))
  //   : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
      localStorage.setItem("user", JSON.stringify(value.payload));
    },
    setAuthLoading(state, value) {
      state.authLoading = value.payload;
    },
    setModal(state, value) {
      state.modal = value.payload;
    },
    // setToken(state, action) {
    //   state.token = action.payload;
    //   // ✅ Store token in localStorage
    //   localStorage.setItem("token", JSON.stringify(action.payload));
    // },
  },
});

export const { setUser, setAuthLoading, setModal } =
  authSlice.actions;

export default authSlice.reducer;
