import { Mongo } from 'meteor/mongo'

export const Rights = new Mongo.Collection('rights')

import SimpleSchema from 'simpl-schema';

RightSchema = new SimpleSchema({
  RightId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  RightName: {
      type: String,
      label: "Name",
  }
});

//Rights.attachSchema(RightSchema);