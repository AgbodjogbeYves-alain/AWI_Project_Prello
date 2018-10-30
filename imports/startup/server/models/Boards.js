import { Mongo } from 'meteor/mongo'

export const Boards = new Mongo.Collection('boards')

import SimpleSchema from 'simpl-schema';

export const BoardSchema = new SimpleSchema({
    boardId: {
        type: String,
        label: "Id",
        regEx: SimpleSchema.RegEx.Id
    },
    boardTitle: {
        type: String,
        label: "Title",
        required: true
    },
    boardUser: {
        type: Array,
        label: "Users",
        required: true
    },
    'boardUser.$': Object, //se if need to replace Object with a schema
    boardPrivacy: {
        type: SimpleSchema.Integer,
        label: "Privacy",
        required: true
    },
    boardList: {
        type: Array,
        label: "Lists",
        defaultValue: [],
        optional : true
    },
    'boardList.$': Object, //se if need to replace Object with a schema
    boardTag: {
        type: Array,
        label: "Tags",
        defaultValue: [],
        optional : true

    },
    'boardTag.$': Object, //se if need to replace Object with a schema
    boardTeam: {
        type: Array,
        label: "Teams",
        defaultValue: [],
        optional : true

    },
    'boardTeam.$': Object, //se if need to replace Object with a schema
    boardCreatedAt:{
        type: Date,
        autoValue: function(){return new Date();}
    }
});

Boards.attachSchema(BoardSchema);