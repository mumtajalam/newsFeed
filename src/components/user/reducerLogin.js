import { Constants } from "../../redux/constants";

const initialobj = {};
export const reducerLogin = (state = initialobj, action) => {
  const { type, payload } = action;
  switch (type) {
    case Constants.SET_LOGIN_INFO:
      return { ...state, loginDataRedux: payload };
    default:
      return state;
  }
};
