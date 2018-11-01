import asteroid from "../common/asteroid";

export const EDIT_BOARD = 'EDIT_BOARD';


export function editBoard(board) {
    return {
        type: EDIT_BOARD,
        board,
    };
}

export function callEditBoard(newBoard) {
    return dispatch => asteroid.call('board.editBoard', {newBoard})
        .then(result =>
            dispatch(editBoard(result))
        )
        .catch(error => {console.log(error)})
}