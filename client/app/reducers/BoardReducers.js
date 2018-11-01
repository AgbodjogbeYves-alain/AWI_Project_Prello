import { CREATE_BOARD } from '../actions/BoardActions';

const board = (state = null, action) => {
  switch (action.type) {
    case CREATE_BOARD:
      return action.board;
    default:
      return false;
  }
};

export default board;