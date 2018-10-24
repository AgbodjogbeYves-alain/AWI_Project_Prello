// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

import { JsonRoutes } from 'meteor/simple:json-routes';
import {Board} from '../imports/startup/server/models/Boards'

Meteor.startup(() => {

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

    Meteor.methods({
        'createBoard' ({boardName}){
            new SimpleSchema({
                boardName: { type: String },
            }).validate({ boardName });

            Board.insert(boardName)

        }
    })
});