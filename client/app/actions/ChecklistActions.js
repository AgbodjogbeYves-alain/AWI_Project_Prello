import asteroid from "../common/asteroid";
import { editBoard } from "./BoardActions";
import store from "../components/store";

export const ADD_CHECKLIST = 'ADD_CHECKLIST';
export const GET_TEAMS = 'GET_TEAMS';
export const REMOVE_CHECKLIST = "REMOVE_CHECKLIST";
export const EDIT_CHECKLIST = "EDIT_CHECKLIST";
export const RESET_CHECKLISTS = "RESET_CHECKLISTS";

export function addChecklist(data) {
  return {
    type: ADD_CHECKLIST,
    data,
  };
}

export function removeChecklist(_id) {
  return {
    type: REMOVE_CHECKLIST,
    _id
  };
}

export function editChecklist(_id, data) {
  return {
    type: EDIT_CHECKLIST,
    _id,
    data
  };
}

export function resetChecklists() {
  return {
    type: RESET_CHECKLISTS
  };
}

function getBoardFromChecklist(checklistId){
  return store.getState().boards.filter((b) =>{
    return b.boardLists.filter((l) =>{
      return l.listCards.filter((c) => {
        return c.cardChecklists.filter((cl) => cl === checklistId).length > 0
      }).length > 0
    }).length > 0
  })[0];
}

export function callRemoveChecklist(checklistId) {
  let board = getBoardFromChecklist(checklistId);

  //TODO
  let newBoardLists = board.boardLists.map((list) => {
    let newListCards = list.listCards.map((card) => {
      let newCardChecklists = card.cardChecklists.filter((c) => c !== checklistId)
      card.cardChecklists = newCardChecklists;
      return card;
    });
    list.listCards = newListCards;
    return list;
  });
  board.boardLists = newBoardLists;

  asteroid.call('boards.editBoard', board).catch(error => {alert(error.reason);})
  asteroid.call('checklists.removeChecklist', checklistId).catch(error => {alert(error.reason);})

  return (dispatch) =>{
    dispatch(editBoard({_id: board._id, data: board}));
    dispatch(removeChecklist(checklistId));
  } 
}

export function callSetItemChecked(itemId, itemChecked){
  let checklist = store.getState().checklists.find((checklist) => checklist.checklistItems.find((item) => item._id === itemId));
  
  checklist.checklistItems = checklist.checklistItems.map((item) => {
    if(item._id === itemId) item.itemChecked = itemChecked
    return item
  });

  
  return dispatch =>{
    dispatch(editChecklist(checklist._id, checklist));
    asteroid.call("checklists.setItemChecked",itemId,itemChecked);
  } 
}