import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Board} from "../../startup/server/models/Boards";
import {Meteor} from "meteor/meteor";

Meteor.methods({
    'createBoard'({boardName, privacy}) {
        /*if(!Meteor.userId()){
            throw new Meteor.Error('Not Authorized')
        }else{*/
        let privacyInt = parseInt(privacy)
        const boardSchema = new SimpleSchema({
            boardName: {type: String, min: 1},
            privacyInt: {type: SimpleSchema.Integer, optional: false, min: 0, defaultValue: 0}
        })
        console.log(boardName);
        console.log(privacy);

        boardSchema.validate({boardName, privacyInt});

        return Board.insert({boardName: boardName, privacyInt: privacyInt})

        //    }
    },

    'getBoard'({idBoard}) {
        return Board.find({_id: idBoard}).fetch()
    },

    'deleteBoard'({idBoard}) {

    },

    'editBoard' ({idBoard,newParams}) {

    },

    'getAllBoards' ({idUser}){

    }
})

// code to run on server at startup
JsonRoutes.Middleware.use(function(req, res, next) {
    if(req.query.error) {
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                result: "ERROR"
            }
        })
    }

    next();
});


JsonRoutes.add('post', '/signUp/', function(req, res, next) {
    console.log(req)
    Meteor.users.insert({
        username: req.body.state.username,
        firstname: req.body.state.firstname,
        lastname: req.body.state.lastname,
        password: req.body.state.password,
        email: req.body.state.email
    })
    JsonRoutes.sendResult(res, {
        data: {
            result: Meteor.users.find().fetch()
        }
    });
});

