// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

import { JsonRoutes } from 'meteor/simple:json-routes';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.startup(() => {
    require("../imports/api/server/BoardsRoutes")
});