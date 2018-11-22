import { SET_USER, UNSET_USER, EDIT_USER, REMOVE_USER } from '../actions/UserActions';
import { edit } from '../common/helpers';

const user = (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.data;
    case EDIT_USER:
      if(action.data.profile) return Object.assign({_id: state._id}, action.data);
      else return edit(state, action);
    case UNSET_USER:
      return null;
    case REMOVE_USER:
      return null
    default:
      return state;
  }
};

export default user;
