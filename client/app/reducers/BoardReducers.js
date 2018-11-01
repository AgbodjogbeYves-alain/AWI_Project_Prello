import { remove, edit, add } from '../common/helpers';
import { CREATE_BOARD, GET_BOARDS, REMOVE_BOARD } from '../actions/BoardActions';

const boards = (state = [], action) => {
  switch (action.type) {
    case CREATE_BOARD:
      return add(state, action);
    case GET_BOARDS:
      return action.data;
    case REMOVE_BOARD:
      return remove(state, action)
    default:
      return state;
  }
};

export default boards;