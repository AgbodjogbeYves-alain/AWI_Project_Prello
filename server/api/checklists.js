import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {Boards} from "../models/Boards";

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
        let board = findBoardWithChecklist(checklistId);

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
    },
    "checklists.addItem"(checklistId, itemName){
        let board = findBoardWithChecklist(checklistId);

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
    },
    "checklists.setItemChecked"(itemId, itemChecked){
        let board = findBoardWithItem(itemId);
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
    },
    "checklists.removeItem"(itemId){
        let board = findBoardWithItem(itemId);
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
    }
})