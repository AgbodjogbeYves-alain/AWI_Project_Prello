import asteroid from "../common/asteroid";
import list from "../reducers/ListReducers";

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
export function callCreateList(idBoard) {
  return asteroid.call('boards.lists.createList', idBoard).catch(error => {
      alert("List couldn't be created, please retry later");
  });
}

export function callRemoveList(idBoard,idList) {
  return asteroid.call('boards.lists.deleteList', idBoard,idList).catch(error => {
      alert("List couldn't be removed, please retry later");
  });
}

export function callEditList(idBoard,newList) {
  return asteroid.call('boards.lists.editList', idBoard,newList).catch(error => {
    alert("List couldn't be edited, please retry later");
});
}
