import SimpleSchema from 'simpl-schema';
import { UserSchema } from './Users';

export const BoardUserSchema = new SimpleSchema({
  userId: {
      type: SimpleSchema.RegEx.Id,
      label: "User",
      required: true
  },
  role: {
      type: String,
      label: "Role",
      required: true
  }
});