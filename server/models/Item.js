import SimpleSchema from 'simpl-schema';

export const ItemSchema = new SimpleSchema({
    _id: {
        type: String,
        required: false
    },
    itemName: {
        type: String,
        label: "Item Name",
        required: true
    },
    itemChecked: {
        type: Boolean,
        label: "Checked",
        defaultValue: false
    }
});

