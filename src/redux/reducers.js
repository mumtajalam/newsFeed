import { combineReducers } from "redux";
import { reducerLogin } from "../components/user/reducerLogin";

const reducers = combineReducers({
  login: reducerLogin,
});

export default reducers;
