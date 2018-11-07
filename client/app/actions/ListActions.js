import asteroid from "../common/asteroid";
import list from "../reducers/ListReducers";
import {editBoard} from "./BoardActions";

export const CREATE_LIST = 'CREATE_LIST';
export const GET_LISTS = 'GET_LISTS';
export const REMOVE_LIST = "REMOVE_LIST";
export const EDIT_LIST = "EDIT_LIST";

export function createList(data) {
  return {
    type: CREATE_LIST,
    data,
  };
}

export function removeList(_id) {
  return {
    type: REMOVE_LIST,
    _id
  };
}

export function editList(_id, data) {
  return {
    type: EDIT_LIST,
    _id,
    data
  };
}

//Asynchroneous
export function callCreateList(listTitle) {
  return dispatch => asteroid.call('lists.createList', listTitle)
      .then(result => dispatch(createList({ _id: result, listTitle})));
}

export function callRemoveList(listId) {
  asteroid.call('lists.deleteList', listId)
}

export function callEditList(idBoard,newList) {
  return dispatch => asteroid.call('lists.editListFromList', idBoard,newList)
}