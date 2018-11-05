import {Meteor} from "meteor/meteor";
import { Random } from 'meteor/random';
import { JsonRoutes } from 'meteor/simple:json-routes';
import {Cards} from "../models/Card";
import {Boards} from "../models/Boards";


Meteor.publish('cards', function () {return Cards.find()});

Meteor.methods({
    'cards.getCard' (idCard) {
        let countDoc = Cards.find({"_id": idCard}).count();
        console.log(countDoc)
        if (countDoc === 1) {
            let card = Cards.findOne({"_id": idCard});
            return card;
        } else {
            throw new Meteor.Error(404, 'List not found')
        }

    },

    'cards.editCard' (newCard) {
        return Cards.upsert({'_id': newCard._id},{
                    $set: {
                        cardTitle: newCard.cardTitle,
                        cardDescription: newCard.cardDescription

                    }
                })


    }

})