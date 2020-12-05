import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";

import { loginUser, registerUser } from '../utils/functions';

export const loadUser = () => async (dispatch) => {

  const token = localStorage.getItem('token');
  console.log(token);
  if (token === null)
    dispatch({ type: "AUTH_ERROR" });
  else {
    const user = JSON.parse(token);
    console.log(user);
    setAuthToken(user.token);
    dispatch({ type: "USER_LOADED", payload: user });
  }

};
export const register = ({ firstname, lastname, email, password }) => async (
  dispatch
) => {
  registerUser(firstname, lastname, email, password).then(response => {
    if (response.code === 50003) {
      dispatch(setAlert("Email already exists", "danger"));
      dispatch({
        type: "REGISTER_FAIL",
      });
    } else if (response.code === 10000) {
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: response,
      });
      dispatch({ type: "CLOSE_DIALOG" });
    }
  }).catch(error => {
    alert(error)
    dispatch({ type: "REGISTER_FAIL" });
  })

};

export const login = ({ email, password }) => async (dispatch) => {

  loginUser(email, password).then(response => {
    if (response.code === 10000) {
      console.log(response)
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response,
      });
      dispatch({ type: "CLOSE_DIALOG" })
    } else {
      dispatch(setAlert("Invalid credentials", "danger"));
      dispatch({
        type: "LOGIN_FAIL",
      });
    }
  }).catch(error => {
    alert(error)
    dispatch({ type: "LOGIN_FAIL" });
  })

};

export const logout = () => (dispatch) => {
  dispatch({ type: "CLEAR_PROFILE" });
  dispatch({ type: "LOGOUT" });
};
