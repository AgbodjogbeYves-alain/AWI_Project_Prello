import { combineReducers } from 'redux';
import user from './UserReducers';
import boards from './BoardReducers';

const mainReducer = combineReducers({
  user,
  boards
>>>>>>> origin/develop
});

export default mainReducer;
