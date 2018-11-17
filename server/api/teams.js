import {Meteor} from "meteor/meteor";
import {Teams}  from "../models/Teams";

if(Meteor.isServer)
{
    Meteor.publish('teams', function teamsPublication() {
        let userId = Meteor.userId();
        return Teams.find({
            teamMembers: {$elemMatch: {'userId': userId}}
        })
    });
}
Meteor.methods({
    /**
     * Create a team
     *
     * @param team The team to create
     * @returns the id of team created
     *  an error if the user doesn't have the right to create a team
     */
    "teams.createTeam"(team){
        if(!this.userId){
            throw new Meteor.Error('Not-Authorized');
        }

        team.teamOwner = this.userId;

        return Teams.insert(team);

    },

    /**
     * Get a team
     *
     * @returns the list of the teams
     *  an error if the team doesn't exist or the user isn't authorized to access the team
     */
    'getTeams'(){
       if(!this.userId){
            throw new Meteor.Error('not-authorised');
        }

        let teams = Teams.find();

        if(teams)
            return teams
        else
          throw new Meteor.Error(404, 'Team not found')
    },

    /**
     * Remove a team
     *
     * @param team The team to remove
     * @returns the number of element removed,
     *  an error if the team doesn't exist or an error if the user doesn't have the right to remove team
     */
    "teams.removeTeam"(team){
        if(!this.userId) throw new Meteor.Error('not-authorised');
        let isTeamMember = team.teamMembers.filter((m) => m.user_id == this.userId && m.teamRole == 'admin').length > 0;
        if(this.userId != team.teamOwner._id && !isTeamMember) throw new Meteor.Error('not-authorised');

        return Teams.remove(team._id);
    },

    /**
     * Edit a team
     *
     * @param team The team to edit
     * @returns the id of the team edited,
     *  an error if the user doesn't have the right to remove team
     */
    "teams.editTeam"(team){
        if(!this.userId) throw new Meteor.Error('not-authorised');
        let isTeamMember = team.teamMembers.filter((m) => m.user_id == this.userId && m.teamRole == 'admin').length > 0;
        if(this.userId != team.teamOwner._id && !isTeamMember) throw new Meteor.Error('not-authorised');

        return Teams.update(team._id, {
            $set: {
                teamName: team.teamName,
                teamDescription: team.teamDescription,
                teamOwner: team.teamOwner,
                teamMembers: team.teamMembers
            }
        });
    }

});
