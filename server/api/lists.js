import {Lists} from "../models/List";
import {Meteor} from "meteor/meteor";
import  { Random } from 'meteor/random';
import {Boards} from "../models/Boards";

Meteor.methods({
    'boards.lists.createList'(idBoard) {
        let countDoc = Boards.find({"_id": idBoard}).count();
        if(countDoc==1){
            let board = (Boards.findOne({_id: idBoard}))
            let boardLists = board.boardLists
            let id = Random.id();
            let newList = {_id: id, listTitle: "New list", listCard: []}
            boardLists.push(newList)
            Boards.update({_id: board._id},{
                $set: {
                    boardLists: boardLists
                }
            })
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'boards.lists.deleteList'(idBoard,idList) {
        let countDoc = Boards.find({"_id": idBoard}).count();
        if (countDoc === 1) {
            let board = (Boards.findOne({_id: idBoard}))
            let boardLists = board.boardLists
            let newBoardList = boardLists.filter((list) => list._id!=idList)
            Boards.update({_id: idBoard},{
                $set: {
                    boardLists: newBoardList
                }
            })

        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'boards.lists.editList' (idBoard, newList) {

        let countDoc = Boards.find({"_id": idBoard}).count();
        if (countDoc === 1) {
            let board = (Boards.findOne({_id: idBoard}))
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
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'list.getAllList' (){


    }
})