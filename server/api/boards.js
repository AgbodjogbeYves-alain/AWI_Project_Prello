import {Boards} from "../models/Boards";
import {Meteor} from "meteor/meteor";
import {boardUtils} from "./Utils/boardUtils";

Meteor.publish('boards', function () {return Boards.find()});

Meteor.methods({

    'boards.createBoard'(board) {
        if(Meteor.userId()){
            return Boards.insert(board);
        }else{
            throw Meteor.Error(401, "You are not authentificated")
        }
    },

    'boards.getBoard' (idBoard) {
        let board;
        let countDoc = Boards.find({"_id": idBoard}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"_id": idBoard});
            //if(board.boardPrivacy == 1){
              //  if(Meteor.userId()){
                //    if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
                  //      return board
                    //}else{
                      //  return Meteor.Error(403, "You are not on this allow to see this board")
                    //}

                //}else{
                //    return Meteor.Error(401, "You are not authentificated")
                //}
            //}else{
                return board
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found');
        }

    },

    /*'boards.getBoardFromExt' (idBoard,token) {
        let decodedToken = "xd"
        let board;
        let countDoc = Boards.find({"_id": idBoard}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": idBoard});
            if(board.boardPrivacy == 1){
                if(token.userId){
                    if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
                        return board
                    }else{
                        return Meteor.Error(403, "You are not on this allow to see this board")
                    }

                }else{
                    return Meteor.Error(401, "You are not authentificated")
                }
            }
            return board;
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },*/

    'boards.removeBoard'(boardId) {
        let board;
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
              //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
                    return Boards.remove(boardId);
                //}else{
                  //  return Meteor.Error(403, "You are not allow to delete this board")
                //}

            //}else{
              //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    /*'boards.editBoard' (newBoard) {
        let countDoc = Boards.find({"_id": newBoard._id}).count();
        let newLists = []
        if (countDoc === 1) {
            Meteor.call('board.list.createList', 'zmoihrzmoeirhg', 'blabla')
        }

        /*newBoard.boardLists.forEach((list) => {
            let result = Meteor.call('lists.editList', list)
            let nList;


            if(result.insertedId){
                nList = Meteor.call('lists.getList', result.insertedId)
            }else{
                nList = Meteor.call('lists.getList', list._id)
            }

            newLists.push(nList)
        })

            Boards.upsert({_id: newBoard._id},{
                $set: {
                    boardTitle: newBoard.boardTitle,
                    boardPrivacy: newBoard.boardPrivacy,
                    boardLists: newLists,
                    boardUsers: newBoard.boardUsers,
                    boardTeams: newBoard.boardTeams
                }
            })

        }else {

            throw new Meteor.Error(404, 'Board not found')
        }
    },*/

    'board.getAllBoards' (){
        return Boards.find().fetch();
    },

    'board.getUserAllBoards' (userId){
        let allBoards = Boards.find().fetch()
        let userBoard = []
        allBoards.map((board) => {
            if(boardUtils.checkInBoardUser(userId)){
                userBoard.push(board)
            }
        })

        return allBoards

    },

    'board.getTeam' (boardId){
        let board;
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
            //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
            return board.boardTeams;
            //}else{
            //  return Meteor.Error(403, "You are not allow to delete this board")
            //}

            //}else{
            //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },
    'board.getCards' (boardId) {
        let board;
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
            //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
            let cards = []
            board.boardList.map((list) => {
                // noinspection JSAnnotator
                let theList = Meteor.call('getList',list._id)
                theList.listCard.map((card) => {
                    cards.push(card)
                })
            })

            return cards
            //}else{
            //  return Meteor.Error(403, "You are not allow to delete this board")
            //}

            //}else{
            //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'boards.getTags' (boardId) {
        let board
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
            //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
            return board.boardTags
            //}else{
            //  return Meteor.Error(403, "You are not allow to delete this board")
            //}

            //}else{
            //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'boards.getLists' (boardId) {
        let board
        let lists = []
        let countDoc = Boards.find({"_id": boardId}).count();
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": boardId});
            //if(Meteor.userId()){
            //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
            board.boardList.map((list) => {
                let theList = Meteor.call('list.getList',list._id)
                lists.push(theList)
            })
            return lists
            //}else{
            //  return Meteor.Error(403, "You are not allow to delete this board")
            //}

            //}else{
            //  return Meteor.Error(401, "You are not authentificated")
            //}
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },
    'board.archiveList' (boardId,listId) {

    },

    'board.archiveCard' (boardId, cardId) {

    }

})
