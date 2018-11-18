import { combineReducers } from 'redux';
import user from './UserReducers';
import boards from './BoardReducers';
import users from './UsersReducers';
import teams from './TeamReducers';
import labels from './LabelReducers';
import checklists from './ChecklistReducers';

import refreshed from './RefreshReducers';

const mainReducer = combineReducers({
  user,
  boards,
  users,
  teams,
  labels,
  refreshed,
  checklists
});

export default mainReducer;
