import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import dialog from './dialog';

export default combineReducers({ alert, auth, dialog });
