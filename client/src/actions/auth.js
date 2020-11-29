import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";

export const loadUser = () => async (dispatch) => {

  const token = localStorage.getItem('token');
  console.log(token);
  if(token === null)
    dispatch({ type: "AUTH_ERROR" });
  else{
    const user = JSON.parse(token);
    console.log(user);
    setAuthToken(user.token);
    dispatch({ type: "USER_LOADED", payload: user });
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
      "http://52.53.200.228:3080/user/register",
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
        payload: response.data,
      });
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
      "http://52.53.200.228:3080/user/login",
      body,
      config
    );

    if (response.data.msg === "User does not exist") {
      dispatch(setAlert("Invalid credentials", "danger"));
      dispatch({
        type: "LOGIN_FAIL",
      });
    } else {
      console.log(response)
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      });
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
