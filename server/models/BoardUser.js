import SimpleSchema from 'simpl-schema';
import { UserSchema } from './Users';

export const BoardUserSchema = new SimpleSchema({
  user: {
      type: UserSchema,
      label: "User",
      required: true
  },
  userRole: {
      type: String,
      label: "Role",
      required: true
  }
});