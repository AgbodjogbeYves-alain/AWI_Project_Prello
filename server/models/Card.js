import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo'

export const Cards = new Mongo.Collection('cards')

export const CardSchema = new SimpleSchema({
  cardId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  cardTitle: {
      type: String,
      label: "Title",
      required: true
  },
  cardDescription: {
      type: String,
      label: "Description",
      defaultValue: []
  },
  cardTag: {
      type: Array,
      label: "Tags",
      defaultValue: []
  },
  'cardTag.$': Object, //se if need to replace Object with a schema
  cardComment: {
      type: Array,
      label: "Comments",
      defaultValue: []
  },
  'cardComment.$': Object, //se if need to replace Object with a schema
  cardAttachment: {
      type: Array,
      label: "Attachments",
      defaultValue: []
  },
  'cardAttachment.$': Object, //se if need to replace Object with a schema
  cardChecklist: {
      type: Array,
      label: "CheckLists",
      defaultValue: []
  },
  'cardChecklist.$': Object, //se if need to replace Object with a schema
  listCreatedAt:{
    type: Date,
    autoValue: function(){return new Date();}
}
});

Cards.attachSchema(CardSchema);