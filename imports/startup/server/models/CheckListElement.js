import { Mongo } from 'meteor/mongo'

export const CheckListElements = new Mongo.Collection('checklistelement')

import SimpleSchema from 'simpl-schema';

CheckListElementSchema = new SimpleSchema({
  checkListElementId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  checkListElementName: {
      type: String,
      label: "Name",
      required: true
  },
  checkListElementCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

//CheckListElements.attachSchema(CheckListElementSchema);