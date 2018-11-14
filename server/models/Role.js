import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo'

export const Roles = new Mongo.Collection('roles')

export const RolesSchema = new SimpleSchema({
  _id: {
      type: String
  },
  roleName: {
    type: String,
    label: "role",
    required: true
  },
  listRights:{
    type: Array,
    label: "rights",
    required: true
  },
  'listRights.$': String
});

Roles.attachSchema(RolesSchema);