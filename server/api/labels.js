import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {JsonRoutes} from 'meteor/simple:json-routes';
import {Boards} from "../models/Boards";
import {Labels} from '../models/Labels';

if(Meteor.isServer) {
    Meteor.publish('labels', function () {
        return Labels.find();
    });
}

Meteor.methods({
    'labels.createLabel'(idBoard,newLabel) {
        let id = Random.id();
        let countDoc = Boards.find({_id: idBoard}).count();
        if(countDoc==1){
            Labels.insert(newLabel)
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'labels.removeLabel' (idBoard,idLabel){

    },

    'labels.editLabel' (idBoard,newLabel){

    }
})