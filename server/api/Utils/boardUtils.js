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
}