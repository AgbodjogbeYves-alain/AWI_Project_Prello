import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';

export const User = new SimpleSchema({
    name:{
        type:String
    }
})