import { remove, edit, add } from '../common/helpers';
import { CREATE_BOARD, GET_BOARDS } from '../actions/BoardActions';

const boards = (state = [], action) => {
  switch (action.type) {
    case CREATE_BOARD:
      return add(state, action);
    case GET_BOARDS:
      return action.data;
    default:
      return state;
  }
};

export default boards;