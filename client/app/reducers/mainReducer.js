import { combineReducers } from 'redux';
import user from './UserReducers';
import boards from './BoardReducers';
import users from './UsersReducers';
import teams from './TeamReducers';

const mainReducer = combineReducers({
  user,
  boards,
  users,
  teams
});

export default mainReducer;
