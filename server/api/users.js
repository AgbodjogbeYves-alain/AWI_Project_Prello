import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


Meteor.methods({
    "users.signUp"({lastname, firstname, email, password}){
        console.log(password)
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
    "users.updateProfile"(email, lastname, firstname){
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
    }
})