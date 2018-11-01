import { Mongo } from 'meteor/mongo'

export const Boards = new Mongo.Collection('boards')

import SimpleSchema from 'simpl-schema';

BoardSchema = new SimpleSchema({
  boardTitle: {
      type: String,
      label: "Title",
      required: true
  },
  boardUsers: {
      type: Array,
      label: "Users",
      required: true
  },
  'boardUsers.$': Object, //se if need to replace Object with a schema
  boardPrivacy: {
      type: SimpleSchema.Integer,
      label: "Privacy",
      required: true
  },
  boardLists: {
      type: Array,
      label: "Lists",
      defaultValue: []
  },
  'boardLists.$': Object, //se if need to replace Object with a schema
  boardTags: {
      type: Array,
      label: "Tags",
      defaultValue: []
  },
  'boardTags.$': Object, //se if need to replace Object with a schema
  boardTeams: {
      type: Array,
      label: "Teams",
      defaultValue: []
  },
  'boardTeams.$': Object, //se if need to replace Object with a schema
  boardCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

Boards.attachSchema(BoardSchema);