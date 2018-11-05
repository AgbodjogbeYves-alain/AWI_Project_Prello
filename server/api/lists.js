import {Lists} from "../models/List";
import {Meteor} from "meteor/meteor";
import { Random } from 'meteor/random';
import { JsonRoutes } from 'meteor/simple:json-routes';


Meteor.methods({
    'list.createList'(listName) {
        return Lists.insert({listTitle: listName})
    },

    'list.getList' (idList) {
        let countDoc = Lists.find({"_id": idList}).count();
        if (countDoc === 1) {
            let list = List.findOne({"_id": idList});
            return list;
        } else {
            throw new Meteor.Error(404, 'List not found')
        }

    },
    'list.deleteList'(idBoard, idList) {

    },

    'list.editList' (list) {

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

