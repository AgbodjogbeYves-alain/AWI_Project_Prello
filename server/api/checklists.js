import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {Boards} from "../models/Boards";
import {boardUtils} from "./Utils/boardUtils";
import {canPerform,
    CREATE_CHECKLIST,
    EDIT_CARD
} from "./Utils/roles";
import { Checklists } from "../models/Checklists";

Meteor.publish("checklists", () =>{
    const userId = Meteor.userId()
    let boards = Boards.find({boardUsers : {$elemMatch: {'userId': userId}}}).map((b) => b._id);
    if(boards) return Checklists.find();
});

function findBoardWithCard(cardId){
    return Boards.findOne({
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
}

Meteor.methods({
    "checklists.addChecklist"(cardId, checklistName){
        let userId = this.userId;
        let board = findBoardWithCard(cardId);
        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, CREATE_CHECKLIST)){
                let checklistId = Checklists.insert({checklistName: checklistName, boardId: board._id});

                //TODO => Replace with card.boardId
                let newLists = board.boardLists.map((list) => {
                    let newCards = list.listCards.map((card) => {
                        if(card._id == cardId) card.cardChecklists.push(checklistId);
                        return card;
                    });
                    list.listCards = newCards;
                    return list;
                });

                return Boards.update(board._id,{$set: {boardLists: newLists}});

            } else
                throw new Meteor.Error(403, "You do not have permission to create a checklist")
        } else
            throw new Meteor.Error(404, "Board not found")
    },

    "checklists.removeChecklist"(checklistId){
        let userId = this.userId
        let checklist = Checklists.findOne(checklistId)
        let board = Boards.findOne(checklist.boardId);

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, CREATE_CHECKLIST)){
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

                Checklists.remove(checklistId);

                return Boards.update(board._id, {$set: {boardLists: newLists}});
            } else
                throw new Meteor.Error(403, "You do not have permission to delete a checklist")
        } else
            throw new Meteor.Error(404, "Board not found")
    },

    "checklists.addItem"(checklistId, itemName){
        let userId = this.userId
        let checklist = Checklists.findOne(checklistId);
        let board = Boards.findOne(checklist.boardId);

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, CREATE_CHECKLIST)){

                return Checklists.update(checklistId, {
                    $push: {
                        checklistItems: {
                            _id: Random.id(),
                            itemName: itemName
                        }
                    }
                });
            } else
                throw new Meteor.Error(403, "You do not have permission to edit a checklist")
        } else
            throw new Meteor.Error(404, "Board not found")
    },

    "checklists.setItemChecked"(itemId, itemChecked){
        let userId = this.userId
        let checklist = Checklists.findOne({
            checklistItems: {
                $elemMatch: {
                    _id: itemId
                }
            }
        });
        let board = Boards.findOne(checklist.boardId);

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, EDIT_CARD)){

                return Checklists.update({
                    checklistItems: {
                        $elemMatch: {
                            _id: itemId
                        }
                    }
                },{
                    $set: {
                        "checklistItems.$.itemChecked": itemChecked
                    }
                });

            } else
                throw new Meteor.Error(403, "You do not have permission to change a checklist")
        } else
            throw new Meteor.Error(404, "Board not found")
    },

    "checklists.removeItem"(itemId){
        let userId = this.userId
        let checklist = Checklists.findOne({
            checklistItems: {
                $elemMatch: {
                    _id: itemId
                }
            }
        })
        let board = Boards.findOne(checklist.boardId);

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, CREATE_CHECKLIST)){

                return Checklists.update(checklist._id,{
                    $pull: {
                        checklistItems: {
                            _id: itemId
                        }
                    }
                });

            } else
                throw new Meteor.Error(403, "You do not have permission to edit a checklist")
        } else
            throw new Meteor.Error(404, "Board not found")
    },
    "checklists.addManyChecklist"(checklists){
        let userId = this.userId;

        checklists.forEach(checklist => {
            let board = Boards.findOne(checklist.boardId);
            if(board){
                let userRole = boardUtils.getUserRole(userId, board)
                if(canPerform(userRole, CREATE_CHECKLIST)){
                    return Checklists.insert(checklist);
                } else
                    throw new Meteor.Error(403, "You do not have permission to create a checklist")
            } else
                throw new Meteor.Error(404, "Board not found")
        });
    }
})
