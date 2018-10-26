import SimpleSchema from 'simpl-schema';

ListSchema = new SimpleSchema({
  listtitle: {
    type: String,
    label: "Title",
    required: true
  },
  listcard:{
      type: Array,
      label: "Cards",
      defaultValue: {}
  },
  'listcard.$': Object, //se if need to replace Object with a schema
});