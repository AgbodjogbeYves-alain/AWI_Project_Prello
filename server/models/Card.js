import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo'

export const Cards = new Mongo.Collection('cards')

export const CardSchema = new SimpleSchema({
    _id: {
        type: String,
        required: false
    },
  cardTitle: {
      type: String,
      label: "Title",
      required: true
  },
  cardDescription: {
      type: String,
      label: "Description",
      defaultValue: "",
      optional: true
  },
  /*cardTag: {
      type: Array,
      label: "Tags",
      defaultValue: [],
      optional: true
  },*/
  //'cardTag.$': Object, //se if need to replace Object with a schema*/
  /*cardComment: {
      type: Array,
      label: "Comments",
      defaultValue: [],
      optional: true
  },
  'cardComment.$': Object, //se if need to replace Object with a schema
  cardAttachment: {
      type: Array,
      label: "Attachments",
      defaultValue: [],
      optional: true
  },
  'cardAttachment.$': Object, //se if need to replace Object with a schema
  cardChecklist: {
      type: Array,
      label: "CheckLists",
      defaultValue: [],
      optional: true
  },*/
  //'cardChecklist.$': Object, //se if need to replace Object with a schema*/
  cardCreatedAt:{
    type: Date,
    autoValue: function(){return new Date();}
}
});

Cards.attachSchema(CardSchema);