import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {JsonRoutes} from 'meteor/simple:json-routes';
import {Boards} from "../models/Boards";
import {boardUtils} from "./Utils/boardUtils"
import {canPerform,
        EDIT_CARD
} from "./Utils/roles"

Meteor.methods({
    'boards.comment.addComment' (idBoard,idList,idCard, newComment) {
        let userId = this.userId
        let board = Boards.find({"_id": idBoard})

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, EDIT_CARD)){
                //List
                let id = Random.id();
                let findList = false;
                let findCard = false;
                let newBoardLists = board.boardLists.map((list) => {
                    if(list._id == idList){
                        findList = true
                        list.listCard = list.listCard.map((card) => {
                            if (card._id == idCard) {
                                findCard = true
                                let newCommentTab = card.cardComments
                                let newCommentI = {_id: id, commentContent: newComment.commentContent, userId: newComment.userId}
                                newCommentTab.push(newCommentI)
                                card.cardComments = newCommentTab
                                return card
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
                    Boards.update({_id: board._id},{
                        $set: {
                            boardLists: newBoardLists
                        }
                    })
                }
            } else
                throw new Meteor.Error(403, "You do not have the permission to comment a card")
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    }
})