import { Meteor } from 'meteor/meteor';

import '../imports/api/users.js';

import { JsonRoutes } from 'meteor/simple:json-routes';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.startup(() => {
    require("../imports/api/server/BoardsRoutes")
});