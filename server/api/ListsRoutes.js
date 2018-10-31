import {Lists} from "../models/List";
import {Meteor} from "meteor/meteor";
import { Random } from 'meteor/random';
import { JsonRoutes } from 'meteor/simple:json-routes';


Meteor.methods({
    'createList'(listName) {
        let id = Random.id();
        return Lists.insert({listId: id, listTitle: listName})
    },

    'getList' (idList) {
        let countDoc = Lists.find({"listId": idList}).count();
        if (countDoc === 1) {
            list = List.findOne({"listId": idList});
            return list;
        } else {
            throw new Meteor.Error(404, 'List not found')
        }

    },
    'deleteList'({idBoard}) {

    },

    'editList' ({idBoard,newParams}) {

    },

    'getAllList' ({idUser}){

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


