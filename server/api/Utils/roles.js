// Board rights
export const DELETE_BOARD = "DELETE_BOARD"
export const REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER"
export const EDIT_BOARD_SETTINGS = "EDIT_BOARD_SETTINGS"
export const EXPORT_BOARD = "EXPORT_BOARD"
export const ACCESS_ARCHIVES = "ACCESS_ARCHIVES"
export const COPY_BOARD = "COPY_BOARD"
export const ACCESS_BOARD = "ACCESS_BOARD"
export const REMOVE_MEMBER = "REMOVE_MEMBER"
export const CHANGE_RIGHTS_TEAM_MEMBER = "CHANGE_RIGHTS_TEAM_MEMBER"
export const ADD_MEMBER_BOARD = "ADD_MEMBER"

// Card rights
export const DELETE_CARD = "DELETE_CARD"
export const ADD_MEMBER_CARD = "ADD_MEMBER_CARD"
export const CREATE_CHECKLIST = "CREATE_CHECKLIST"
export const ADD_DEADLINE = "ADD_DEADLINE"
export const ADD_ATTACHMENT = "ADD_ATTACHMENT"
export const MOVE_CARD = "MOVE_CARD"
export const COPY_CARD = "COPY_CARD"
export const FOLLOW_CARD = "FOLLOW_CARD"
export const ARCHIVE_CARD = "ARCHIVE_BOARD"
export const CREATE_CARD = "CREATE_CARD"
export const ACCESS_CARD = "ACCESS_CARD"
export const EDIT_CARD = "EDIT_CARD"


const roles = {
    admin: [DELETE_BOARD,
        REMOVE_TEAM_MEMBER,
        EDIT_BOARD_SETTINGS,
        EXPORT_BOARD,
        ACCESS_ARCHIVES,
        COPY_BOARD,
        ACCESS_BOARD,
        REMOVE_MEMBER,
        CHANGE_RIGHTS_TEAM_MEMBER,
        ADD_MEMBER_BOARD,

        DELETE_CARD,
        ADD_MEMBER_CARD,
        CREATE_CHECKLIST,
        ADD_DEADLINE,
        ADD_ATTACHMENT,
        MOVE_CARD,
        COPY_CARD,
        FOLLOW_CARD,
        ARCHIVE_CARD,
        CREATE_CARD,
        ACCESS_CARD,
        EDIT_CARD
    ],
    member: [
        EXPORT_BOARD,
        ACCESS_ARCHIVES,
        COPY_BOARD,
        ACCESS_BOARD,
        ADD_MEMBER_CARD,
        CREATE_CHECKLIST,
        ADD_DEADLINE,
        ADD_ATTACHMENT,
        MOVE_CARD,
        COPY_CARD,
        FOLLOW_CARD,
        CREATE_CARD,
        ACCESS_CARD,
        EDIT_CARD
    ],
    observer: [
        ACCESS_BOARD,

        ACCESS_CARD
    ]
}

/**
 * Tests whether a role has a given right
 *
 * @param {*} role The role to tests
 * @param {*} right The right to check
 */
export function canPerform(role, right){
    return role && roles.hasOwnProperty(role) && roles[role].includes(right)
}
