import { remove, edit, add } from '../common/helpers';
import { CREATE_LIST, GET_LIST, REMOVE_LIST, EDIT_LIST } from '../actions/ListActions';

const lists = (state = [], action) => {
  switch (action.type) {
    case CREATE_LIST:
      return add(state, action);
    case GET_LIST:
      return action.data;
    case EDIT_LIST:
      return edit(state, action);
    case REMOVE_LIST:
      return remove(state, action)
    default:
      return state;
  }
};

export default lists;