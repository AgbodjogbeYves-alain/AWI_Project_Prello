import { Mongo } from 'meteor/mongo'

export const Boards = new Mongo.Collection('boards')

import SimpleSchema from 'simpl-schema';
import {ListSchema} from "./List";
import { BoardUserSchema } from './BoardUser';
import { UserSchema } from './Users';
import { BoardTeamSchema } from './BoardTeam';
import {LabelsSchema} from "./Labels";

export const BoardSchema = new SimpleSchema({
  _id: {
      type: String,
      optional: true
  },
  boardTitle: {
      type: String,
      label: "Title",
      required: true
  },
  boardDescription: {
      type: String,
      label: "Description",
      required: false
  },
  boardBackground: {
      type: String,
      label: "Background",
      required: true
  },
  boardUsers: {
      type: Array,
      label: "Users",
      required: true
  },
  'boardUsers.$': BoardUserSchema, //se if need to replace Object with a schema
  boardPrivacy: {
      type: SimpleSchema.Integer,
      label: "Privacy",
      required: true
  },
  boardLists: {
      type: Array,
      label: "Lists",
      defaultValue: [],
  },
  'boardLists.$': ListSchema, //se if need to replace Object with a schema
  boardLabels: {
      type: Array,
      label: "Labels",
      defaultValue: []
  },
  'boardLabels.$': LabelsSchema, //se if need to replace Object with a schema*/
  boardTeams: {
      type: Array,
      label: "Teams",
      defaultValue: []
  },

  'boardTeams.$': BoardTeamSchema, //se if need to replace Object with a schema
  boardOwner : {
    type: UserSchema,
    label: "Owner"
    },
  boardCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

Boards.attachSchema(BoardSchema,{transform: true});