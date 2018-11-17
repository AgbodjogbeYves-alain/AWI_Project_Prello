export class boardUtils {

    /**
     * Get if the user is in a board
     *
     * @param idUser The user to search
     * @param board The board to check
     * @returns true if the user is in the board, false otherwise
     */
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
     * @returns The role of the user. If the user is not in the board,
     *      observer if the board is public and "" otherwise
     */
    static getUserRole(idUser, board){
        if(!board) return ""
        let user = board.boardUsers.find(u => u.userId == idUser)
        if(user) return user.role
        else return (board.boardPrivacy == 0) ? "observer" : ""
    }
}
