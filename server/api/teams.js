import {Meteor} from "meteor/meteor";
import {Team}  from "../models/Team";

Meteor.methods({
    "teams.createTeam"(team){
        if(!this.userId){
            throw new Meteor.Error('Not-Authorized');
        }
        let teamDescription = description.teamDescription ? description.teamDescription : ""
        //let owner = Meteor.users.findOne(this.userId)
    
        return Team.insert({
            teamName: team.teamTitle,
            teamDescription: teamDescription,
            teamOwner : this.userId
        });

    },

    'getTeams'(){
        //check(teamId,String)
       if(!this.userId){
            throw new Meteor.Error('not-authorised');
        }

        let teams = Team.find();

        if(teams)
            return teams
        else
          throw new Meteor.Error(404, 'Team not found')
    }

});