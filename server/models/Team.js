import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema';
import {UserSchema} from './Users.js'
import {TeamMembers} from './TeamMembers.js'

export const Team = new Mongo.Collection('teams');

const TeamSchema = new SimpleSchema({
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
        type: String,
        label: "Owner"
    },
    teamMembers:{
        type: Array,
        label : "Members",
        defaultValue: []
    },
    'teamMembers.$': TeamMembers
});


Team.attachSchema(TeamSchema);