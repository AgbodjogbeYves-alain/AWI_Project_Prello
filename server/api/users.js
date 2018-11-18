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

    /**
     * Add a user
     *
     * @param lastname The lastname of the user
     * @param firstname The firstname of the user
     * @param email The email of the user
     * @param password The password of the user
     * @returns the id of the user added,
     *  an error if the user have a password with less than 6 char or if some field are empty
     */
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

    /**
     * Add a user
     *
     * @param tokenId The id of the token return by Google's oauth 2
     * @returns the id of the user added
     */
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

    /**
     * Log in a user with google
     *
     * @param tokenId The id of the token from Google's oauth 2
     * @returns the id of the user logged in
     */
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

    /**
     * Update the profile of a user
     *
     * @param email the new email of the user
     * @param lastname the new lastname of the user
     * @param firstname the new firstname of the user
     * @returns the id of the user edited
     */
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

    /**
     * Update the password of a user
     *
     * @param actualPassword the current password of the user
     * @param newPassword the new password of the user
     */
    'users.changePassword'(actualPassword, newPassword){
        let checkPassword = Accounts._checkPassword(Meteor.user(), actualPassword);
        if(checkPassword.error) throw new Meteor.Error(checkPassword.error.reason)
        else{
            Accounts.setPassword(Meteor.userId(), newPassword, {logout: false});
        }
    },

    /**
     * Enable the email of a user
     *
     * @param enabledMails the new value for the enabled mail property
     * @returns the id of the user edited
     */
    'users.setEnabledMails'(enabledMails){
        Meteor.users.update(Meteor.userId(), { $set: {
            'profile.enabledMails': enabledMails
        }});
        return Meteor.user();
    },

    /**
     * Remove a user
     *
     */
    'users.remove'(){
        Meteor.users.remove(Meteor.userId());
    },

    /**
     * Get a user
     * 
     * @param email the email of the user to get
     * @returns the user
     */
    "users.getUser"(email){
        return Meteor.users.findOne({"profile.email": email});
    },

    /**
     * Get all users
     * 
     * @returns All the user
     */
    "users.getUsers"(){
        return Meteor.users.find();
    },

    /**
     * Link the user account to Trello
     * 
     * @param token the token from Trello 
     * @returns the id of the user updated
     */
    "users.linkTrello"(token){
        Meteor.users.update(this.userId, {$set: {'profile.trelloToken': token}});
        return Meteor.user();
    },

    /**
     * Unlink the user account to Trello
     * 
     * @returns the id of the user updated
     */
    "users.unlinkTrello"(){
        Meteor.users.update(this.userId, {$set: {'profile.trelloToken': null}});
        return Meteor.user();
    }
})
