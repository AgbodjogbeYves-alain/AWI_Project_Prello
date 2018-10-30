import { Mongo } from 'meteor/mongo'

export const Notifications = new Mongo.Collection('notifications')

import SimpleSchema from 'simpl-schema';

NotificationSchema = new SimpleSchema({
  NotificationId: {
      type: String,
      label: "Id",
      regEx: SimpleSchema.RegEx.Id
  },
  NotificationContent: {
      type: String,
      label: "Content",
      defaultValue: []
  },
  NotificationUser: {
      type: Object,
      label: "User"
  },
  NotificationAcivity: {
      type: Object,
      label: "Activity"
  },
  NotificationCreatedAt:{
      type: Date,
      autoValue: function(){return new Date();}
  }
});

Notifications.attachSchema(NotificationSchema);