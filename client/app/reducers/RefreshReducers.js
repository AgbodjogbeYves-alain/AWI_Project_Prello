import { SET_REFRESHED } from '../actions/RefreshActions';

const refreshed = (state = false, action) => {
  switch (action.type) {
    case SET_REFRESHED:
      return true;
    default:
      return state;
  }
};

export default refreshed;