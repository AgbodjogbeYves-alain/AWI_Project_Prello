import { Meteor } from 'meteor/meteor';

Meteor.methods({
    "users.signUp"(lastname, firstname, email, password){
        if(password.length < 6) throw new Meteor.Error("Too short password, at least 6 characters.")
        else if(!email || !lastname || !firstname) throw new Meteor.Error("Some field are empty.")
        else {
            let options = {
                email: email,
                password: password,
                profile: {
                    lastname: lastname,
                    firstname: firstname
                }
            };

            Accounts.createUser(options);
        }
    }
})