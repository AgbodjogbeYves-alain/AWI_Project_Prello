import { Mongo } from 'meteor/mongo'

export const Checklists = new Mongo.Collection('checklists')

import SimpleSchema from 'simpl-schema';
import { ItemSchema } from './Item';
export const ChecklistSchema = new SimpleSchema({
    _id: {
        type: SimpleSchema.RegEx.Id
    },
    checklistName: {
        type: String,
        label: "Checklist Name",
        required: true
    },
    checklistItems: {
        type: Array,
        label: "Items",
        defaultValue: []
    },
    'checklistItems.$': ItemSchema, //se if need to replace Object with a schema*/
    boardId: {
        type: SimpleSchema.RegEx.Id,
        label: "Board"
    },
    cardCreatedAt:{
        type: Date,
        autoValue: function(){return new Date();}
    }
});

Checklists.attachSchema(ChecklistSchema,{transform: true});