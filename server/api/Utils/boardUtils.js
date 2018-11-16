export class boardUtils {

    static checkInBoardUser(idUser, board){
        let isIn = false
        board.boardUsers.map((user) => {
            if(user._id == idUser){
                isIn = true
            }
        })

        return isIn
    }

    /**
     * Get the role of an user in a board
     * 
     * @param {*} idUser The user to search
     * @param {*} board The board to check
     * @returns The role, or "" if the user is not in the board
     */
    static getUserRole(idUser, board){
        let user = board.boardUsers.find(u => u.userId == idUser)
        return (user) ? user.role : ""
    }
}