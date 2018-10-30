import { Mongo } from 'meteor/mongo'

export const Teams = new Mongo.Collection('teams')

import SimpleSchema from 'simpl-schema';

TeamSchema = new SimpleSchema({
  teamId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  teamName: {
      type: String,
      label: "Name",
      required: true
  },
  teamDescription: {
      type: String,
      label: "Description"
  },
  teamMembers:{
      type: Array,
      label: "Members",
      defaultValue: []
  },
  "teamMembers.$" : Object, //see if need to replace Object with a schema
  teamCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

Teams.attachSchema(TeamSchema);