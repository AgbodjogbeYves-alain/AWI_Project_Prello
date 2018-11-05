import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo'
import {CardSchema} from "./Card";

export const Lists = new Mongo.Collection('lists')

export const ListSchema = new SimpleSchema({
  listId: {
    type: String,
    label: "Id",
    regEx: SimpleSchema.RegEx.Id
  },
  listTitle: {
    type: String,
    label: "Title",
    required: true
  },
  listCard:{
    type: Array,
    label: "Cards",
    defaultValue: []
  },
  'listCard.$': CardSchema, //se if need to replace Object with a schema
  listCreatedAt:{
    type: Date,
    autoValue: function(){return new Date();}
}
});

Lists.attachSchema(ListSchema);