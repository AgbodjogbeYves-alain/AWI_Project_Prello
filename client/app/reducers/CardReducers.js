import { remove, edit, add } from '../common/helpers';
import { CREATE_CARD, GET_CARD, REMOVE_CARD, EDIT_CARD } from '../actions/CardActions';

const cards = (state = [], action) => {
    switch (action.type) {
        case CREATE_CARD:
            return add(state, action);
        case GET_CARD:
            return action.data;
        case EDIT_CARD:
            return edit(state, action);
        case REMOVE_CARD:
            return remove(state, action)
        default:
            return state;
    }
};

export default cards;