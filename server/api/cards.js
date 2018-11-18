import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {Boards} from "../models/Boards";
import {boardUtils} from "./Utils/boardUtils";
import {canPerform,
        CREATE_CARD,
        EDIT_CARD,
        DELETE_CARD
    } from "./Utils/roles";


Meteor.methods({

    /**
     * Create a card in a board
     *
     * @param idBoard The id of the board where to add the card
     * @param idList The id of the list where to add the card
     * @returns the id of the board edited,
     *  an error if the board, list doesn't exist
     */
    'boards.card.createCard'(idBoard,idList) {
        let userId = this.userId
        let board = Boards.findOne({"_id": idBoard});

        if(board) {
            let userRole = boardUtils.getUserRole(userId, board)
            if (canPerform(userRole, CREATE_CARD)) {
                let listFound = false
                let id = Random.id();
                let newBoardLists = board.boardLists.map((list) => {
                    if (list._id == idList) {
                        let newCard = {
                            _id: id,
                            cardTitle: "New card",
                            cardLabels: [],
                            cardComments: [],
                            cardChecklists: [],
                            cardUsers: []
                        }
                        list.listCards.push(newCard)
                        listFound = true
                        return list
                    } else {
                        return list
                    }
                })
                if (!listFound) {
                    throw new Meteor.Error(404, 'List in Board not found')

                } else {
                    Boards.update({_id: board._id}, {
                        $set: {
                            boardLists: newBoardLists
                        }
                    })
                }
            } else {
                throw new Meteor.Error(404, 'Board not found')
            }
        }
    },

    /**
     * Edit a card in a board
     *
     * @param idBoard The id of the board where the card is
     * @param idList The id of the list where the card is
     * @param newCard The new card to insert
     * @returns the id of the board edited,
     *  an error if the board, list, card doesn't exist or if the user doesn't have the right to edit the card
     */
    'boards.card.editCard' (idBoard,idList,newCard) {
        let userId = this.userId
        let board = Boards.findOne({"_id": idBoard});
        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, EDIT_CARD)){
                //List
                let findList = false;
                let findCard = false;
                let newBoardLists = board.boardLists.map((list) => {
                    if(list._id == idList){
                        findList = true
                        list.listCards = list.listCards.map((card) => {
                            if (card._id == newCard._id) {
                                findCard = true
                                return newCard
                            } else {
                                return card
                            }
                        })
                        return list
                    }else{
                        return list
                    }
                })

                if(findList!=true){
                    throw new Meteor.Error(404, 'List in Board not found')
                }else if(findCard!=true) {
                    throw new Meteor.Error(404, 'Card in Board not found')
                }else{
                    {
                        Boards.update({_id: board._id},{
                            $set: {
                                boardLists: newBoardLists
                            }
                        })
                    }
                }
            } else
                throw new Meteor.Error(403, "You do not have permission to edit a card")
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Add a comment to a card in a board
     *
     * @param idBoard The id of the board where the card is
     * @param idList The id of the list where the card is
     * @param newCard The new card with the comment to insert
     * @returns the id of the board edited,
     *  an error if the board, list, card doesn't exist or if the user doesn't have the right to edit the card
     */
    'boards.card.addComment' (idBoard,idList,newCard) {
        let userId = this.userId
        let board = Boards.findOne({"_id": idBoard})

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, EDIT_CARD)){
                //List
                let findList = false;
                let findCard = false;
                let id = Random.id();

                let newComment  = newCard.cardComments[newCard.cardComments.length-1]
                //let newCommentI = {_id: id, commentContent: newComment.commentContent, userId: newComment.userId}
                newComment._id = id
                newCard.cardComments[newCard.cardComments.length-1] = newComment
                let newBoardLists = board.boardLists.map((list) => {
                    if(list._id == idList){
                        findList = true
                        list.listCards = list.listCards.map((card) => {
                            if (card._id == newCard._id) {
                                findCard = true
                                return newCard
                            } else {
                                return card
                            }
                        })
                        return list
                    }else{
                        return list
                    }
                })

                if(findList!=true){
                    throw new Meteor.Error(404, 'List in Board not found')
                }else if(findCard!=true) {
                    throw new Meteor.Error(404, 'Card in Board not found')
                }else{

                    {
                        Boards.update({_id: board._id},{
                            $set: {
                                boardLists: newBoardLists
                            }
                        })
                    }
                }
            } else
                throw new Meteor.Error(403, "You do not have permission to comment a card")
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Remove a card in a board
     *
     * @param idBoard The id of the board where the card is
     * @param idList The id of the list where the card is
     * @param idCard The card to remove
     * @returns the id of the board edited,
     *  an error if the board, list doesn't exist or if the user doesn't have the right to edit the card
     */
    'boards.card.removeCard' (idBoard,idList,idCard){
        let userId = this.userId
        let board = Boards.findOne({"_id": idBoard})
        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, DELETE_CARD)){
                //List
                let findList = false;
                let newBoardLists = board.boardLists.map((list) => {
                    if(list._id == idList){
                        findList = true
                        list.listCards = list.listCards.filter((card) => card._id!=idCard)
                        return list
                    }else{
                        return list
                    }
                })

                if(findList!=true){
                    throw new Meteor.Error(404, 'List in Board not found')
                }else{

                    {
                        Boards.update({_id: board._id},{
                            $set: {
                                boardLists: newBoardLists
                            }
                        })
                    }
                }
            } else
                throw new Meteor.Error(403, "You do not have permission to remove a card")
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    }
})
