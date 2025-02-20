// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../slices/authSlice"; // Make sure the path is correct

// const store = configureStore({
//   reducer: {
//     auth: authReducer, // Use your auth reducer here
//   },
// });

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk"; // Named import
import authReducer from "../slices/authSlice"; // Example reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
