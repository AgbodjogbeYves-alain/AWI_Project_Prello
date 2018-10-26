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
  cardcomment: {
      type: Array,
      label: "Comments",
      defaultValue: {}
  },
  cardattachment: {
      type: Array,
      label: "Attachments",
      defaultValue: {}
  },
  cardchecklist: {
      type: Array,
      label: "CheckLists",
      defaultValue: {}
  }
});