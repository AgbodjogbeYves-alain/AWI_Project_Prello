import { remove, edit, add } from '../common/helpers';
import { ADD_LABEL, GET_LABEL, REMOVE_LABEL, EDIT_LABEL } from '../actions/LabelActions';

const labels = (state = [], action) => {
    switch (action.type) {
        case ADD_LABEL:
            return add(state, action);
        case GET_LABEL:
            return action.data;
        case EDIT_LABEL:
            return edit(state, action);
        case REMOVE_LABEL:
            return remove(state, action)
        default:
            return state;
    }
};

export default labels;