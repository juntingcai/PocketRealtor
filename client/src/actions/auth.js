import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const response = await axios.get("http://localhost:5000/verifyuser");
    if (response.data.msg === "Invalid token") {
      dispatch({ type: "AUTH_ERROR" });
    } else {
      dispatch({ type: "USER_LOADED", payload: response.data });
    }
  } catch (error) {
    dispatch({
      type: "AUTH_ERROR",
    });
  }
};

export const register = ({ firstname, lastname, email, password }) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ firstname, lastname, email, password });
  try {
    const response = await axios.post(
      "http://localhost:5000/user/register",
      body,
      config
    );
    if (response.data.code === 50003) {
      dispatch(setAlert("Email already exists", "danger"));
      dispatch({
        type: "REGISTER_FAIL",
      });
    } else {
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: response.data.token,
      });
      dispatch(loadUser());
      dispatch({ type: "CLOSE_DIALOG" });
    }
  } catch (error) {
    dispatch({
      type: "REGISTER_FAIL",
    });
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const response = await axios.post(
      "http://localhost:5000/user/login/",
      body,
      config
    );

    if (response.data.msg === "User does not exist") {
      dispatch(setAlert("Invalid credentials", "danger"));
      dispatch({
        type: "LOGIN_FAIL",
      });
    } else {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response,
      });
      dispatch(loadUser());
      dispatch({ type: "CLOSE_DIALOG" })
    }
  } catch (error) {
    dispatch({
      type: "LOGIN_FAIL",
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: "CLEAR_PROFILE" });
  dispatch({ type: "LOGOUT" });
};
