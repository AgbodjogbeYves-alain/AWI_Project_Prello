// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

import { JsonRoutes } from 'meteor/simple:json-routes';
import {Users} from '../imports/startup/server/models/Users'
import Card from "../imports/startup/server/models/Card.js"

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
        Card.insert({
            cardtitle: "oui",
            description: "non"
        })
        JsonRoutes.sendResult(res, {
            data: {
                result: Card.find().fetch()
            }
        });
    });
});