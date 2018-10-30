import { Mongo } from 'meteor/mongo'

export const Activities = new Mongo.Collection('activities')

import SimpleSchema from 'simpl-schema';

ActivitySchema = new SimpleSchema({
    ActivityId: {
        type: String,
        label: "Id",
        regEx: SimpleSchema.RegEx.Id
    },
    ActivityType: {
        type: String,
        label: "Type",
    },
    ActivityDescription: {
        type: String,
        label: "Description"
    },
    ActivityUser: {
        type: Object,
        label: "User"
    },
    ActivityElement: {
        type: Object,
        label: "Element"
    },
    ActivityCreatedAt:{
        type: Date,
        autoValue: function(){return new Date();}
    }
});

Activities.attachSchema(ActivitySchema);