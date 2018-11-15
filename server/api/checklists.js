import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {Boards} from "../models/Boards";
import {boardUtils} from "./Utils/boardUtils";
import {canPerform,
        CREATE_CHECKLIST,
        EDIT_CARD
} from "./Utils/roles";

function findBoardWithChecklist(checklistId){
    return Boards.findOne({
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
}

function findBoardWithItem(itemId){
    return Boards.findOne({
        boardLists: {
            $elemMatch: {
                listCards: {
                    $elemMatch: {
                        cardChecklists: {
                            $elemMatch: {
                                checklistItems: {
                                    $elemMatch: {
                                        _id: itemId
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

Meteor.methods({
    "checklists.addChecklist"(cardId, checklistName){
        let userId = this.userId
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

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, CREATE_CHECKLIST)){
                let checklist = {
                    _id: Random.id(),
                    checklistName: checklistName,
                    checklistItems: []
                };
        
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
            } else 
                throw new Meteor.Error(403, "You do not have permission to create a checklist")
        } else 
            throw new Meteor.Error(404, "Board not found")
    },

    "checklists.removeChecklist"(checklistId){
        let userId = this.userId
        let board = findBoardWithChecklist(checklistId);

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
        
                return Boards.update(board._id, {$set: {boardLists: newLists}});
            } else
                throw new Meteor.Error(403, "You do not have permission to delete a checklist")
        } else 
            throw new Meteor.Error(404, "Board not found")
    },

    "checklists.addItem"(checklistId, itemName){
        let userId = this.userId
        let board = findBoardWithChecklist(checklistId);

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, CREATE_CHECKLIST)){

                let newLists = board.boardLists.map((list) => {
                    let newCards = list.listCards.map((card) => {
                        let newChecklists = card.cardChecklists.map((checklist) => {
                            if(checklist._id === checklistId){
                                checklist.checklistItems.push({
                                    _id: Random.id(),
                                    itemName: itemName
                                });
                            }
                            return checklist;
                        })
                        card.cardChecklists = newChecklists;
                        return card;
                    });
                    list.listCards = newCards;
                    return list;
                });
        
                return Boards.update(board._id, {$set: {boardLists: newLists}});
            } else
                throw new Meteor.Error(403, "You do not have permission to edit a checklist")
        } else
            throw new Meteor.Error(404, "Board not found")
    },

    "checklists.setItemChecked"(itemId, itemChecked){
        let userId = this.userId
        let board = findBoardWithItem(itemId);

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, EDIT_CARD)){

                let newLists = board.boardLists.map((list) => {
                    let newCards = list.listCards.map((card) => {
                        let newChecklists = card.cardChecklists.map((checklist) => {
                            let newItems = checklist.checklistItems.map((item) => {
                                if(item._id === itemId) item.itemChecked = itemChecked
                                return item
                            })
                            checklist.checklistItems = newItems
                            return checklist;
                        })
                        card.cardChecklists = newChecklists;
                        return card;
                    });
                    list.listCards = newCards;
                    return list;
                });
        
                return Boards.update(board._id, {$set: {boardLists: newLists}});
            } else
                throw new Meteor.Error(403, "You do not have permission to change a checklist")
        } else
            throw new Meteor.Error(404, "Board not found")
    },

    "checklists.removeItem"(itemId){
        let userId = this.userId
        let board = findBoardWithItem(itemId);

        if(board){
            let userRole = boardUtils.getUserRole(userId, board)
            if(canPerform(userRole, CREATE_CHECKLIST)){
                let newLists = board.boardLists.map((list) => {
                    let newCards = list.listCards.map((card) => {
                        let newChecklists = card.cardChecklists.map((checklist) => {
                            let newItems = checklist.checklistItems.filter((item) => item._id !== itemId)
                            checklist.checklistItems = newItems
                            return checklist;
                        })
                        card.cardChecklists = newChecklists;
                        return card;
                    });
                    list.listCards = newCards;
                    return list;
                });
        
                return Boards.update(board._id, {$set: {boardLists: newLists}});
            } else
                throw new Meteor.Error(403, "You do not have permission to edit a checklist")
        } else
            throw new Meteor.Error(404, "Board not found")
    }
})