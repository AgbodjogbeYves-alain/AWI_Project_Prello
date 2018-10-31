import { EDIT_BOARD, } from '../actions/UserActions';

const user = (state = null, action) => {
    switch (action.type) {
        case SET_USER:
            return action.user;
        case EDIT_USER:
            return action.user;
        case UNSET_USER:
            return null;
        default:
            return state;
    }
};

export default user;
