import {Boards} from "../models/Boards";
import {Meteor} from "meteor/meteor";
import {boardUtils} from "./Utils/boardUtils";
import {
    ACCESS_ARCHIVES,
    ACCESS_BOARD,
    ACCESS_CARD,
    ARCHIVE_CARD,
    canPerform,
    DELETE_BOARD,
    EDIT_BOARD_SETTINGS
} from './Utils/roles';


if(Meteor.isServer){

    Meteor.publish('boards', function () {
        let userId = this.userId;
        /* Should manage accuarately the access rights but make the board creation bugged
        let boards = Boards.find({boardUsers : {$elemMatch: {'userId': userId}}})
        let ids = boards.fetch().filter(b => {
            let role = boardUtils.getUserRole(userId, b)
            return canPerform(role, ACCESS_BOARD)
        }).map(b => b._id)
        return Boards.find({_id : {$in: ids}})
        */
        return Boards.find({boardUsers : {$elemMatch: {'userId': userId}}})
    });

}
Meteor.methods({

    /**
     * Create a board
     *
     * @param board The board to create
     * @returns the id of the board inserted if the user is connected, 
     *  an error otherwise
     */
    'boards.createBoard'(board) {
        if(Meteor.userId()){
            board.boardOwner = this.userId;
            return Boards.insert(board);
        }else{
            throw Meteor.Error(401, "You are not authenticated")
        }
    },

    /**
     * Get a board
     *
     * @param idBoard The id of the board to get
     * @returns the board with the id we search,
     *  an error if the board doesn't exist or the user doesn't have the right to acces the board
     */
    'boards.getBoard' (idBoard) {
        let userId = this.userId
        let board = Boards.findOne({"_id": idBoard});
        if (board) {
            let userRole = boardUtils.getUserRole(userId, board)
            // The user can access the board if he has the rights or the board is public
            if(canPerform(userRole, ACCESS_BOARD))
                return board
            else
                throw new Meteor.Error(403, 'You do not have permission to access the board')
        } else {
            throw new Meteor.Error(404, 'Board not found');
        }

    },

    /**
     * Remove a board
     *
     * @param boardId The id of the board to remove
     * @returns the number of element removed,
     *  an error if the board doesn't exist or the user doesn't have the right to remove the board
     */
    'boards.removeBoard'(boardId) {
        let userId = this.userId
        let board = Boards.findOne(boardId);

        if (board) {
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, DELETE_BOARD))
                return Boards.remove(boardId)
            else
                throw new Meteor.Error(403, "You do not have permission to delete the board")

        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Edit a board
     *
     * @param newBoard The new board to insert
     * @returns the id of the element edited,
     *  an error if the board doesn't exist or the user doesn't have the right to edit the board
     */
    'boards.editBoard' (newBoard) {
        let userId = this.userId
        let oldBoard = Boards.findOne({"_id": newBoard._id});
        if (oldBoard) {
            // Check if the user has the rights
            let userRole = boardUtils.getUserRole(userId, oldBoard)
            if(canPerform(userRole, EDIT_BOARD_SETTINGS)){
                Boards.update({_id: newBoard._id},{
                    $set: {
                        boardTitle: newBoard.boardTitle,
                        boardPrivacy: newBoard.boardPrivacy,
                        boardLists: newBoard.boardLists,
                        boardUsers: newBoard.boardUsers,
                        boardTeams: newBoard.boardTeams,
                        boardBackground: newBoard.boardBackground
                    }
                })
            } else
                throw new Meteor.Error(403, "You are not allowed to edit the board")
        }else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Get all the boards of a user
     *
     * @param userId The id of the user, which we want to get the boards
     * @returns the list of the board where the user is member,
     */
    'board.getUserAllBoards' (userId){
        let allBoards = Boards.find().fetch()
        let userBoard = []
        allBoards.map((board) => {
            if(boardUtils.checkInBoardUser(userId)){
                userBoard.push(board)
            }
        })
        return allBoards
    },

    /**
     * Get team in a board
     *
     * @param boardId The id of the board which we want to get the team
     * @returns the list of the teams in the board,
     *  an error if the board doesn't exist or the user doesn't have the right to access the board
     */
    'board.getTeam' (boardId){
        let userId = this.userId
        let board = Boards.findOne({"_id": boardId})
        if (board) {
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, ACCESS_BOARD))
                return board.boardTeams
            else
                throw new Meteor.Error(403, "You do not have permission to access this board")
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Get cards in a board
     *
     * @param boardId The id of the board which we want to get the cards
     * @returns the list of the cards in the board,
     *  an error if the board doesn't exist or the user doesn't have the right to access the cards
     */
    'board.getCards' (boardId) {
        let userId = this.userId
        let board = Boards.findOne({"_id": boardId});
        if (board) {
            // Check user's permission:
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, ACCESS_CARD)){
                let cards = []
                board.boardList.map((list) => {
                    // noinspection JSAnnotator
                    let theList = Meteor.call('getList',list._id)
                    theList.listCard.map((card) => {
                        cards.push(card)
                    })
                })
                return cards
            } else
                throw new Meteor.Error(403, "You do not have permission to access the cards")
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Get tags in a board
     *
     * @param boardId The id of the board, which we want to get the tags
     * @returns the list of the tags in the board,
     *  an error if the board doesn't exist or the user doesn't have the right to access the tags
     */
    'boards.getTags' (boardId) {
        let userId = this.userId
        let board = Boards.findOne({"_id": boardId});
        if (board) {
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userId, ACCESS_BOARD))
                return board.boardTags
            else
                throw new Meteor.Error(403, "You do not have permission to access the tags")
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Get lists in a board
     *
     * @param boardId The id of the board, which we want to get the lits
     * @returns the list of the lists in the board,
     *  an error if the board doesn't exist or the user doesn't have the right to access the lists
     */
    'boards.getLists' (boardId) {
        let userId = this.userId
        let lists = []
        let board = Boards.findOne({"_id": boardId});
        if (board) {
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, ACCESS_BOARD)){
                board.boardList.map((list) => {
                    let theList = Meteor.call('list.getList',list._id)
                    lists.push(theList)
                })
                return lists
            } else
                throw new Meteor.Error(403, "You do not have permission to access the lists")
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

})
