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
        alert("Card couldn't be created, please retry later");
    })
}

export function callEditCard(idBoard,idList,newCard) {
    asteroid.call('boards.card.editCard', idBoard,idList,newCard).catch(error => {
        alert("Card couldn't be updated, please retry later");
    })
}

export function callAddCommentCard(idBoard,idList,newCard) {
    asteroid.call('boards.card.addComment', idBoard,idList,newCard).catch(error => {
        alert("Comment couldn't be added, please retry later");
    })
}

export function callRemoveCard(idBoard,idList,idCard){
    asteroid.call('boards.card.removeCard', idBoard,idList,idCard).catch(error => {
        alert("Card couldn't be removed, please retry later");
    })
}
