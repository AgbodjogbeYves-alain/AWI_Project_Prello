import { remove, edit, add } from '../common/helpers';
import { ADD_CHECKLIST, REMOVE_CHECKLIST, EDIT_CHECKLIST, RESET_CHECKLISTS } from '../actions/ChecklistActions';

const checklists = (state = [], action) => {
  switch (action.type) {
    case ADD_CHECKLIST:
      return add(state, action);
    case REMOVE_CHECKLIST:
      return remove(state, action);
    case EDIT_CHECKLIST:
      return edit(state, action);
    case RESET_CHECKLISTS:
      return [];
    default:
      return state;
  }
};

export default checklists;