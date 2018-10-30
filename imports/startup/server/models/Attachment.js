import { Mongo } from 'meteor/mongo'

export const Attachments = new Mongo.Collection('attachments')

import SimpleSchema from 'simpl-schema';

AttachmentSchema = new SimpleSchema({
  attachmentId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  attachmentContent: {
      type: String,
      label: "Content",
      required: true
  },
  attachmentCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

Attachments.attachSchema(AttachmentSchema);