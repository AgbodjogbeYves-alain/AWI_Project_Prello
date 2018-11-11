import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo'

export const Labels = new Mongo.Collection('labels')

export const LabelsSchema = new SimpleSchema({
    _id: {
        type: SimpleSchema.RegEx.Id
    },
    labelName: {
        type: String,
        label: "Label",
        required: true
    },
    labelColor:{
        type: String,
        label: "Color",
        required: true
    }
});

Labels.attachSchema(LabelsSchema);