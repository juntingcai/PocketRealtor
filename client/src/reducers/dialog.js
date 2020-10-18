const initialState = {
    open: false,
    action: ''
};

export default function (state = initialState, action) {

    switch (action.type) {
      case "TO_REGISTER":
        return {
          open: true,
          action: 'register'
        };
      case "TO_LOGIN":
        return {
          open: true,
          action: 'login'
        };
      case "CLOSE_DIALOG":
        return {
          open: false,
          action: ''
        };
      default:
        return state;
    }
  }
  