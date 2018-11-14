import {Roles} from "../models/Role";
import {Meteor} from "meteor/meteor";
import {roles} from "../models/Roles";

Meteor.publish('roles', function () {
    return Roles.find({});
});