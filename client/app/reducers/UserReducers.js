import { SET_USER, UNSET_USER, EDIT_USER, REMOVE_USER } from '../actions/UserActions';

const user = (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.data;
    case EDIT_USER:
      let newUser = Object.assign({_id: state._id}, action.data)
      console.log(newUser)
      return newUser;
    case UNSET_USER:
      return null;
    case REMOVE_USER:
      return null
    default:
      return state;
  }
};

export default user;
