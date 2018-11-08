import SimpleSchema from 'simpl-schema';

export const TeamMembers = new SimpleSchema({
    userId: {
      type: SimpleSchema.RegEx.Id,
      label: "User",
    },
    
    role: {
      type: String,
      label: "Role",
    }
    
})