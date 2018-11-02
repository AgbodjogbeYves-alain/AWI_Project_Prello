import asteroid from "../common/asteroid";
import board from "../reducers/BoardReducer";

export const CREATE_BOARD = 'CREATE_BOARD';
export const GET_BOARDS = 'GET_BOARDS';
export const REMOVE_BOARD = "REMOVE_BOARD";
export const EDIT_BOARD = "EDIT_BOARD";

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

export function editBoard(_id, data) {
  return {
    type: EDIT_BOARD,
    _id,
    data
  };
}

//Asynchroneous
export function callCreateBoard(boardTitle) {
  return dispatch => asteroid.call('boards.createBoard', boardTitle)
      .then(result => dispatch(createBoard({ _id: result, boardTitle})));
}

export function callRemoveBoard(boardId) {
  return dispatch => asteroid.call('boards.removeBoard', boardId)
      .then(result => dispatch(removeBoard(boardId)));
}

export function callEditBoard(newBoard) {
  return dispatch => asteroid.call('boards.editBoard', newBoard).then(result => dispatch(editBoard({_id: result, newBoard})))
}