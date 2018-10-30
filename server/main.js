import { Meteor } from 'meteor/meteor';

import './api/users.js';

Meteor.startup(() => {
    require("./api/BoardsRoutes")

});