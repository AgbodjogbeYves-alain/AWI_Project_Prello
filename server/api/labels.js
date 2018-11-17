import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {JsonRoutes} from 'meteor/simple:json-routes';
import {Boards} from "../models/Boards";
import {Labels} from '../models/Labels';

Meteor.publish('labels', function () {
    return Labels.find();
});

Meteor.methods({

    /**
     * Add a label in a card
     *
     * @param idBoard The id of the board
     * @param newLabel The label to add
     * @returns the id of the label inserted,
     *  an error if the board doesn't exist
     */
    'labels.createLabel'(idBoard,newLabel) {
        let id = Random.id();
        let countDoc = Boards.find({_id: idBoard}).count();
        if(countDoc==1){
            Labels.insert(newLabel)
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /**
     * Remove a label in a card
     *
     * @param idLabel The id of the label
     * @returns the number of element removed,
     *  an error if the label doesn't exist
     */
    'labels.removeLabel' (idLabel){
        let countDoc = Labels.find({_id: idLabel}).count();
        if(countDoc==1){
            label = Labels.findOne({_id: idLabel})
            let countDocB = Boards.findOne({_id: label.labelBoard})
            if(countDocB ==1 ){
                let board = Boards.findOne({_id: label.labelBoard})
                let boardLabels = board.boardLabels
                let newBL = boardLabels.filter((labelId) => labelId != labal._id)
                Boards.update({_id: board._id},{
                    $set: {
                        boardLabels: newBL
                    }
                })
            }

            Labels.remove({_id: idLabel})
        }else{
            throw new Meteor.Error(404,"Label not found")
        }

    },
})