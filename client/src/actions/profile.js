import axios from "axios";
import { setAlert } from "./alert";

export const getCurrentProfile = (userid) => async (dispatch) => {
  try {
    const res = await axios.get("http://52.53.200.228:3080/user/" + userid);
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
    const res = axios.put(
      "http://52.53.200.228:3080/user/updateProfile",
      formData,
      config
    );
    dispatch({
      type: "GET_PROFILE",
      payload: res.data,
    });
    dispatch(setAlert("Profile Updated", "success"));
    axios.put(
      "http://52.53.200.228:3080/user/updateAvatar",
      {
        "avatar": formData.avatar
      },
      config,
    ).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err);
    })
  } catch (error) {
    dispatch({
      type: "PROFILE_ERROR",
      payload: {
        message: "Error encountered when updating profile",
      },
    });
  }
};
