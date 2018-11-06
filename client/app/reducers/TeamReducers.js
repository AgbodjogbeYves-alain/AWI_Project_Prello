import { remove, edit, add } from '../common/helpers';
import { ADD_TEAM } from '../actions/TeamActions';

const teams = (state = [], action) => {
  switch (action.type) {
    case ADD_TEAM:
      return add(state, action);
    default:
      return state;
  }
};

export default teams;