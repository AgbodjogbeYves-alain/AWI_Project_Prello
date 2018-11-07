import SimpleSchema from 'simpl-schema';
import { UserSchema } from './Users';

export const TeamMembers = new SimpleSchema({
    user: {
      type: UserSchema,
      label: "User",
    },
    
    userRole: {
      type: String,
      label: "Role",
    }
    
})