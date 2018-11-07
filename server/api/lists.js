import {Lists} from "../models/List";
import {Meteor} from "meteor/meteor";
import  { Random } from 'meteor/random';
import {Boards} from "../models/Boards";

Meteor.methods({
    'boards.list.createList'(idBoard) {
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