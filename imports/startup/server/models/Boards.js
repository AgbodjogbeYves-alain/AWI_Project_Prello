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
  boardprivacy: {
      type: Number,
      label: "Privacy",
      required: true
  },
  boardlist: {
      type: Array,
      label: "Lists",
      defaultValue: {}
      },
  boardtag: {
      type: Array,
      label: "Tags",
      defaultValue: {}
      },
  boardteam: {
      type: Array,
      label: "Teams",
      defaultValue: {}
      }
});