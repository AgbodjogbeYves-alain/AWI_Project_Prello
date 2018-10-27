import SimpleSchema from 'simpl-schema';

CardSchema = new SimpleSchema({
  cardtitle: {
      type: String,
      label: "Title",
      required: true
  },
  description: {
      type: String,
      label: "Description",
      defaultValue: {}
  },
  cardtag: {
      type: Array,
      label: "Tags",
      defaultValue: {}
  },
  'cardtag.$': Object, //se if need to replace Object with a schema
  cardcomment: {
      type: Array,
      label: "Comments",
      defaultValue: {}
  },
  'cardcomment.$': Object, //se if need to replace Object with a schema
  cardattachment: {
      type: Array,
      label: "Attachments",
      defaultValue: {}
  },
  'cardattachment.$': Object, //se if need to replace Object with a schema
  cardchecklist: {
      type: Array,
      label: "CheckLists",
      defaultValue: {}
  },
  'cardchecklist.$': Object, //se if need to replace Object with a schema
});