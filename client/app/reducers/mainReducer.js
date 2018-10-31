import { combineReducers } from 'redux';
import user from './UserReducers';

const mainReducer = combineReducers({
  user,
});

export default mainReducer;
