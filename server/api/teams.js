import {Meteor} from "meteor/meteor";
import {Team}  from "../models/Team";

Meteor.publish('teams', function teamsPublication() {
    let currentUser = Meteor.user()
    return Teams.find({
        $or: [
            {teamMember : {$in : [currentUser]}},
            {teamOwner: this.userID},
        ]
    })
});

Meteor.methods({
    "teams.createTeam"(team){
        if(!this.userId){
            throw new Meteor.Error('Not-Authorized');
        }
        //let teamDescription = description.teamDescription ? description.teamDescription : ""
        //let owner = Meteor.users.findOne(this.userId)
        team.teamOwner = this.userId;
        return Team.insert(team);

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