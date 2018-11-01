import asteroid from "../common/asteroid";

export const CREATE_BOARD = 'CREATE_BOARD';

export function createBoard(board) {
  return {
    type: CREATE_BOARD,
    board,
  };
}

export function callCreateBoard(boardTitle) {
  return dispatch => asteroid.call('boards.createBoard', boardTitle)
      .then(result => dispatch(createBoard(result)));
}