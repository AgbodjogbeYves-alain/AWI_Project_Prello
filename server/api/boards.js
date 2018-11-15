import {Boards} from "../models/Boards";
import {Meteor} from "meteor/meteor";
import {boardUtils} from "./Utils/boardUtils";
import {canPerform, ACCESS_BOARD, DELETE_BOARD, EDIT_BOARD_SETTINGS } from './Utils/roles';

Meteor.publish('boards', function () {
    let userId = this.userId;
    let boards = Boards.find({boardUsers : {$elemMatch: {'userId': userId}}})
    let ids = boards.fetch().filter(b => {
        let role = boardUtils.getUserRole(userId, b)
        return canPerform(role, ACCESS_BOARD)
    }).map(b => b._id)
    return Boards.find({_id : {$in: ids}})
});

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
        let board;
        let countDoc = Boards.find({"boardId": idBoard}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": idBoard});
            let userRole = boardUtils.getUserRole(userId, board)
            // The user can access the board if he has the rights or the board is public
            if(canPerform(userRole, ACCESS_BOARD) || board.boardPrivacy == 0)
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
        let board;
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
            //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
            return board.boardTeams;
            //}else{
            //  return Meteor.Error(403, "You are not allow to delete this board")
            //}

            //}else{
            //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'board.getCards' (boardId) {
        let board;
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
            //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
            let cards = []
            board.boardList.map((list) => {
                // noinspection JSAnnotator
                let theList = Meteor.call('getList',list._id)
                theList.listCard.map((card) => {
                    cards.push(card)
                })
            })

            return cards
            //}else{
            //  return Meteor.Error(403, "You are not allow to delete this board")
            //}

            //}else{
            //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'boards.getTags' (boardId) {
        let board
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
            //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
            return board.boardTags
            //}else{
            //  return Meteor.Error(403, "You are not allow to delete this board")
            //}

            //}else{
            //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'boards.getLists' (boardId) {
        let board
        let lists = []
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
            //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
            board.boardList.map((list) => {
                let theList = Meteor.call('list.getList',list._id)
                lists.push(theList)
            })
            return lists
            //}else{
            //  return Meteor.Error(403, "You are not allow to delete this board")
            //}

            //}else{
            //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },
    'board.archiveList' (boardId,listId) {

    },

    'board.archiveCard' (boardId, cardId) {

    }

})
