import axios from "axios";
import { setAlert } from "./alert";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/myprofile");
    dispatch({
      type: "GET_PROFILE",
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: "PROFILE_ERROR",
      payload: {
        message: "Error retrieving profile",
      },
    });
  }
};

export const updateProfile = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = axios.put("/user/updateProfile", formData, config);
    dispatch({
      type: "GET_PROFILE",
      payload: res.data,
    });
    dispatch(setAlert("Profile Updated", "success"));
  } catch (error) {
    dispatch({
      type: "PROFILE_ERROR",
      payload: {
        message: "Error encountered when updating profile",
      },
    });
  }
};
