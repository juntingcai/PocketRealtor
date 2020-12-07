import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";
import { loginUser, registerUser } from '../utils/functions';

export const loadUser = () => async (dispatch) => {

  const token = localStorage.getItem('token');

  if (token === null)
    dispatch({ type: "AUTH_ERROR" });
  else {
    const user = JSON.parse(token);
    console.log("user logined");
    setAuthToken(user.token);
    dispatch({ type: "USER_LOADED", payload: user });
  }

};
export const register = ({ firstname, lastname, email, password }) => async (
  dispatch
) => {
  registerUser(firstname, lastname, email, password).then(data => {
    dispatch({
      type: "REGISTER_SUCCESS",
      payload: data
    });
    dispatch({ type: "CLOSE_DIALOG" });

  }).catch(() => {
    dispatch({ type: "REGISTER_FAIL" });
  })

};

export const login = ({ email, password }) => async (dispatch) => {

  loginUser(email, password).then(data => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: data,
    });
    dispatch({ type: "CLOSE_DIALOG" })

  }).catch(() => {
    dispatch({ type: "LOGIN_FAIL" });
  })

};

export const logout = () => (dispatch) => {
  dispatch({ type: "CLEAR_PROFILE" });
  dispatch({ type: "LOGOUT" });
};
