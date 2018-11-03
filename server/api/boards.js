import {Boards} from "../models/Boards";
import {Meteor} from "meteor/meteor";

Meteor.publish('boards', function () {return Boards.find()});

Meteor.methods({
    'boards.createBoard'(board) {
        board.boardUsers = [Meteor.user()];
        return Boards.insert(board);
    },

    'board.getBoard' ({idBoard}) {
        let board;
        let countDoc = Boards.find({"boardId": idBoard}).count();
        console.log(countDoc)
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": idBoard});
            return board;
        } else {
            throw new Meteor.Error(404, 'Board not found');
        }

    },

    'boards.removeBoard'(boardId) {
        return Boards.remove(boardId);
    },

    'boards.editBoard' (newBoard) {
        return Boards.update(newBoard._id, { $set: {
                boardTitle: newBoard.boardTitle,
                boardPrivacy: newBoard.boardPrivacy
        }})

    },

    'getAllBoards' ({idUser}){

    }
})