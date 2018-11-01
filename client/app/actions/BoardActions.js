import asteroid from "../common/asteroid";

export const CREATE_BOARD = 'CREATE_BOARD';
export const GET_BOARDS = 'GET_BOARDS';
export const REMOVE_BOARD = "REMOVE_BOARD";

export function createBoard(data) {
  return {
    type: CREATE_BOARD,
    data,
  };
}

export function removeBoard(_id) {
  return {
    type: REMOVE_BOARD,
    _id
  };
}

//Asynchroneous
export function callCreateBoard(boardTitle) {
  return dispatch => asteroid.call('boards.createBoard', boardTitle)
      .then(result => dispatch(createBoard({ _id: result, boardTitle })));
}

export function callRemoveBoard(boardId) {
  return dispatch => asteroid.call('boards.removeBoard', boardId)
      .then(result => dispatch(removeBoard(boardId)));
}
