import {Meteor} from "meteor/meteor";
import {Teams}  from "../models/Teams";

Meteor.publish('teams', function teamsPublication() {
    let userId = Meteor.userId();
    return Teams.find({
        teamMembers : {$elemMatch: {'user._id': userId}}
    })
});

Meteor.methods({
    "teams.createTeam"(team){
        if(!this.userId){
            throw new Meteor.Error('Not-Authorized');
        }
        team.teamOwner = Meteor.user();
        
        return Teams.insert(team);

    },

    'getTeams'(){
        //check(teamId,String)
       if(!this.userId){
            throw new Meteor.Error('not-authorised');
        }

        let teams = Teams.find();

        if(teams)
            return teams
        else
          throw new Meteor.Error(404, 'Team not found')
    },

    "teams.removeTeam"(team){
        if(!this.userId) throw new Meteor.Error('not-authorised');
        let isTeamMember = team.teamMembers.filter((m) => m.user_id == this.userId && m.teamRole == 'admin').length > 0;
        if(this.userId != team.teamOwner._id && !isTeamMember) throw new Meteor.Error('not-authorised');

        return Teams.remove(team._id);
    },

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