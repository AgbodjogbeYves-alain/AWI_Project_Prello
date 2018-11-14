import {Roles} from "../models/Role";
import {Meteor} from "meteor/meteor";

Meteor.publish('roles', function () {
    console.log(Roles.find({}));
    return Roles.find({})
});