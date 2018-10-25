import SimpleSchema from 'simpl-schema';
import {Mongo} from "meteor/mongo";

BoardSchema = new SimpleSchema({
  boardtitle: {
    type: String,
    label: "Title",
  },
  boarduser: {
    type: Array,
    label: "Users"
  },
  boardlist: {
      type: Array,
      label: "Lists"
  },
  boardtag: {
      type: Array,
      label: "Tags"
  },
  boardteam: {
      type: Array,
      label: "Teams"
  }
});