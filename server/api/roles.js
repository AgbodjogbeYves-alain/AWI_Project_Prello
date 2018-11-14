import {Roles} from "../models/Role";
import {Meteor} from "meteor/meteor";

Meteor.publish('roles', function () {
    return Roles.find({});
});