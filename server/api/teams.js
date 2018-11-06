import {Meteor} from "meteor/meteor";
import {Teams}  from "../models/Teams";

Meteor.publish('teams', function teamsPublication() {
    let userId = Meteor.userId();
    return Teams.find({
        $or: [
            {teamMembers : {$elemMatch: {_id: userId}}},
            {"teamOwner._id": userId},
        ]
    })
});

Meteor.methods({
    "teams.createTeam"(team){
        if(!this.userId){
            throw new Meteor.Error('Not-Authorized');
        }
        let currentUser = Meteor.users.findOne(Meteor.userId(), {profile: 1})
        //let teamDescription = description.teamDescription ? description.teamDescription : ""
        //let owner = Meteor.users.findOne(this.userId)
        team.teamOwner = currentUser;
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
    }

});