import { combineReducers } from 'redux';
import user from './UserReducers';
import boards from './BoardReducers';
import users from './UsersReducers';
import teams from './TeamReducers';
import labels from './LabelReducers';


const mainReducer = combineReducers({
  user,
  boards,
  users,
  teams,
  labels
});

export default mainReducer;
