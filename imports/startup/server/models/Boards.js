import { Mongo } from 'meteor/mongo'

export const Board = new Mongo.Collection('boards')

import SimpleSchema from 'simpl-schema';

BoardSchema = new SimpleSchema({
  boardtitle: {
      type: String,
      label: "Title",
      required: true
  },
  boarduser: {
      type: Array,
      label: "Users",
      required: true
  },
  'boarduser.$': Object, //se if need to replace Object with a schema
  boardprivacy: {
      type: Number,
      label: "Privacy",
      required: true
  },
  'boardprivacy.$': Object, //se if need to replace Object with a schema
  boardlist: {
      type: Array,
      label: "Lists",
      defaultValue: {}
  },
  'boardlist.$': Object, //se if need to replace Object with a schema
  boardtag: {
      type: Array,
      label: "Tags",
      defaultValue: {}
  },
  'boardtag.$': Object, //se if need to replace Object with a schema
  boardteam: {
      type: Array,
      label: "Teams",
      defaultValue: {}
  },
  'boardteam.$': Object, //se if need to replace Object with a schema
});