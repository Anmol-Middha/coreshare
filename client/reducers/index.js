import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import cloudReducer from "./cloudReducers";

export default combineReducers({
  auth: authReducer,
  cloud: cloudReducer,
  errors: errorReducer
});