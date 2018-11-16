import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const verifToken = require('./Utils/tokenIdVerification')


if(Meteor.isServer)
{

    Meteor.publish('users', function(){
        if(this.userId) return Meteor.users.find({_id: {$ne: this.userId}}, {fields: { 'profile.trelloToken': 0, services: 0 }},{fields: { 'profile.google_id': 0, services: 0 }} );
    });

    Meteor.publish('user', function () {
        return Meteor.users.find({_id: this.userId});
    });
}

Meteor.methods({
    "users.signUp"({lastname, firstname, email, password}){
        if(password.length < 6) throw new Meteor.Error("Too short password, at least 6 characters.")
        else if(!email || !lastname || !firstname) throw new Meteor.Error("Some field are empty.")
        else {
            let options = {
                email: email,
                password: password,
                profile: {
                    lastname: lastname,
                    firstname: firstname,
                    enabledMails: false,
                    email: email
                }
            };

            Accounts.createUser(options);
        }
    }, 
    "users.googleSignUp"(tokenId){
        return verifToken.verify(tokenId).then(payload=>{
            let options = {
                email: payload['email'],
                profile: {
                    lastname: payload['family_name'],
                    firstname: payload['given_name'],
                    enabledMails: false,
                    email: payload['email'],
                    google_id: payload['sub']

                },


            };

             Accounts.createUser(options);
        })
    },
    "users.googleLogin"(tokenId){
        return (verifToken.verify(tokenId).then(payload=>{
            let user_id = payload['sub'];
            let user =  Meteor.users.findOne({"profile.google_id": user_id})
            if(user){
                let stampedToken = Accounts._generateStampedLoginToken();
                let hashStampedToken = Accounts._hashStampedToken(stampedToken);

                Meteor.users.update(user._id,
                    {$push: {'services.resume.loginTokens': hashStampedToken}}
                );


                this.setUserId(user._id);
                return {
                    token : stampedToken.token
                }
            }
            

        }))

    },
    "users.updateProfile"(email, lastname, firstname){
        //TODO Test if email already used
        Meteor.users.update(Meteor.userId(), { $set: {
            emails: [{address: email, verified: true}],
            'profile.lastname': lastname,
            'profile.firstname': firstname,
            'profile.email': email
        }});
        return Meteor.user();
    },
    'users.changePassword'(actualPassword, newPassword){
        let checkPassword = Accounts._checkPassword(Meteor.user(), actualPassword);
        if(checkPassword.error) throw new Meteor.Error(checkPassword.error.reason)
        else{
            Accounts.setPassword(Meteor.userId(), newPassword, {logout: false});
        }
    },
    'users.setEnabledMails'(enabledMails){
        Meteor.users.update(Meteor.userId(), { $set: {
            'profile.enabledMails': enabledMails
        }});
        return Meteor.user();
    },
    'users.remove'(){
        Meteor.users.remove(Meteor.userId());
    },
    "users.getUser"(email){
        return Meteor.users.findOne({"profile.email": email});
    },
    "users.getUsers"(){
        return Meteor.users.find();
    },
    "users.linkTrello"(token){
        Meteor.users.update(this.userId, {$set: {'profile.trelloToken': token}});
        return Meteor.user();
    },
    "users.unlinkTrello"(){
        Meteor.users.update(this.userId, {$set: {'profile.trelloToken': null}});
        return Meteor.user();
    }
})
