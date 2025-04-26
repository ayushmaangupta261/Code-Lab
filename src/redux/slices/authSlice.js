import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user"))
//     : null,
//   authLoading: false,
//   modal: false,
//   // token: localStorage.getItem("token")
//   //   ? JSON.parse(localStorage.getItem("token"))
//   //   : null,
//   roomData: localStorage.getItem("roomData")
//     ? JSON.parse(localStorage.getItem("roomData")) // now expecting an array
//     : [],
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState: initialState,
//   reducers: {
//     setUser(state, value) {
//       state.user = value.payload;
//       localStorage.setItem("user", JSON.stringify(value.payload));
//     },
//     setAuthLoading(state, value) {
//       state.authLoading = value.payload;
//     },
//     setModal(state, value) {
//       state.modal = value.payload;
//     },
//     // setToken(state, action) {
//     //   state.token = action.payload;
//     //   // ✅ Store token in localStorage
//     //   localStorage.setItem("token", JSON.stringify(action.payload));
//     // },
//     setRoomData(state, value) {
//       state.roomData = value.payload; // expecting an array
//       localStorage.setItem("roomData", JSON.stringify(value.payload));
//     },
//   },
// });

// export const { setUser, setAuthLoading, setModal, setRoomData } =
//   authSlice.actions;

// export default authSlice.reducer;

const initialState = {
  user: localStorage.getItem("user")
    ? localStorage.getItem("user") === "undefined"
      ? null
      : JSON.parse(localStorage.getItem("user"))
    : null,
  authLoading: false,
  modal: false,
  roomData: localStorage.getItem("roomData")
    ? localStorage.getItem("roomData") === "undefined"
      ? []
      : JSON.parse(localStorage.getItem("roomData"))
    : [], // Empty array as fallback if no roomData
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
    setRoomData(state, value) {
      state.roomData = value.payload;
      localStorage.setItem("roomData", JSON.stringify(value.payload));
    },
  },
});

export const { setUser, setAuthLoading, setModal, setRoomData } = authSlice.actions;

export default authSlice.reducer;
