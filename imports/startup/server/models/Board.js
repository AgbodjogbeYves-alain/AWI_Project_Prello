import SimpleSchema from 'simpl-schema';
import {Mongo} from "meteor/mongo";

BoardSchema = new SimpleSchema({
  boardtitle: {
    type: String,
    label: "Title",
  },
  boarduser: {
    type: Object,
    label: "Users"
  },
  boardlist: {
      type: Object,
      label: "Lists"
  },
  boardtag: {
      type: Object,
      label: "Tags"
  },
  boardteam: {
      type: Object,
      label: "Teams"
  }
});

export const Board = new Mongo.Collection("BoardSchema")