import {Lists} from "../models/List";
import {Meteor} from "meteor/meteor";
import { Random } from 'meteor/random';
import { JsonRoutes } from 'meteor/simple:json-routes';
import {Boards} from "../models/Boards";

Meteor.methods({
    'list.createList'(listName) {
        return Lists.insert({listTitle: listName})
    },

    'list.getList' (idList) {
        let countDoc = Lists.find({"_id": idList}).count();
        if (countDoc === 1) {
            let list = Lists.findOne({"_id": idList});
            return list;
        } else {
            throw new Meteor.Error(404, 'List not found')
        }

    },
    'list.deleteList'(idBoard, idList) {

    },

    'list.editList' (list) {
        let countDoc = Lists.find({"listId": list.listId}).count();
        console.log(countDoc)
            console.log("InList")

            let newList = Lists.upsert({listId: list.listId},{
                $set : {
                    listCard: list.listCard,
                    listTitle: list.listTitle
                }
            })

            console.log(newList)


            /*Boards.update({boardId: newBoard.boardId}, {
                $set: {
                    boardTitle: newBoard.boardTitle,
                    boardPrivacy: newBoard.privacy,
                    boardUsers: newBoard.boardUsers
                }

            })*/
            /*newBoard.boardList.forEach((list) => {
                     Boards.update({boardId: newBoard.boardId, 'boardList.listId': list.listId}, {
                         $set: {
                             "boardList.list.listCard.$[]": list.listCard,
                         }

                     })
                 })



            /*newBoard.boardList.forEach((list) => {
                Boards.update({boardId: newBoard.boardId, "boardList.listId": list.listId}, {
                    $set: {
                        boardTitle: newBoard.boardTitle,
                        boardPrivacy: newBoard.privacy,
                    }
                })
            })
        }else {
            throw new Meteor.Error(404, 'Board not found')
        }*/
    },

    'list.getAllList' (){

    }
})

// code to run on server at startup
JsonRoutes.Middleware.use(function(req, res, next) {
    if(req.query.error) {
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                result: "ERROR"
            }
        })
    }

    next();
});


JsonRoutes.add('post', '/signUp/', function(req, res, next) {
    console.log(req)
    Meteor.users.insert({
        username: req.body.state.username,
        firstname: req.body.state.firstname,
        lastname: req.body.state.lastname,
        password: req.body.state.password,
        email: req.body.state.email
    })
    JsonRoutes.sendResult(res, {
        data: {
            result: Meteor.users.find().fetch()
        }
    });
});

