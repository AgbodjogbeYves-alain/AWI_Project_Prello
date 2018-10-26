import { Meteor } from 'meteor/meteor';

import '../imports/api/users.js';

import { JsonRoutes } from 'meteor/simple:json-routes';
import  SimpleSchema  from 'simpl-schema';
import {Board} from "../imports/startup/server/models/Boards";

Meteor.startup(() => {
    require("../imports/api/BoardsRoutes")

});