import asteroid from "../common/asteroid";
import store from "../components/store";

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

function getBoardFromItem(itemId){
  return store.getState().boards.filter((b) =>{
    return b.boardLists.filter((l) =>{
      return l.listCards.filter((c) => {
        return c.cardChecklists.filter((cl) =>{
          return cl.checklistItems.filter((i) => i.itemId === itemId);
        }).length > 0
      }).length > 0
    }).length > 0
  })[0];
}

//Asynchroneous
export function callCreateBoard(board) {
  return asteroid.call('boards.createBoard', board);
}

export function callEditBoard(newBoard) {
  asteroid.call('boards.editBoard', newBoard).catch(error => {alert(error.reason);})
  return dispatch => dispatch(editBoard({_id: newBoard._id, data: newBoard}));
}

export function callRemoveItem(itemId) {
  let board = getBoardFromItem(itemId);

  let newBoardLists = board.boardLists.map((list) => {
    let newListCards = list.listCards.map((card) => {
      let newCardChecklists = card.cardChecklists.map((checklist) =>{
        let newChecklistItems = checklist.checklistItems.filter((item) => item._id !== itemId)
        checklist.checklistItems = newChecklistItems;
        return checklist
      });
      card.cardChecklists = newCardChecklists;
      return card;
    });
    list.listCards = newListCards;
    return list;
  });
  board.boardLists = newBoardLists;

  asteroid.call('boards.editBoard', board).catch(error => {alert(error.reason);})
  return dispatch => dispatch(editBoard({_id: board._id, data: board}));
}