import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo'
import {CardSchema} from "./Card";

export const Lists = new Mongo.Collection('lists')

export const ListSchema = new SimpleSchema({
  _id: {
      type: String
  },
  listTitle: {
    type: String,
    label: "Title",
    required: true
  },
  listCards:{
    type: Array,
    label: "Cards"
  },
  'listCards.$': CardSchema, //se if need to replace Object with a schema
  listCreatedAt:{
    type: Date,
    autoValue: function(){return new Date();}
  },
  listArchived: {
    type: Boolean,
    label: "Archived"
  }
});

Lists.attachSchema(ListSchema);