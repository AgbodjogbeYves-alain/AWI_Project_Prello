import asteroid from "../common/asteroid";

export const SET_USER = 'SET_USER';
export const UNSET_USER = 'UNSET_USER';
export const EDIT_USER = 'EDIT_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const ADD_USER = 'ADD_USER';
export const RESET_USERS = "RESET_USERS";

export function setLoggedUser(data) {
  return {
    type: SET_USER,
    data,
  };
}

export function unsetLoggedUser() {
  return {
    type: UNSET_USER
  };
}

export function editProfileUser(_id, data) {
  return {
    type: EDIT_USER,
    _id,
    data
  };
}

export function removeUser() {
  return {
    type: REMOVE_USER
  };
}

export function enabledMails(user){
  return {
    type: EDIT_USER,
    user
  }
}

export function addUser(data){
  return {
    type: ADD_USER,
    data
  }
}

export function resetUsers(){
  return {
    type: RESET_USERS
  }
}

export function callEditProfileUser(userId, profile) {
  
  
  return dispatch => {
    dispatch(editProfileUser(userId, {
      profile : profile
    }));
    return asteroid.call('users.updateProfile', profile.email, profile.lastname, profile.firstname)
  } 
}

export function callRemoveUser() {
  return dispatch => asteroid.call('users.remove')
      .then(result => dispatch(removeUser(result))).catch(error => {alert(error.reason);})
}

export function callEnabledMails(val) {
  return dispatch => asteroid.call('users.setEnabledMails', val)
      .then(result => dispatch(enabledMails(result))).catch(error => {alert(error.reason);})
}
