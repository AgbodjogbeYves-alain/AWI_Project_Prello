import asteroid from "../common/asteroid";
import roles from "../reducers/RoleReducers";

export const GET_ROLES = 'GET_ROLES';

export function addRole(data){
    return {
        type: GET_ROLES,
        data
    };
}