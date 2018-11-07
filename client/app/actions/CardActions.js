import asteroid from "../common/asteroid";
import list from "../reducers/CardReducers";

export const CREATE_CARD = 'CREATE_CARD';
export const GET_CARD = 'GET_CARD';
export const REMOVE_CARD = "REMOVE_CARD";
export const EDIT_CARD = "EDIT_CARD";

export function createCard(data) {
    return {
        type: CREATE_CARD,
        data,
    };
}

export function removeCard(_id) {
    return {
        type: REMOVE_CARD,
        _id
    };
}

export function editCard(_id, data) {
    return {
        type: EDIT_CARD,
        _id,
        data
    };
}


export function callCreateCard(idBoard,idList) {
    asteroid.call('boards.card.createCard', idBoard,idList).catch(error => {
        console.log(error);
    })
}