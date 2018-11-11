import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {JsonRoutes} from 'meteor/simple:json-routes';
import {Boards} from "../models/Boards";

Meteor.methods({
    'boards.card.createCard'(idBoard,idList) {
        let countDoc = Boards.find({"_id": idBoard}).count();
        let id = Random.id();

        if(countDoc==1){
            let find = false
            let board = (Boards.findOne({_id: idBoard}))
            let newBoardLists = board.boardLists.map((list) => {
                if(list._id == idList){
                    let newCard = {_id: id, cardTitle: "New card"}
                    list.listCard.push(newCard)
                    find = true
                    return list
                }else{
                    return list
                }
            })

            if(find!=true){
                throw new Meteor.Error(404, 'List in Board not found')
            }else{
                Boards.update({_id: board._id},{
                    $set: {
                        boardLists: newBoardLists
                    }
                })
            }
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },


    'boards.card.editCard' (idBoard,idList,newCard) {
        let countDoc = Boards.find({"_id": idBoard}).count();
        if(countDoc==1){
            //List
            let findList = false;
            let findCard = false;
            let board = (Boards.findOne({_id: idBoard}))
            let newBoardLists = board.boardLists.map((list) => {
                if(list._id == idList){
                    findList = true
                    list.listCard = list.listCard.map((card) => {
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
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }


    },


    'boards.card.addComment' (idBoard,idList,newCard) {
        let countDoc = Boards.find({"_id": idBoard}).count();
        let id = Random.id();


        if(countDoc==1){
            //List
            let findList = false;
            let findCard = false;
            let board = (Boards.findOne({_id: idBoard}))
            let newComment  = newCard.cardComments[newCard.cardComments.length-1]
            //let newCommentI = {_id: id, commentContent: newComment.commentContent, userId: newComment.userId}
            newComment._id = id
            console.log(newComment)
            newCard.cardComments[newCard.cardComments.length-1] = newComment
            let newBoardLists = board.boardLists.map((list) => {
                if(list._id == idList){
                    findList = true
                    list.listCard = list.listCard.map((card) => {
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
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }


    }

})