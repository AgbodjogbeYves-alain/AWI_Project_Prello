import { EDIT_BOARD } from '../actions/BoardActions';

const board = (state = null, action) => {
    switch (action.type) {
        case EDIT_BOARD:
            return action.newBoard;
        default:
            return state;
    }
};

export default board;
