import { Mongo } from 'meteor/mongo'

export const CheckLists = new Mongo.Collection('checklists')

import SimpleSchema from 'simpl-schema';

CheckListSchema = new SimpleSchema({
  checkListId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  checkListContent: {
      type: Array,
      label: "Content",
      defaultValue: {}
  },
  "checkListContent.$" : Object, //see if need to replace Object with a schema
  checkListCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

//CheckLists.attachSchema(CheckListSchema);