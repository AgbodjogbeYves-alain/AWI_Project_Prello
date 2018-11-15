import {Boards} from "../models/Boards";
import {Meteor} from "meteor/meteor";
import {boardUtils} from "./Utils/boardUtils";
import {canPerform,
    ACCESS_BOARD,
    DELETE_BOARD,
    EDIT_BOARD_SETTINGS,
    ACCESS_CARD,
    ACCESS_ARCHIVES,
    ARCHIVE_CARD
    } from './Utils/roles';


if(Meteor.isServer){

    Meteor.publish('boards', function () {
        let userId = this.userId;
        let boards = Boards.find({boardUsers : {$elemMatch: {'userId': userId}}})
        /*let ids = boards.fetch().filter(b => {
            let role = boardUtils.getUserRole(userId, b)
            return canPerform(role, ACCESS_BOARD)
        }).map(b => b._id)
        */
        return boards
        //return Boards.find({_id : {$in: ids}})
    });

}
Meteor.methods({

    'boards.createBoard'(board) {
        if(Meteor.userId()){
            board.boardOwner = this.userId;
            return Boards.insert(board);
        }else{
            throw Meteor.Error(401, "You are not authenticated")
        }
    },

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

    /* Should not be used
    'board.getAllBoards' (){
        return Boards.find().fetch();
    },
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
                throw new Meteor.Error(403, "You do not have permission to access the tags")
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'board.archiveList' (boardId, listId) {
        let userId = this.userId
        let board = Boards.findOne({"_id": boardId})
        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, ACCESS_ARCHIVES)){
                // TODO: archive the list here
            }
        }
    },

    'board.archiveCard' (boardId, cardId) {
        let userId = this.userId
        let board = Boards.findOne({"_id": boardId})
        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, ARCHIVE_CARD)){
                // TODO: archive the card here
            }
        }
    }

})
