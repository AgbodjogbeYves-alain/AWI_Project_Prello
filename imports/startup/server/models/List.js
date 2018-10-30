import SimpleSchema from 'simpl-schema';

ListSchema = new SimpleSchema({
  listtitle: {
    type: String,
    label: "Title",

  },
  listcard:{
      type: Array,
      label: "Cards"
  }
});