import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";

// Configure the central Redux store with user reducer
export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});
