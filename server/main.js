import { Meteor } from 'meteor/meteor';

import './api/users.js';

import { JsonRoutes } from 'meteor/simple:json-routes';
import  SimpleSchema  from 'simpl-schema';
import {Board} from "./models/Boards.js";
import {Users} from './models/Users'
import Card from "./models/Card.js"

Meteor.startup(() => {
    require("./api/BoardsRoutes")
    require("./api/ListsRoutes")
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