import { Mongo } from 'meteor/mongo'

export const Comments = new Mongo.Collection('comments')

import SimpleSchema from 'simpl-schema';

CommentSchema = new SimpleSchema({
  commentId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  commentContent: {
      type: String,
      label: "Content",
      required: true
  },
  commentUser:{
      type: Object,
      label: "User"
  },
  commentCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

Comments.attachSchema(CommentSchema);