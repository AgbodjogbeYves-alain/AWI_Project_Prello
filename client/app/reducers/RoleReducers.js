import {GET_ROLES} from '../actions/RoleActions';

const roles = (state = [], action) => {
  switch (action.type) {
    case GET_ROLES:
      return action.data;
    default:
      return state;
  }
};

export default roles;