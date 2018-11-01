import { combineReducers } from 'redux';
import user from './UserReducers';
import board from "./BoardReducer";

const mainReducer = combineReducers({
  user,
  board,
});

export default mainReducer;
