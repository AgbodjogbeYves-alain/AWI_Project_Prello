import {Lists} from "../models/List";
import {Meteor} from "meteor/meteor";
import { Random } from 'meteor/random';

Meteor.publish('lists', function () {return Lists.find()});

Meteor.methods({
    'lists.createList'(listName) {
        let id = Random.id();
        return Lists.insert({listId: id, listTitle: listName})
    },

    'lists.getList' (idList) {
        let countDoc = Lists.find({"listId": idList}).count();
        if (countDoc === 1) {
            let list = List.findOne({"listId": idList});
            return list;
        } else {
            throw new Meteor.Error(404, 'List not found')
        }

    },
    'lists.deleteList'({idBoard}) {

    },

    'lists.editList' ({idBoard,newParams}) {

    },

    'lists.getAllList' ({idUser}){

    }
})