import asteroid from "../common/asteroid";

export const CREATE_BOARD = 'CREATE_BOARD';
export const GET_BOARDS = 'GET_BOARDS';

export function createBoard(data) {
  return {
    type: CREATE_BOARD,
    data,
  };
}

export function callCreateBoard(boardTitle) {
  return dispatch => asteroid.call('boards.createBoard', boardTitle)
      .then(result => dispatch(createBoard({ _id: result, boardTitle })));
}