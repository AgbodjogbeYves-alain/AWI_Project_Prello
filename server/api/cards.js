import {Meteor} from "meteor/meteor";
import { Random } from 'meteor/random';
import { JsonRoutes } from 'meteor/simple:json-routes';
import {Cards} from "../models/Card";
import {Boards} from "../models/Boards";

Meteor.methods({
    'boards.card.createCard'(idBoard,idList) {
        let countDoc = Boards.find({"_id": idBoard}).count();
        let id = Random.id();

        if(countDoc==1){
            let find = false
            let board = (Boards.findOne({_id: idBoard}))
            let newBoardLists = board.boardLists.map((list) => {
                if(list._id == idList){
                    let newCard = {_id: id, cardTitle: "New card"}
                    list.listCard.push(newCard)
                    find = true
                    return list
                }else{
                    return list
                }
            })

            if(find!=true){
                throw new Meteor.Error(404, 'List in Board not found')
            }else{
                Boards.update({_id: board._id},{
                    $set: {
                        boardLists: newBoardLists
                    }
                })
            }
        }else{
            throw new Meteor.Error(404, 'Board not found')
        }
    },


    'cards.editCard' (newCard) {
        return Cards.upsert({'_id': newCard._id},{
                    $set: {
                        cardTitle: newCard.cardTitle,
                        //cardDescription: newCard.cardDescription
                    }
                })


    }

})