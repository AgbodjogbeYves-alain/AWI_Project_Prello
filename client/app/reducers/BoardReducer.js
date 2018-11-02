import { EDIT_BOARD } from '../actions/BoardActions';

const board = (state = null, action) => {
    switch (action.type) {
        case EDIT_BOARD:
            return action.board;
        default:
            return state;
    }
};

export default board;
