import {Boards} from "../models/Boards";
import {Meteor} from "meteor/meteor";

Meteor.publish('boards', function () {return Boards.find()});

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
        return Boards.update({boardId: newBoard.boardId}, { $set: {
                boardTitle: newBoard.boardTitle
        }})

    },

    'getAllBoards' ({idUser}){

    }
})