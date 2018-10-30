import { Mongo } from 'meteor/mongo'

export const Tags = new Mongo.Collection('tags')

import SimpleSchema from 'simpl-schema';

TagSchema = new SimpleSchema({
  tagId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  tagTitle: {
      type: String,
      label: "Title",
      required: true
  },
  tagCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

Tags.attachSchema(TagSchema);