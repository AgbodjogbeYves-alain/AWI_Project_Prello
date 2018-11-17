import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {Boards} from "../models/Boards";
import {boardUtils} from "./Utils/boardUtils";
import {canPerform,
        CREATE_CHECKLIST,
        EDIT_CARD
} from "./Utils/roles";

/**
 * get a board with the given checklist
 *
 * @param checklistId The id of the checklist
 * @returns the board with the checklist,
 */
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

/**
 * get a board with the given checlist item
 *
 * @param itemId The id of the checlist item
 * @returns the board with the checlist item,
 */
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
    /**
     * Add a checklist to a card in a board
     *
     * @param cardId The id of the card
     * @param checklistName The name of the checklist to add
     * @returns the id of the board edited,
     *  an error if the board doesn't exist or if the user doesn't have the right to edit the card
     */
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

    /**
     * Remove a checklist to a card in a board
     *
     * @param checklistId The id of the checklist to remove
     * @returns the id of the board edited,
     *  an error if the board doesn't exist or if the user doesn't have the right to edit the card
     */
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

    /**
     * Add an item to a checklist
     *
     * @param checklistId The id of the checklist
     * @param itemName The name of the item to add
     * @returns the id of the board edited,
     *  an error if the board doesn't exist or if the user doesn't have the right to edit the card
     */
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

    /**
     * Set an item in a checklist
     *
     * @param itemId The id of the item
     * @param itemChecked The new value for the checked
     * @returns the id of the board edited,
     *  an error if the board doesn't exist or if the user doesn't have the right to edit the card
     */
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

    /**
     * Remove an item in a checklist
     *
     * @param itemId The id of the item
     * @returns the id of the board edited,
     *  an error if the board doesn't exist or if the user doesn't have the right to edit the card
     */
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