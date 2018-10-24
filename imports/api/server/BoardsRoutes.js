import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Board} from "../../startup/server/models/Boards";

Meteor.methods({
    'createBoard' ({boardName,privacy}){


        /*if(!Meteor.userId()){
            throw new Meteor.Error('Not Authorized')
        }else{*/
        let newBoardId;
        new SimpleSchema({
            boardName: { type: String },
            privacy: {type: String}
        }).validate({ boardName,privacy });
        Board.insert({boardName: boardName, privacy: privacy},function(error,result){
            newBoardId = result;
            console.log(newBoardId)
        })
        return newBoardId

        //    }




    }
})

Meteor.methods({
    'getBoard'({idBoard}) {

    }
})

Meteor.methods({
    'deleteBoard'({idBoard}) {

    }
})

Meteor.methods({
    'editBoard' ({idBoard,newParams}) {

    }
})

Meteor.methods({
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

