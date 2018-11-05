import asteroid from "../common/asteroid";

export const CREATE_TEAM = 'CREATE_TEAM';
export const GET_TEAMS = 'GET_TEAMS';
export const REMOVE_TEAM = "REMOVE_TEAM";
export const EDIT_TEAM = "EDIT_TEAM";

export function createTeam(data) {
  return {
    type: CREATE_TEAM,
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

//Asynchroneous
export function callCreateTeam(teamName) {
  return dispatch => asteroid.call('teams.createTeam', teamName)
      .then(result => dispatch(createTeam({ _id: result, teamName })));
}

export function callRemoveTeam(teamId) {
  return dispatch => asteroid.call('teams.removeTeam', teamId)
      .then(result => dispatch(removeTeam(teamId)));
}

export function callEditTeam(newTeam) {
  console.log(newTeam)
  asteroid.call('teams.editTeam', newTeam)
          .then(result => dispatch(editTeam({_id: result, data: newTeam})))
}