import { combineReducers } from "redux";

import plants from "./plantReducer";
import users from "./userReducer";

export default combineReducers({ plants, users });
