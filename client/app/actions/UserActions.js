import asteroid from "../common/asteroid";

export const SET_USER = 'SET_USER';
export const UNSET_USER = 'UNSET_USER';
export const EDIT_USER = 'EDIT_USER';

export function setLoggedUser(user) {
  return {
    type: SET_USER,
    user,
  };
}

export function unsetLoggedUser() {
  return {
    type: UNSET_USER
  };
}

export function editProfileUser(user) {
  return {
    type: EDIT_USER,
    user
  };
}

export function callEditProfileUser(email, lastname, firstname) {
  return dispatch => asteroid.call('users.updateProfile', email, lastname, firstname)
      .then(result => dispatch(editProfileUser(result)));
}