import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo'

export const Lists = new Mongo.Collection('lists')

ListSchema = new SimpleSchema({
    listId: {
        type: String,
        label: "Id",
        regEx: SimpleSchema.RegEx.Id
    },
    listTitle: {
        type: String,
        label: "Title",
        required: true
    },
    listCard:{
        type: Array,
        label: "Cards",
        defaultValue: {}
    },
    'listCard.$': Object, //se if need to replace Object with a schema
    listCreatedAt:{
        type: Date,
        autoValue: function(){return new Date();}
    }
});

Lists.attachSchema(ListSchema);