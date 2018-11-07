import SimpleSchema from 'simpl-schema';
import { TeamSchema } from './Teams.js';

export const BoardTeamSchema = new SimpleSchema({
  team: {
      type: TeamSchema,
      label: "Team",
      required: true
  },
  teamRole: {
      type: String,
      label: "Role",
      required: true
  }
});