import { combineReducers } from 'redux';
import user from './UserReducers';
import boards from './BoardReducers';
import users from './UsersReducers';

const mainReducer = combineReducers({
  user,
  boards,
  users
});

export default mainReducer;
