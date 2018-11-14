import SimpleSchema from 'simpl-schema';
import { ItemSchema } from './Item';
export const ChecklistSchema = new SimpleSchema({
    _id: {
        type: String,
        required: false
    },
    checklistName: {
        type: String,
        label: "Checklist Name",
        required: true
    },
    checklistItems: {
        type: Array,
        label: "Items",
        defaultValue: []
    },
    'checklistItems.$': ItemSchema, //se if need to replace Object with a schema*/
    cardCreatedAt:{
        type: Date,
        autoValue: function(){return new Date();}
    }
});