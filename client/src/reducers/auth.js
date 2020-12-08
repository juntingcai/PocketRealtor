const initialState = {
  loading: true,
  isAuthenticated: false,
  token: null,
  id: null,
  firstname: "",
  lastname: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
    case "RELOAD_USER":
      localStorage.setItem("token", JSON.stringify(action.payload));
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "REGISTER_FAIL":
    case "LOGIN_FAIL":
    case "LOGOUT":
    case "AUTH_ERROR":
      localStorage.removeItem("token");
      return {
        ...initialState,
        loading: false,
      };
    case "USER_LOADED":
      
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    default:
      return state;
  }
}
