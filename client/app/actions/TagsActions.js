import asteroid from "../common/asteroid";
import list from "../reducers/TagsReducers";

export const CREATE_CARD = 'CREATE_TAG';
export const GET_CARD = 'GET_TAG';
export const REMOVE_CARD = "REMOVE_TAG";
export const EDIT_CARD = "EDIT_TAG";

export function createTag(data) {
    return {
        type: CREATE_TAG,
        data,
    };
}

export function removeTag(_id) {
    return {
        type: REMOVE_TAG,
        _id
    };
}

export function editTag(_id, data) {
    return {
        type: EDIT_TAG,
        _id,
        data
    };
}


export function callCreateTag(idBoard,newTag) {
    asteroid.call('boards.tag.createTag', idBoard,newTag).catch(error => {
        console.log(error);
    })
}

export function callEditTag(idBoard,newTag) {
    asteroid.call('boards.tags.editTag', idBoard,newTag).catch(error => {
        console.log(error);
    })
}