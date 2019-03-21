import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import cloudReducer from "./cloudReducers";
import navReducer from "./navReducers";

export default combineReducers({
  auth: authReducer,
  cloud: cloudReducer,
  nav: navReducer,
  errors: errorReducer
});