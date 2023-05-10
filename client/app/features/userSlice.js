import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    isLoading: false,
    error: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { login, logout, setIsLoading, setError } = userSlice.actions;

export const loginAsync =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      const response = await axios.post(
        "http://localhost:5000/api/users/signin",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      const { user } = response.data;
      dispatch(login(user));
    } catch (error) {
      dispatch(setError(true));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

export const logoutAsync = () => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    await axios.post(
      "http://localhost:5000/api/users/signout",
      {},
      { withCredentials: true }
    );
    dispatch(logout());
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const selectUser = (state) => state.user.user;
export const selectIsLoading = (state) => state.user.isLoading;

export default userSlice.reducer;
