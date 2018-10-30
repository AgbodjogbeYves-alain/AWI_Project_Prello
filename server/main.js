import { Meteor } from 'meteor/meteor';

import '../imports/api/users.js';

import { JsonRoutes } from 'meteor/simple:json-routes';
import  SimpleSchema  from 'simpl-schema';
import {Board} from "../imports/startup/server/models/Boards";
import {Users} from '../imports/startup/server/models/Users'
import Card from "../imports/startup/server/models/Card.js"

Meteor.startup(() => {
    require("../imports/api/BoardsRoutes")

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