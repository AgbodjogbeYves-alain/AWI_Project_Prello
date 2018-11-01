import {Boards} from "../models/Boards";
import {Meteor} from "meteor/meteor";

Meteor.methods({
    'board.createBoard'({boardName, privacy}) {
        /*if(!Meteor.userId()){
            throw new Meteor.Error('Not Authorized')
        }else{*/
        let privacyInt = parseInt(privacy)
        let id = Math.random().toString(36).substr(2, 5).toUpperCase();
        return Boards.insert({boardId: id, boardTitle: boardName, boardPrivacy: privacyInt, boardUser: [Meteor.user()]})
    },

    'board.getBoard' ({idBoard}) {
        let board;
        let countDoc = Boards.find({"boardId": idBoard}).count();
        console.log(countDoc)
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": idBoard});
            return board;
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }

    },
    'board.deleteBoard'({idBoard}) {

    },

    'board.editBoard' (newBoard) {
        let newBoard2 = newBoard.newBoard
        Boards.update({boardId: newBoard2.boardId}, { $set: {
                boardTitle: newBoard2.boardTitle
        }})
        console.log(Boards.findOne({boardId: newBoard2.boardId}))
        return Boards.findOne({boardId: newBoard2.boardId})

    },

    'getAllBoards' ({idUser}){

    }
})