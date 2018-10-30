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
      type: Array,
      label: "Tags",

      optional: true
  },
  cardcomment: {
      type: Array,
      label: "Comments",
      optional: true
  },
  cardattachment: {
      type: Array,
      label: "Attachments",
      optional: true
  },
  cardchecklist: {
      type: Array,
      label: "CheckLists",
      optional: true
  }
});

// const Card = new Mongo.Collection("CardSchema")
// Card.attachSchema(CardSchema)
// export default Card
