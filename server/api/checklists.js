import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {Boards} from "../models/Boards";

Meteor.methods({
    "checklists.addChecklist"(cardId, checklistName){
        let checklist = {
            _id: Random.id(),
            checklistName: checklistName,
            checklistItems: []
        };

        let board = Boards.findOne({
            boardLists: {
                $elemMatch: {
                    listCards: {
                        $elemMatch: {
                            _id: cardId
                        }
                    }
                }
            }
        });

        let newLists = board.boardLists.map((list) => {
            let newCards = list.listCards.map((card) => {
                if(card._id === cardId){
                    card.cardChecklists.push(checklist);
                } 
                return card
            });
            list.listCards = newCards;
            return list;
        });

        return Boards.update(board._id, {$set: {boardLists: newLists}});
    },
    "checklists.removeChecklist"(checklistId){
        let board = Boards.findOne({
            boardLists: {
                $elemMatch: {
                    listCards: {
                        $elemMatch: {
                            cardChecklists: {
                                $elemMatch: {
                                    _id: checklistId
                                }
                            }
                        }
                    }
                }
            }
        });
        let newLists = board.boardLists.map((list) => {
            let newCards = list.listCards.map((card) => {
                let newChecklists = card.cardChecklists.filter((checklist) => {
                    return checklist._id !== checklistId
                })
                card.cardChecklists = newChecklists;
                return card;
            });
            list.listCards = newCards;
            return list;
        });

        return Boards.update(board._id, {$set: {boardLists: newLists}});
    }
})