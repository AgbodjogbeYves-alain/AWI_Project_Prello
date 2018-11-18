import {Lists} from "../models/List";
import {Meteor} from "meteor/meteor";
import  { Random } from 'meteor/random';
import {Boards} from "../models/Boards";
import {boardUtils} from "./Utils/boardUtils";
import {canPerform,
        EDIT_BOARD_SETTINGS
} from "./Utils/roles"

Meteor.methods({

    /**
     * Create a list in a card
     *
     * @param idBoard The id of the board
     * @returns the id of board edited,
     *  an error if the board doesn't exist or if he user doesn't have the right to add a list
     */
    'boards.lists.createList'(idBoard) {
        let userId = this.userId
        let board = Boards.findOne({"_id": idBoard})
        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, EDIT_BOARD_SETTINGS)){
                let boardLists = board.boardLists
                let id = Random.id();
                let newList = {_id: id, listTitle: "New list", listCards: [], listArchived: false}
                boardLists.push(newList)
                Boards.update({_id: board._id},{
                    $set: {
                        boardLists: boardLists
                    }
                })
            } else
                throw new Meteor.Error(403, "You do not have permission to create a list")            
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Delete a list in a card
     *
     * @param idBoard The id of the Board
     * @param idList the id ot the List
     * @returns the id of board edited,
     *  an error if the board doesn't exist or if he user doesn't have the right to delete a list
     */
    'boards.lists.deleteList'(idBoard,idList) {
        let userId = this.userId
        let board = Boards.findOne({"_id": idBoard})
        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, EDIT_BOARD_SETTINGS)){
                let boardLists = board.boardLists
                let newBoardList = boardLists.filter((list) => list._id!=idList)
                Boards.update({_id: idBoard},{
                    $set: {
                        boardLists: newBoardList
                    }
                })
            } else
                throw new Meteor.Error(403, "You do not have permission to delete a list")            
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Edit a list in a card
     *
     * @param idBoard The id of the board
     * @param newList The new list 
     * @returns the id of board edited,
     *  an error if the board doesn't exist or if he user doesn't have the right to edit a list
     */
    'boards.lists.editList' (idBoard, newList) {
        let userId = this.userId
        let board = Boards.findOne({"_id": idBoard})
        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, EDIT_BOARD_SETTINGS)){
                let boardLists = board.boardLists
                let newBoardList = boardLists.map((list) => {
                    if(list._id == newList._id){
                        return newList
                    }else{
                        return list
                    }
                })

                Boards.update({_id: idBoard},{
                    $set: {
                        boardLists: newBoardList
                    }
                })
            } else
                throw new Meteor.Error(403, "You do not have permission to edit a list")            
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    }
})