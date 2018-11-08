import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema';
import {UserSchema} from './Users.js'
import {TeamMembers} from './TeamMembers.js'

export const Teams = new Mongo.Collection('teams');

export const TeamSchema = new SimpleSchema({
    _id: {
        type: SimpleSchema.RegEx.Id
    },
    teamName: {
        type: String,
        label: "Name",
    },
    teamDescription: {
        type: String,
        label: "Description",
        defaultValue: "" 
    },
    teamOwner : {
        type: UserSchema,
        label: "Owner"
    },
    teamMembers:{
        type: Array,
        label : "Members",
        defaultValue: []
    },
    'teamMembers.$': TeamMembers
});


Teams.attachSchema(TeamSchema);