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
        let countDoc = Lists.find({"_id": idList}).count();
        if (countDoc === 1) {
            let list = Lists.findOne({"_id": idList});
            return list;
        } else {
            throw new Meteor.Error(404, 'List not found')
        }

    },

    'list.deleteList'(idList) {

    },

    'lists.editList' (list) {
        let editedCards = []

        list.listCard.forEach((card) => {
            let result = Meteor.call('cards.editCard', card)
            let nCard;

            if(result.insertedId){
                nCard = Meteor.call('cards.getCard', result.insertedId)

            }else{
                nCard = card
            }

            editedCards.push(nCard)
        })
        return Lists.upsert({'_id': list._id}, {
            $set : {
                listTitle: list.listTitle,
                listCard: editedCards,

            }
        })
    },

    'list.getAllList' (){


    }
})