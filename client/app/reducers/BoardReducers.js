import { remove, edit, add } from '../common/helpers';
import { CREATE_BOARD, GET_BOARDS, REMOVE_BOARD, EDIT_BOARD, RESET_BOARDS } from '../actions/BoardActions';

const boards = (state = [], action) => {
  switch (action.type) {
    case CREATE_BOARD:
      return add(state, action);
    case GET_BOARDS:
      return action.data;
    case EDIT_BOARD:
      return edit(state, action);
    case REMOVE_BOARD:
      return remove(state, action)
    case RESET_BOARDS:
      return []
    default:
      return state;
  }
};

export default boards;