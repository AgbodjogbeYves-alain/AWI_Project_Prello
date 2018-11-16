import asteroid from "../common/asteroid";

export const CREATE_BOARD = 'CREATE_BOARD';
export const GET_BOARDS = 'GET_BOARDS';
export const REMOVE_BOARD = "REMOVE_BOARD";
export const EDIT_BOARD = "EDIT_BOARD";
export const RESET_BOARDS = "RESET_BOARDS";

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
export function resetBoards() {
  return {
    type: RESET_BOARDS
  };
}

//Asynchroneous
export function callCreateBoard(boardTitle) {
  return dispatch => asteroid.call('boards.createBoard', boardTitle)
      .then(result => dispatch(createBoard({ _id: result, boardTitle})))
      .catch(error => { alert(error.reason);});
}

export function callEditBoard(newBoard) {
  asteroid.call('boards.editBoard', newBoard).catch(error => {alert(error.reason);})//.then(result => dispatch(editBoard({_id: result, data: newBoard})))

}
