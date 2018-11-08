import asteroid from "../common/asteroid";

export const ADD_TEAM = 'ADD_TEAM';
export const GET_TEAMS = 'GET_TEAMS';
export const REMOVE_TEAM = "REMOVE_TEAM";
export const EDIT_TEAM = "EDIT_TEAM";
export const RESET_TEAMS = "RESET_TEAMS";

export function addTeam(data) {
  return {
    type: ADD_TEAM,
    data,
  };
}

export function removeTeam(_id) {
  return {
    type: REMOVE_TEAM,
    _id
  };
}

export function editTeam(_id, data) {
  return {
    type: EDIT_TEAM,
    _id,
    data
  };
}

export function resetTeams() {
  return {
    type: RESET_TEAMS
  };
}