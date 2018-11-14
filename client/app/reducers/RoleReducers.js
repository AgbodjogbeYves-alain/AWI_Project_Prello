import {GET_ROLES} from '../actions/RoleActions';
import { remove, edit, add } from '../common/helpers';

const roles = (state = [], action) => {
  switch (action.type) {
    case GET_ROLES:
      return add(state, action);
    default:
      return state;
  }
};

export default roles;