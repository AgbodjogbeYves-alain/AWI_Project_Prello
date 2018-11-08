import { ADD_USER, RESET_USERS } from '../actions/UserActions';
import { add } from '../common/helpers';

const users = (state = [], action) => {
  switch (action.type) {
    case ADD_USER:
      return add(state, action);
    case RESET_USERS:
      return [];
    default:
      return state;
  }
};

export default users;
