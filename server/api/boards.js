import {Boards} from "../models/Boards";
import {Meteor} from "meteor/meteor";
import {boardUtils} from "./Utils/boardUtils";

Meteor.publish('boards', function () {
    return Boards.find({
        $or: [
            {boardUsers : {$elemMatch: {_id: userId}}},
            {"boardOwner._id": userId},
        ]
    })
});

Meteor.methods({

    'boards.createBoard'(board) {
        if(Meteor.userId()){
            board.boardOwner = this.userId;
            return Boards.insert(board);
        }else{
            throw Meteor.Error(401, "You are not authentificated")
        }
    },

    'boards.getBoard' (idBoard) {
        let board;
        let countDoc = Boards.find({"boardId": idBoard}).count();
        console.log(countDoc)
        if (countDoc === 1) {
            board = Boards.findOne({"boardId": idBoard});
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
        console.log(countDoc)
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
        
        let board = Boards.findOne(boardId);

        if (countDoc === 1) {
            if(!this.userId) throw new Meteor.Error('not-authorised');
            let isTeamMember = board.boardUsers.filter((u) => u.user_id == this.userId && u.boardRole == 'admin').length > 0;
            if(this.userId != team.boardOwner._id && !isTeamMember) throw new Meteor.Error('not-authorised');

            return Boards.remove(boardId);
        } else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

    'boards.editBoard' (newBoard) {
        let countDoc = Boards.find({"boardId": newBoard.boardId}).count();
        if (countDoc === 1) {
            Boards.update({boardId: newBoard.boardId}, {
                $set: {
                    boardTitle: newBoard.boardTitle,
                    boardPrivacy: newBoard.privacy,
                    boardUsers: newBoard.boardUsers
                }

            })

           /*newBoard.boardList.forEach((list) => {
                    Boards.update({boardId: newBoard.boardId, 'boardList.listId': list.listId}, {
                        $set: {
                            "boardList.list.listCard.$[]": list.listCard,
                        }

                    })
                })*/



            /*newBoard.boardList.forEach((list) => {
                Boards.update({boardId: newBoard.boardId, "boardList.listId": list.listId}, {
                    $set: {
                        boardTitle: newBoard.boardTitle,
                        boardPrivacy: newBoard.privacy,
                    }
                })
            })*/
        }else {
            throw new Meteor.Error(404, 'Board not found')
        }
    },

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
