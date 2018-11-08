import { remove, edit, add } from '../common/helpers';
import { ADD_TEAM, REMOVE_TEAM, EDIT_TEAM, RESET_TEAMS } from '../actions/TeamActions';

const teams = (state = [], action) => {
  switch (action.type) {
    case ADD_TEAM:
      return add(state, action);
    case REMOVE_TEAM:
      return remove(state, action);
    case EDIT_TEAM:
      return edit(state, action);
    case RESET_TEAMS:
      return [];
    default:
      return state;
  }
};

export default teams;