import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo'
import {Random} from 'meteor/random';

export const Comments = new Mongo.Collection('comments')

export const CommentSchema = new SimpleSchema({
    _id: {
        type: String
    },
    commentContent: {
        type: String,
        label: "Title",
        required: true
    },
    userId: {
        type: SimpleSchema.RegEx.Id,
        label: "User",
        required: true
    },
    commentCreatedAt:{
        type: Date,
        autoValue: function(){return new Date();}
    }
});

Comments.attachSchema(CommentSchema);