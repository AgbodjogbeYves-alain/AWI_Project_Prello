import SimpleSchema from 'simpl-schema';

ListSchema = new SimpleSchema({
  listtitle: {
    type: String,
    label: "Title",
  },
  listcard:{
      type: Object,
      label: "Cards"
  }
});

export const List = new Mongo.Collection("ListSchema")