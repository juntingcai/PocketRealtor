
export const toLogin = () => async (dispatch) => {
  dispatch({ type: "TO_LOGIN" })
};

export const toRegister = () => async (dispatch) => {
    dispatch({ type: "TO_REGISTER" })
};

export const closeDialog = () => async (dispatch) => {
    dispatch({ type: "CLOSE_DIALOG" })
};
