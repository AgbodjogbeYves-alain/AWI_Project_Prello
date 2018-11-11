import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {JsonRoutes} from 'meteor/simple:json-routes';
import {Boards} from "../models/Boards";
import {Labels} from '../models/Labels';

Meteor.publish('labels', function () {
    return Labels.find({})
});

Meteor.methods({
    'labels.createLabel'(idBoard,newLabel) {
        let id = Random.id();
        let countDoc = Boards.find({_id: idBoard}).count();
console.log(idBoard)
        if(countDoc==1){
            let board = (Boards.findOne({_id: idBoard}))
            let newBoardLabels = board.boardLabels

            let newLabelId = Labels.insert(newLabel)
            newBoardLabels.push(newLabelId)

            Boards.update({_id: idBoard},{
                $set:{
                    boardLabels: newBoardLabels
                }
            })
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'labels.removeLabel' (idBoard,idLabel){

    },

    'labels.editLabel' (idBoard,newLabel){

    }
})