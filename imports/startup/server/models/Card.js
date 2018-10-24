import SimpleSchema from 'simpl-schema';

CardSchema = new SimpleSchema({
  cardtitle: {
    type: String,
    label: "Title"
  },
  description: {
    type: String,
    label: "Description"
  },
  cardtag: {
      type: Object,
      label: "Tags",
      optional: true
  },
  cardcomment: {
      type: Object,
      label: "Comments",
      optional: true
  },
  cardattachment: {
      type: Object,
      label: "Attachments",
      optional: true
  },
  cardchecklist: {
      type: Object,
      label: "CheckLists",
      optional: true
  }
});

const Card = new Mongo.Collection("CardSchema")
Card.attachSchema(CardSchema)
export default Card