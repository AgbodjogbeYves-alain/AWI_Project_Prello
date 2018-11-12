import asteroid from "../common/asteroid";

export const CREATE_LABEL = 'CREATE_LABEL';
export const GET_LABEL = 'GET_LABEL';
export const REMOVE_LABEL = "REMOVE_LABEL";
export const EDIT_LABEL = "EDIT_LABEL";
export const ADD_LABEL = 'ADD_LABEL';


export function addLabel(data) {
    return {
        type: ADD_LABEL,
        data,
    };
}

export function removeLabel(_id) {
    return {
        type: REMOVE_LABEL,
        _id
    };
}

export function editLabel(_id, data) {
    return {
        type: EDIT_LABEL,
        _id,
        data
    };
}




export function callCreateLabel(idBoard,newLabel) {
    asteroid.call('labels.createLabel', idBoard,newLabel).catch(error => {
        console.log(error);
    })
}

export function callEditLabels(idBoard,newLabel) {
    asteroid.call('boards.labels.editLabel', idBoard,newLabel).catch(error => {
        console.log(error);
    })
}