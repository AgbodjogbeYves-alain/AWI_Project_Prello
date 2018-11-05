var require = meteorInstall({"api":{"Utils":{"boardUtils.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// api/Utils/boardUtils.js                                                                                //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  boardUtils: () => boardUtils
});

class boardUtils {
  static checkInBoardUser(idUser, board) {
    let isIn = false;
    board.boardUsers.map(user => {
      if (user._id == idUser) {
        isIn = true;
      }
    });
    return isIn;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"boards.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// api/boards.js                                                                                          //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
let Boards;
module.link("../models/Boards", {
  Boards(v) {
    Boards = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let boardUtils;
module.link("./Utils/boardUtils", {
  boardUtils(v) {
    boardUtils = v;
  }

}, 2);
let rusFunction;
module.link("rus-diff", {
  default(v) {
    rusFunction = v;
  }

}, 3);
Meteor.publish('boards', function () {
  return Boards.find();
});
Meteor.methods({
  'boards.createBoard'(board) {
    console.log("test");

    if (Meteor.userId()) {
      console.log(board);
      return Boards.insert(board);
    } else {
      throw Meteor.Error(401, "You are not authentificated");
    }
  },

  'boards.getBoard'(idBoard) {
    let board;
    let countDoc = Boards.find({
      "boardId": idBoard
    }).count();
    console.log(countDoc);

    if (countDoc === 1) {
      board = Boards.findOne({
        "boardId": idBoard
      }); //if(board.boardPrivacy == 1){
      //  if(Meteor.userId()){
      //    if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
      //      return board
      //}else{
      //  return Meteor.Error(403, "You are not on this allow to see this board")
      //}
      //}else{
      //    return Meteor.Error(401, "You are not authentificated")
      //}
      //}else{

      return board; //}
    } else {
      throw new Meteor.Error(404, 'Board not found');
    }
  },

  /*'boards.getBoardFromExt' (idBoard,token) {
      let decodedToken = "xd"
      let board;
      let countDoc = Boards.find({"_id": idBoard}).count();
      console.log(countDoc)
      if (countDoc === 1) {
          board = Boards.findOne({"boardId": idBoard});
          if(board.boardPrivacy == 1){
              if(token.userId){
                  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){
                      return board
                  }else{
                      return Meteor.Error(403, "You are not on this allow to see this board")
                  }
                }else{
                  return Meteor.Error(401, "You are not authentificated")
              }
          }
          return board;
      } else {
          throw new Meteor.Error(404, 'Board not found')
      }
  },*/
  'boards.removeBoard'(boardId) {
    let board;
    let countDoc = Boards.find({
      "_id": boardId
    }).count(); //console.log(countDoc)

    if (countDoc === 1) {
      board = Boards.findOne({
        "boardId": boardId
      }); //if(Meteor.userId()){
      //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){

      return Boards.remove(boardId); //}else{
      //  return Meteor.Error(403, "You are not allow to delete this board")
      //}
      //}else{
      //  return Meteor.Error(401, "You are not authentificated")
      //}
    } else {
      throw new Meteor.Error(404, 'Board not found');
    }
  },

  'boards.editBoard'(newBoard) {
    let countDoc = Boards.find({
      "boardId": newBoard.boardId
    }).count();

    if (countDoc === 1) {
      console.log("In");
      console.log(newBoard.boardList[0].listCard[0]);
      Boards.update({
        boardId: newBoard.boardId
      }, {
        $set: {
          boardTitle: newBoard.boardTitle,
          boardPrivacy: newBoard.privacy,
          boardUsers: newBoard.boardUsers
        }
      });
      /*newBoard.boardList.forEach((list) => {
               Boards.update({boardId: newBoard.boardId, 'boardList.listId': list.listId}, {
                   $set: {
                       "boardList.list.listCard.$[]": list.listCard,
                   }
                 })
           })*/

      /*newBoard.boardList.forEach((list) => {
          Boards.update({boardId: newBoard.boardId, "boardList.listId": list.listId}, {
              $set: {
                  boardTitle: newBoard.boardTitle,
                  boardPrivacy: newBoard.privacy,
              }
          })
      })*/
    } else {
      throw new Meteor.Error(404, 'Board not found');
    }
  },

  'board.getAllBoards'() {
    return Boards.find().fetch();
  },

  'board.getUserAllBoards'(userId) {
    let allBoards = Boards.find().fetch();
    let userBoard = [];
    allBoards.map(board => {
      if (boardUtils.checkInBoardUser(userId)) {
        userBoard.push(board);
      }
    });
    return allBoards;
  },

  'board.getTeam'(boardId) {
    let board;
    let countDoc = Boards.find({
      "_id": boardId
    }).count();

    if (countDoc === 1) {
      board = Boards.findOne({
        "boardId": boardId
      }); //if(Meteor.userId()){
      //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){

      return board.boardTeams; //}else{
      //  return Meteor.Error(403, "You are not allow to delete this board")
      //}
      //}else{
      //  return Meteor.Error(401, "You are not authentificated")
      //}
    } else {
      throw new Meteor.Error(404, 'Board not found');
    }
  },

  'board.getCards'(boardId) {
    let board;
    let countDoc = Boards.find({
      "_id": boardId
    }).count();

    if (countDoc === 1) {
      board = Boards.findOne({
        "boardId": boardId
      }); //if(Meteor.userId()){
      //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){

      let cards = [];
      board.boardList.map(list => {
        // noinspection JSAnnotator
        let theList = Meteor.call('getList', list._id);
        theList.listCard.map(card => {
          cards.push(card);
        });
      });
      return cards; //}else{
      //  return Meteor.Error(403, "You are not allow to delete this board")
      //}
      //}else{
      //  return Meteor.Error(401, "You are not authentificated")
      //}
    } else {
      throw new Meteor.Error(404, 'Board not found');
    }
  },

  'boards.getTags'(boardId) {
    let board;
    let countDoc = Boards.find({
      "_id": boardId
    }).count();

    if (countDoc === 1) {
      board = Boards.findOne({
        "boardId": boardId
      }); //if(Meteor.userId()){
      //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){

      return board.boardTags; //}else{
      //  return Meteor.Error(403, "You are not allow to delete this board")
      //}
      //}else{
      //  return Meteor.Error(401, "You are not authentificated")
      //}
    } else {
      throw new Meteor.Error(404, 'Board not found');
    }
  },

  'boards.getLists'(boardId) {
    let board;
    let lists = [];
    let countDoc = Boards.find({
      "_id": boardId
    }).count();

    if (countDoc === 1) {
      board = Boards.findOne({
        "boardId": boardId
      }); //if(Meteor.userId()){
      //  if(boardUtils.checkInBoardUser(Meteor.userId(), board)){

      board.boardList.map(list => {
        let theList = Meteor.call('list.getList', list._id);
        lists.push(theList);
      });
      return lists; //}else{
      //  return Meteor.Error(403, "You are not allow to delete this board")
      //}
      //}else{
      //  return Meteor.Error(401, "You are not authentificated")
      //}
    } else {
      throw new Meteor.Error(404, 'Board not found');
    }
  },

  'board.archiveList'(boardId, listId) {},

  'board.archiveCard'(boardId, cardId) {}

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lists.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// api/lists.js                                                                                           //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
let Lists;
module.link("../models/List", {
  Lists(v) {
    Lists = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Random;
module.link("meteor/random", {
  Random(v) {
    Random = v;
  }

}, 2);
let JsonRoutes;
module.link("meteor/simple:json-routes", {
  JsonRoutes(v) {
    JsonRoutes = v;
  }

}, 3);
Meteor.methods({
  'list.createList'(listName) {
    return Lists.insert({
      listTitle: listName
    });
  },

  'list.getList'(idList) {
    let countDoc = Lists.find({
      "_id": idList
    }).count();

    if (countDoc === 1) {
      let list = List.findOne({
        "_id": idList
      });
      return list;
    } else {
      throw new Meteor.Error(404, 'List not found');
    }
  },

  'list.deleteList'(idBoard, idList) {},

  'list.editList'(list) {},

  'list.getAllList'() {}

}); // code to run on server at startup

JsonRoutes.Middleware.use(function (req, res, next) {
  if (req.query.error) {
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        result: "ERROR"
      }
    });
  }

  next();
});
JsonRoutes.add('post', '/signUp/', function (req, res, next) {
  console.log(req);
  Meteor.users.insert({
    username: req.body.state.username,
    firstname: req.body.state.firstname,
    lastname: req.body.state.lastname,
    password: req.body.state.password,
    email: req.body.state.email
  });
  JsonRoutes.sendResult(res, {
    data: {
      result: Meteor.users.find().fetch()
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"teams.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// api/teams.js                                                                                           //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Team;
module.link("../models/Team", {
  Team(v) {
    Team = v;
  }

}, 1);
Meteor.methods({
  "teams.createTeam"(team) {
    if (!this.userId) {
      throw new Meteor.Error('Not-Authorized');
    } //let teamDescription = description.teamDescription ? description.teamDescription : ""
    //let owner = Meteor.users.findOne(this.userId)


    let teamMember = new Array();
    teamMember.push(team.teamUsers[0].user);
    return Team.insert({
      teamName: team.teamTitle,
      teamDescription: team.teamDescription,
      teamOwner: this.userId,
      teamMembers: teamMember
    });
  },

  'getTeams'() {
    //check(teamId,String)
    if (!this.userId) {
      throw new Meteor.Error('not-authorised');
    }

    let teams = Team.find();
    if (teams) return teams;else throw new Meteor.Error(404, 'Team not found');
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"users.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// api/users.js                                                                                           //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);
Meteor.publish('users', function () {
  if (this.userId) return Meteor.users.find({
    _id: {
      $ne: this.userId
    }
  }, {
    fields: {
      profile: 1
    }
  });
});
Meteor.publish('user', function () {
  return Meteor.users.find({
    _id: this.userId
  });
});
Meteor.methods({
  "users.signUp"({
    lastname,
    firstname,
    email,
    password
  }) {
    if (password.length < 6) throw new Meteor.Error("Too short password, at least 6 characters.");else if (!email || !lastname || !firstname) throw new Meteor.Error("Some field are empty.");else {
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

  "users.updateProfile"(email, lastname, firstname) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        emails: [{
          address: email,
          verified: true
        }],
        'profile.lastname': lastname,
        'profile.firstname': firstname,
        'profile.email': email
      }
    });
    return Meteor.user();
  },

  'users.changePassword'(actualPassword, newPassword) {
    let checkPassword = Accounts._checkPassword(Meteor.user(), actualPassword);

    if (checkPassword.error) throw new Meteor.Error(checkPassword.error.reason);else {
      Accounts.setPassword(Meteor.userId(), newPassword, {
        logout: false
      });
    }
  },

  'users.setEnabledMails'(enabledMails) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'profile.enabledMails': enabledMails
      }
    });
    return Meteor.user();
  },

  'users.remove'() {
    Meteor.users.remove(Meteor.userId());
  },

  "users.getUser"(email) {
    return Meteor.users.findOne({
      "profile.email": email
    });
  },

  "users.getUsers"() {
    return Meteor.users.find();
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"BoardUser.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// models/BoardUser.js                                                                                    //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  BoardUserSchema: () => BoardUserSchema
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let UserSchema;
module.link("./Users", {
  UserSchema(v) {
    UserSchema = v;
  }

}, 1);
const BoardUserSchema = new SimpleSchema({
  user: {
    type: UserSchema,
    label: "User",
    required: true
  },
  userRole: {
    type: Number,
    label: "Role",
    required: true
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Boards.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// models/Boards.js                                                                                       //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  Boards: () => Boards,
  BoardSchema: () => BoardSchema
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let ListSchema;
module.link("./List", {
  ListSchema(v) {
    ListSchema = v;
  }

}, 2);
let BoardUserSchema;
module.link("./BoardUser", {
  BoardUserSchema(v) {
    BoardUserSchema = v;
  }

}, 3);
const Boards = new Mongo.Collection('boards');
const BoardSchema = new SimpleSchema({
  boardTitle: {
    type: String,
    label: "Title",
    required: true
  },
  boardDescription: {
    type: String,
    label: "Description",
    required: false
  },
  boardUsers: {
    type: Array,
    label: "Users",
    required: true
  },
  'boardUsers.$': BoardUserSchema,
  //se if need to replace Object with a schema
  boardPrivacy: {
    type: SimpleSchema.Integer,
    label: "Privacy",
    required: true
  },
  boardLists: {
    type: Array,
    label: "Lists",
    defaultValue: []
  },
  'boardLists.$': ListSchema,
  //se if need to replace Object with a schema
  boardTags: {
    type: Array,
    label: "Tags",
    defaultValue: []
  },
  'boardTags.$': Object,
  //se if need to replace Object with a schema
  boardTeams: {
    type: Array,
    label: "Teams",
    defaultValue: []
  },
  'boardTeams.$': Object,
  //se if need to replace Object with a schema
  boardCreatedAt: {
    type: Date,
    autoValue: function () {
      return new Date();
    }
  }
});
Boards.attachSchema(BoardSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Card.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// models/Card.js                                                                                         //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  Cards: () => Cards,
  CardSchema: () => CardSchema
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const Cards = new Mongo.Collection('cards');
const CardSchema = new SimpleSchema({
  cardId: {
    type: String,
    label: "Id",
    regEx: SimpleSchema.RegEx.Id
  },
  cardTitle: {
    type: String,
    label: "Title",
    required: true
  },
  cardDescription: {
    type: String,
    label: "Description",
    defaultValue: []
  },
  cardTag: {
    type: Array,
    label: "Tags",
    defaultValue: []
  },
  'cardTag.$': Object,
  //se if need to replace Object with a schema
  cardComment: {
    type: Array,
    label: "Comments",
    defaultValue: []
  },
  'cardComment.$': Object,
  //se if need to replace Object with a schema
  cardAttachment: {
    type: Array,
    label: "Attachments",
    defaultValue: []
  },
  'cardAttachment.$': Object,
  //se if need to replace Object with a schema
  cardChecklist: {
    type: Array,
    label: "CheckLists",
    defaultValue: []
  },
  'cardChecklist.$': Object,
  //se if need to replace Object with a schema
  listCreatedAt: {
    type: Date,
    autoValue: function () {
      return new Date();
    }
  }
});
Cards.attachSchema(CardSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"List.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// models/List.js                                                                                         //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  Lists: () => Lists,
  ListSchema: () => ListSchema
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let CardSchema;
module.link("./Card", {
  CardSchema(v) {
    CardSchema = v;
  }

}, 2);
const Lists = new Mongo.Collection('lists');
const ListSchema = new SimpleSchema({
  listId: {
    type: String,
    label: "Id",
    regEx: SimpleSchema.RegEx.Id
  },
  listTitle: {
    type: String,
    label: "Title",
    required: true
  },
  listCard: {
    type: Array,
    label: "Cards",
    defaultValue: []
  },
  'listCard.$': CardSchema,
  //se if need to replace Object with a schema
  listCreatedAt: {
    type: Date,
    autoValue: function () {
      return new Date();
    }
  }
});
Lists.attachSchema(ListSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Team.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// models/Team.js                                                                                         //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  Team: () => Team
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let UserSchema;
module.link("./Users.js", {
  UserSchema(v) {
    UserSchema = v;
  }

}, 2);
const Team = new Mongo.Collection('teams');
const TeamSchema = new SimpleSchema({
  teamName: {
    type: String,
    label: "Name"
  },
  teamDescription: {
    type: String,
    label: "Description",
    defaultValue: ""
  },
  teamOwner: {
    type: String,
    label: "Owner"
  },
  teamMembers: {
    type: Array,
    label: "Members",
    defaultValue: []
  },
  'teamMembers.$': UserSchema
});
Team.attachSchema(TeamSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Users.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// models/Users.js                                                                                        //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  UserSchema: () => UserSchema
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
const UserProfileSchema = new SimpleSchema({
  firstname: {
    type: String,
    optional: true
  },
  lastname: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  ennabledMails: {
    type: Boolean,
    optional: true
  }
});
const UserSchema = new SimpleSchema({
  username: {
    type: String,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true
  },
  emails: {
    type: Array,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
  registered_emails: {
    type: Array,
    optional: true
  },
  'registered_emails.$': {
    type: Object,
    blackbox: true
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: UserProfileSchema,
    optional: true
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  roles: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // Option 2: [String] type
  // If you are sure you will never need to use role groups, then
  // you can specify [String] as the type
  roles: {
    type: Array,
    optional: true
  },
  'roles.$': {
    type: String
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  }
});
Meteor.users.attachSchema(UserSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// main.js                                                                                                //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
module.link("./api/users.js");
module.link("./api/boards");
module.link("./api/lists");
module.link("./api/teams");
Meteor.startup(() => {});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvYXBpL1V0aWxzL2JvYXJkVXRpbHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9ib2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9saXN0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvYXBpL3RlYW1zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9hcGkvdXNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Cb2FyZFVzZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Cb2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9DYXJkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvTGlzdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL1RlYW0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Vc2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJib2FyZFV0aWxzIiwiY2hlY2tJbkJvYXJkVXNlciIsImlkVXNlciIsImJvYXJkIiwiaXNJbiIsImJvYXJkVXNlcnMiLCJtYXAiLCJ1c2VyIiwiX2lkIiwiQm9hcmRzIiwibGluayIsInYiLCJNZXRlb3IiLCJydXNGdW5jdGlvbiIsImRlZmF1bHQiLCJwdWJsaXNoIiwiZmluZCIsIm1ldGhvZHMiLCJjb25zb2xlIiwibG9nIiwidXNlcklkIiwiaW5zZXJ0IiwiRXJyb3IiLCJpZEJvYXJkIiwiY291bnREb2MiLCJjb3VudCIsImZpbmRPbmUiLCJib2FyZElkIiwicmVtb3ZlIiwibmV3Qm9hcmQiLCJib2FyZExpc3QiLCJsaXN0Q2FyZCIsInVwZGF0ZSIsIiRzZXQiLCJib2FyZFRpdGxlIiwiYm9hcmRQcml2YWN5IiwicHJpdmFjeSIsImZldGNoIiwiYWxsQm9hcmRzIiwidXNlckJvYXJkIiwicHVzaCIsImJvYXJkVGVhbXMiLCJjYXJkcyIsImxpc3QiLCJ0aGVMaXN0IiwiY2FsbCIsImNhcmQiLCJib2FyZFRhZ3MiLCJsaXN0cyIsImxpc3RJZCIsImNhcmRJZCIsIkxpc3RzIiwiUmFuZG9tIiwiSnNvblJvdXRlcyIsImxpc3ROYW1lIiwibGlzdFRpdGxlIiwiaWRMaXN0IiwiTGlzdCIsIk1pZGRsZXdhcmUiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJlcnJvciIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInJlc3VsdCIsImFkZCIsInVzZXJzIiwidXNlcm5hbWUiLCJib2R5Iiwic3RhdGUiLCJmaXJzdG5hbWUiLCJsYXN0bmFtZSIsInBhc3N3b3JkIiwiZW1haWwiLCJUZWFtIiwidGVhbSIsInRlYW1NZW1iZXIiLCJBcnJheSIsInRlYW1Vc2VycyIsInRlYW1OYW1lIiwidGVhbVRpdGxlIiwidGVhbURlc2NyaXB0aW9uIiwidGVhbU93bmVyIiwidGVhbU1lbWJlcnMiLCJ0ZWFtcyIsIkFjY291bnRzIiwiJG5lIiwiZmllbGRzIiwicHJvZmlsZSIsImxlbmd0aCIsIm9wdGlvbnMiLCJlbmFibGVkTWFpbHMiLCJjcmVhdGVVc2VyIiwiZW1haWxzIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwiYWN0dWFsUGFzc3dvcmQiLCJuZXdQYXNzd29yZCIsImNoZWNrUGFzc3dvcmQiLCJfY2hlY2tQYXNzd29yZCIsInJlYXNvbiIsInNldFBhc3N3b3JkIiwibG9nb3V0IiwiQm9hcmRVc2VyU2NoZW1hIiwiU2ltcGxlU2NoZW1hIiwiVXNlclNjaGVtYSIsInR5cGUiLCJsYWJlbCIsInJlcXVpcmVkIiwidXNlclJvbGUiLCJOdW1iZXIiLCJCb2FyZFNjaGVtYSIsIk1vbmdvIiwiTGlzdFNjaGVtYSIsIkNvbGxlY3Rpb24iLCJTdHJpbmciLCJib2FyZERlc2NyaXB0aW9uIiwiSW50ZWdlciIsImJvYXJkTGlzdHMiLCJkZWZhdWx0VmFsdWUiLCJPYmplY3QiLCJib2FyZENyZWF0ZWRBdCIsIkRhdGUiLCJhdXRvVmFsdWUiLCJhdHRhY2hTY2hlbWEiLCJDYXJkcyIsIkNhcmRTY2hlbWEiLCJyZWdFeCIsIlJlZ0V4IiwiSWQiLCJjYXJkVGl0bGUiLCJjYXJkRGVzY3JpcHRpb24iLCJjYXJkVGFnIiwiY2FyZENvbW1lbnQiLCJjYXJkQXR0YWNobWVudCIsImNhcmRDaGVja2xpc3QiLCJsaXN0Q3JlYXRlZEF0IiwiVGVhbVNjaGVtYSIsIlVzZXJQcm9maWxlU2NoZW1hIiwib3B0aW9uYWwiLCJlbm5hYmxlZE1haWxzIiwiQm9vbGVhbiIsIkVtYWlsIiwicmVnaXN0ZXJlZF9lbWFpbHMiLCJibGFja2JveCIsImNyZWF0ZWRBdCIsInNlcnZpY2VzIiwicm9sZXMiLCJoZWFydGJlYXQiLCJzdGFydHVwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxZQUFVLEVBQUMsTUFBSUE7QUFBaEIsQ0FBZDs7QUFBTyxNQUFNQSxVQUFOLENBQWlCO0FBRXBCLFNBQU9DLGdCQUFQLENBQXdCQyxNQUF4QixFQUFnQ0MsS0FBaEMsRUFBc0M7QUFDbEMsUUFBSUMsSUFBSSxHQUFHLEtBQVg7QUFDQUQsU0FBSyxDQUFDRSxVQUFOLENBQWlCQyxHQUFqQixDQUFzQkMsSUFBRCxJQUFVO0FBQzNCLFVBQUdBLElBQUksQ0FBQ0MsR0FBTCxJQUFZTixNQUFmLEVBQXNCO0FBQ2xCRSxZQUFJLEdBQUcsSUFBUDtBQUNIO0FBQ0osS0FKRDtBQU1BLFdBQU9BLElBQVA7QUFDSDs7QUFYbUIsQzs7Ozs7Ozs7Ozs7QUNBeEIsSUFBSUssTUFBSjtBQUFXWCxNQUFNLENBQUNZLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDRCxRQUFNLENBQUNFLENBQUQsRUFBRztBQUFDRixVQUFNLEdBQUNFLENBQVA7QUFBUzs7QUFBcEIsQ0FBL0IsRUFBcUQsQ0FBckQ7QUFBd0QsSUFBSUMsTUFBSjtBQUFXZCxNQUFNLENBQUNZLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNFLFFBQU0sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFVBQU0sR0FBQ0QsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJWCxVQUFKO0FBQWVGLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUNWLFlBQVUsQ0FBQ1csQ0FBRCxFQUFHO0FBQUNYLGNBQVUsR0FBQ1csQ0FBWDtBQUFhOztBQUE1QixDQUFqQyxFQUErRCxDQUEvRDtBQUFrRSxJQUFJRSxXQUFKO0FBQWdCZixNQUFNLENBQUNZLElBQVAsQ0FBWSxVQUFaLEVBQXVCO0FBQUNJLFNBQU8sQ0FBQ0gsQ0FBRCxFQUFHO0FBQUNFLGVBQVcsR0FBQ0YsQ0FBWjtBQUFjOztBQUExQixDQUF2QixFQUFtRCxDQUFuRDtBQUtwT0MsTUFBTSxDQUFDRyxPQUFQLENBQWUsUUFBZixFQUF5QixZQUFZO0FBQUMsU0FBT04sTUFBTSxDQUFDTyxJQUFQLEVBQVA7QUFBcUIsQ0FBM0Q7QUFFQUosTUFBTSxDQUFDSyxPQUFQLENBQWU7QUFFWCx1QkFBcUJkLEtBQXJCLEVBQTRCO0FBQ3hCZSxXQUFPLENBQUNDLEdBQVIsQ0FBWSxNQUFaOztBQUNBLFFBQUdQLE1BQU0sQ0FBQ1EsTUFBUCxFQUFILEVBQW1CO0FBQ2ZGLGFBQU8sQ0FBQ0MsR0FBUixDQUFZaEIsS0FBWjtBQUNBLGFBQU9NLE1BQU0sQ0FBQ1ksTUFBUCxDQUFjbEIsS0FBZCxDQUFQO0FBQ0gsS0FIRCxNQUdLO0FBQ0QsWUFBTVMsTUFBTSxDQUFDVSxLQUFQLENBQWEsR0FBYixFQUFrQiw2QkFBbEIsQ0FBTjtBQUNIO0FBQ0osR0FWVTs7QUFZWCxvQkFBbUJDLE9BQW5CLEVBQTRCO0FBQ3hCLFFBQUlwQixLQUFKO0FBQ0EsUUFBSXFCLFFBQVEsR0FBR2YsTUFBTSxDQUFDTyxJQUFQLENBQVk7QUFBQyxpQkFBV087QUFBWixLQUFaLEVBQWtDRSxLQUFsQyxFQUFmO0FBQ0FQLFdBQU8sQ0FBQ0MsR0FBUixDQUFZSyxRQUFaOztBQUNBLFFBQUlBLFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQnJCLFdBQUssR0FBR00sTUFBTSxDQUFDaUIsT0FBUCxDQUFlO0FBQUMsbUJBQVdIO0FBQVosT0FBZixDQUFSLENBRGdCLENBRWhCO0FBQ0U7QUFDRTtBQUNFO0FBQ0U7QUFDRTtBQUNGO0FBRUo7QUFDQTtBQUNBO0FBQ0o7O0FBQ0ksYUFBT3BCLEtBQVAsQ0FkWSxDQWVoQjtBQUNILEtBaEJELE1BZ0JPO0FBQ0gsWUFBTSxJQUFJUyxNQUFNLENBQUNVLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsaUJBQXRCLENBQU47QUFDSDtBQUVKLEdBcENVOztBQXNDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsdUJBQXFCSyxPQUFyQixFQUE4QjtBQUMxQixRQUFJeEIsS0FBSjtBQUNBLFFBQUlxQixRQUFRLEdBQUdmLE1BQU0sQ0FBQ08sSUFBUCxDQUFZO0FBQUMsYUFBT1c7QUFBUixLQUFaLEVBQThCRixLQUE5QixFQUFmLENBRjBCLENBRzFCOztBQUNBLFFBQUlELFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQnJCLFdBQUssR0FBR00sTUFBTSxDQUFDaUIsT0FBUCxDQUFlO0FBQUMsbUJBQVdDO0FBQVosT0FBZixDQUFSLENBRGdCLENBRWhCO0FBQ0U7O0FBQ00sYUFBT2xCLE1BQU0sQ0FBQ21CLE1BQVAsQ0FBY0QsT0FBZCxDQUFQLENBSlEsQ0FLWjtBQUNFO0FBQ0Y7QUFFSjtBQUNFO0FBQ0Y7QUFDSCxLQVpELE1BWU87QUFDSCxZQUFNLElBQUlmLE1BQU0sQ0FBQ1UsS0FBWCxDQUFpQixHQUFqQixFQUFzQixpQkFBdEIsQ0FBTjtBQUNIO0FBQ0osR0FsRlU7O0FBb0ZYLHFCQUFvQk8sUUFBcEIsRUFBOEI7QUFDMUIsUUFBSUwsUUFBUSxHQUFHZixNQUFNLENBQUNPLElBQVAsQ0FBWTtBQUFDLGlCQUFXYSxRQUFRLENBQUNGO0FBQXJCLEtBQVosRUFBMkNGLEtBQTNDLEVBQWY7O0FBQ0EsUUFBSUQsUUFBUSxLQUFLLENBQWpCLEVBQW9CO0FBQ2hCTixhQUFPLENBQUNDLEdBQVIsQ0FBWSxJQUFaO0FBQ0FELGFBQU8sQ0FBQ0MsR0FBUixDQUFZVSxRQUFRLENBQUNDLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0JDLFFBQXRCLENBQStCLENBQS9CLENBQVo7QUFDQXRCLFlBQU0sQ0FBQ3VCLE1BQVAsQ0FBYztBQUFDTCxlQUFPLEVBQUVFLFFBQVEsQ0FBQ0Y7QUFBbkIsT0FBZCxFQUEyQztBQUN2Q00sWUFBSSxFQUFFO0FBQ0ZDLG9CQUFVLEVBQUVMLFFBQVEsQ0FBQ0ssVUFEbkI7QUFFRkMsc0JBQVksRUFBRU4sUUFBUSxDQUFDTyxPQUZyQjtBQUdGL0Isb0JBQVUsRUFBRXdCLFFBQVEsQ0FBQ3hCO0FBSG5CO0FBRGlDLE9BQTNDO0FBU0Q7Ozs7Ozs7O0FBV0M7Ozs7Ozs7O0FBUUgsS0EvQkQsTUErQk07QUFDRixZQUFNLElBQUlPLE1BQU0sQ0FBQ1UsS0FBWCxDQUFpQixHQUFqQixFQUFzQixpQkFBdEIsQ0FBTjtBQUNIO0FBQ0osR0F4SFU7O0FBMEhYLHlCQUF1QjtBQUNuQixXQUFPYixNQUFNLENBQUNPLElBQVAsR0FBY3FCLEtBQWQsRUFBUDtBQUNILEdBNUhVOztBQThIWCwyQkFBMEJqQixNQUExQixFQUFpQztBQUM3QixRQUFJa0IsU0FBUyxHQUFHN0IsTUFBTSxDQUFDTyxJQUFQLEdBQWNxQixLQUFkLEVBQWhCO0FBQ0EsUUFBSUUsU0FBUyxHQUFHLEVBQWhCO0FBQ0FELGFBQVMsQ0FBQ2hDLEdBQVYsQ0FBZUgsS0FBRCxJQUFXO0FBQ3JCLFVBQUdILFVBQVUsQ0FBQ0MsZ0JBQVgsQ0FBNEJtQixNQUE1QixDQUFILEVBQXVDO0FBQ25DbUIsaUJBQVMsQ0FBQ0MsSUFBVixDQUFlckMsS0FBZjtBQUNIO0FBQ0osS0FKRDtBQU1BLFdBQU9tQyxTQUFQO0FBRUgsR0F6SVU7O0FBMklYLGtCQUFpQlgsT0FBakIsRUFBeUI7QUFDckIsUUFBSXhCLEtBQUo7QUFDQSxRQUFJcUIsUUFBUSxHQUFHZixNQUFNLENBQUNPLElBQVAsQ0FBWTtBQUFDLGFBQU9XO0FBQVIsS0FBWixFQUE4QkYsS0FBOUIsRUFBZjs7QUFDQSxRQUFJRCxRQUFRLEtBQUssQ0FBakIsRUFBb0I7QUFDaEJyQixXQUFLLEdBQUdNLE1BQU0sQ0FBQ2lCLE9BQVAsQ0FBZTtBQUFDLG1CQUFXQztBQUFaLE9BQWYsQ0FBUixDQURnQixDQUVoQjtBQUNBOztBQUNBLGFBQU94QixLQUFLLENBQUNzQyxVQUFiLENBSmdCLENBS2hCO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNILEtBWkQsTUFZTztBQUNILFlBQU0sSUFBSTdCLE1BQU0sQ0FBQ1UsS0FBWCxDQUFpQixHQUFqQixFQUFzQixpQkFBdEIsQ0FBTjtBQUNIO0FBQ0osR0E3SlU7O0FBOEpYLG1CQUFrQkssT0FBbEIsRUFBMkI7QUFDdkIsUUFBSXhCLEtBQUo7QUFDQSxRQUFJcUIsUUFBUSxHQUFHZixNQUFNLENBQUNPLElBQVAsQ0FBWTtBQUFDLGFBQU9XO0FBQVIsS0FBWixFQUE4QkYsS0FBOUIsRUFBZjs7QUFDQSxRQUFJRCxRQUFRLEtBQUssQ0FBakIsRUFBb0I7QUFDaEJyQixXQUFLLEdBQUdNLE1BQU0sQ0FBQ2lCLE9BQVAsQ0FBZTtBQUFDLG1CQUFXQztBQUFaLE9BQWYsQ0FBUixDQURnQixDQUVoQjtBQUNBOztBQUNBLFVBQUllLEtBQUssR0FBRyxFQUFaO0FBQ0F2QyxXQUFLLENBQUMyQixTQUFOLENBQWdCeEIsR0FBaEIsQ0FBcUJxQyxJQUFELElBQVU7QUFDMUI7QUFDQSxZQUFJQyxPQUFPLEdBQUdoQyxNQUFNLENBQUNpQyxJQUFQLENBQVksU0FBWixFQUFzQkYsSUFBSSxDQUFDbkMsR0FBM0IsQ0FBZDtBQUNBb0MsZUFBTyxDQUFDYixRQUFSLENBQWlCekIsR0FBakIsQ0FBc0J3QyxJQUFELElBQVU7QUFDM0JKLGVBQUssQ0FBQ0YsSUFBTixDQUFXTSxJQUFYO0FBQ0gsU0FGRDtBQUdILE9BTkQ7QUFRQSxhQUFPSixLQUFQLENBYmdCLENBY2hCO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNILEtBckJELE1BcUJPO0FBQ0gsWUFBTSxJQUFJOUIsTUFBTSxDQUFDVSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGlCQUF0QixDQUFOO0FBQ0g7QUFDSixHQXpMVTs7QUEyTFgsbUJBQWtCSyxPQUFsQixFQUEyQjtBQUN2QixRQUFJeEIsS0FBSjtBQUNBLFFBQUlxQixRQUFRLEdBQUdmLE1BQU0sQ0FBQ08sSUFBUCxDQUFZO0FBQUMsYUFBT1c7QUFBUixLQUFaLEVBQThCRixLQUE5QixFQUFmOztBQUNBLFFBQUlELFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQnJCLFdBQUssR0FBR00sTUFBTSxDQUFDaUIsT0FBUCxDQUFlO0FBQUMsbUJBQVdDO0FBQVosT0FBZixDQUFSLENBRGdCLENBRWhCO0FBQ0E7O0FBQ0EsYUFBT3hCLEtBQUssQ0FBQzRDLFNBQWIsQ0FKZ0IsQ0FLaEI7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0gsS0FaRCxNQVlPO0FBQ0gsWUFBTSxJQUFJbkMsTUFBTSxDQUFDVSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGlCQUF0QixDQUFOO0FBQ0g7QUFDSixHQTdNVTs7QUErTVgsb0JBQW1CSyxPQUFuQixFQUE0QjtBQUN4QixRQUFJeEIsS0FBSjtBQUNBLFFBQUk2QyxLQUFLLEdBQUcsRUFBWjtBQUNBLFFBQUl4QixRQUFRLEdBQUdmLE1BQU0sQ0FBQ08sSUFBUCxDQUFZO0FBQUMsYUFBT1c7QUFBUixLQUFaLEVBQThCRixLQUE5QixFQUFmOztBQUNBLFFBQUlELFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQnJCLFdBQUssR0FBR00sTUFBTSxDQUFDaUIsT0FBUCxDQUFlO0FBQUMsbUJBQVdDO0FBQVosT0FBZixDQUFSLENBRGdCLENBRWhCO0FBQ0E7O0FBQ0F4QixXQUFLLENBQUMyQixTQUFOLENBQWdCeEIsR0FBaEIsQ0FBcUJxQyxJQUFELElBQVU7QUFDMUIsWUFBSUMsT0FBTyxHQUFHaEMsTUFBTSxDQUFDaUMsSUFBUCxDQUFZLGNBQVosRUFBMkJGLElBQUksQ0FBQ25DLEdBQWhDLENBQWQ7QUFDQXdDLGFBQUssQ0FBQ1IsSUFBTixDQUFXSSxPQUFYO0FBQ0gsT0FIRDtBQUlBLGFBQU9JLEtBQVAsQ0FSZ0IsQ0FTaEI7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0gsS0FoQkQsTUFnQk87QUFDSCxZQUFNLElBQUlwQyxNQUFNLENBQUNVLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsaUJBQXRCLENBQU47QUFDSDtBQUNKLEdBdE9VOztBQXVPWCxzQkFBcUJLLE9BQXJCLEVBQTZCc0IsTUFBN0IsRUFBcUMsQ0FFcEMsQ0F6T1U7O0FBMk9YLHNCQUFxQnRCLE9BQXJCLEVBQThCdUIsTUFBOUIsRUFBc0MsQ0FFckM7O0FBN09VLENBQWYsRTs7Ozs7Ozs7Ozs7QUNQQSxJQUFJQyxLQUFKO0FBQVVyRCxNQUFNLENBQUNZLElBQVAsQ0FBWSxnQkFBWixFQUE2QjtBQUFDeUMsT0FBSyxDQUFDeEMsQ0FBRCxFQUFHO0FBQUN3QyxTQUFLLEdBQUN4QyxDQUFOO0FBQVE7O0FBQWxCLENBQTdCLEVBQWlELENBQWpEO0FBQW9ELElBQUlDLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXlDLE1BQUo7QUFBV3RELE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQzBDLFFBQU0sQ0FBQ3pDLENBQUQsRUFBRztBQUFDeUMsVUFBTSxHQUFDekMsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJMEMsVUFBSjtBQUFldkQsTUFBTSxDQUFDWSxJQUFQLENBQVksMkJBQVosRUFBd0M7QUFBQzJDLFlBQVUsQ0FBQzFDLENBQUQsRUFBRztBQUFDMEMsY0FBVSxHQUFDMUMsQ0FBWDtBQUFhOztBQUE1QixDQUF4QyxFQUFzRSxDQUF0RTtBQU03TUMsTUFBTSxDQUFDSyxPQUFQLENBQWU7QUFDWCxvQkFBa0JxQyxRQUFsQixFQUE0QjtBQUN4QixXQUFPSCxLQUFLLENBQUM5QixNQUFOLENBQWE7QUFBQ2tDLGVBQVMsRUFBRUQ7QUFBWixLQUFiLENBQVA7QUFDSCxHQUhVOztBQUtYLGlCQUFnQkUsTUFBaEIsRUFBd0I7QUFDcEIsUUFBSWhDLFFBQVEsR0FBRzJCLEtBQUssQ0FBQ25DLElBQU4sQ0FBVztBQUFDLGFBQU93QztBQUFSLEtBQVgsRUFBNEIvQixLQUE1QixFQUFmOztBQUNBLFFBQUlELFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQixVQUFJbUIsSUFBSSxHQUFHYyxJQUFJLENBQUMvQixPQUFMLENBQWE7QUFBQyxlQUFPOEI7QUFBUixPQUFiLENBQVg7QUFDQSxhQUFPYixJQUFQO0FBQ0gsS0FIRCxNQUdPO0FBQ0gsWUFBTSxJQUFJL0IsTUFBTSxDQUFDVSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGdCQUF0QixDQUFOO0FBQ0g7QUFFSixHQWRVOztBQWVYLG9CQUFrQkMsT0FBbEIsRUFBMkJpQyxNQUEzQixFQUFtQyxDQUVsQyxDQWpCVTs7QUFtQlgsa0JBQWlCYixJQUFqQixFQUF1QixDQUV0QixDQXJCVTs7QUF1Qlgsc0JBQW9CLENBRW5COztBQXpCVSxDQUFmLEUsQ0E0QkE7O0FBQ0FVLFVBQVUsQ0FBQ0ssVUFBWCxDQUFzQkMsR0FBdEIsQ0FBMEIsVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CQyxJQUFuQixFQUF5QjtBQUMvQyxNQUFHRixHQUFHLENBQUNHLEtBQUosQ0FBVUMsS0FBYixFQUFvQjtBQUNoQlgsY0FBVSxDQUFDWSxVQUFYLENBQXNCSixHQUF0QixFQUEyQjtBQUN2QkssVUFBSSxFQUFFLEdBRGlCO0FBRXZCQyxVQUFJLEVBQUU7QUFDRkMsY0FBTSxFQUFFO0FBRE47QUFGaUIsS0FBM0I7QUFNSDs7QUFFRE4sTUFBSTtBQUNQLENBWEQ7QUFjQVQsVUFBVSxDQUFDZ0IsR0FBWCxDQUFlLE1BQWYsRUFBdUIsVUFBdkIsRUFBbUMsVUFBU1QsR0FBVCxFQUFjQyxHQUFkLEVBQW1CQyxJQUFuQixFQUF5QjtBQUN4RDVDLFNBQU8sQ0FBQ0MsR0FBUixDQUFZeUMsR0FBWjtBQUNBaEQsUUFBTSxDQUFDMEQsS0FBUCxDQUFhakQsTUFBYixDQUFvQjtBQUNoQmtELFlBQVEsRUFBRVgsR0FBRyxDQUFDWSxJQUFKLENBQVNDLEtBQVQsQ0FBZUYsUUFEVDtBQUVoQkcsYUFBUyxFQUFFZCxHQUFHLENBQUNZLElBQUosQ0FBU0MsS0FBVCxDQUFlQyxTQUZWO0FBR2hCQyxZQUFRLEVBQUVmLEdBQUcsQ0FBQ1ksSUFBSixDQUFTQyxLQUFULENBQWVFLFFBSFQ7QUFJaEJDLFlBQVEsRUFBRWhCLEdBQUcsQ0FBQ1ksSUFBSixDQUFTQyxLQUFULENBQWVHLFFBSlQ7QUFLaEJDLFNBQUssRUFBRWpCLEdBQUcsQ0FBQ1ksSUFBSixDQUFTQyxLQUFULENBQWVJO0FBTE4sR0FBcEI7QUFPQXhCLFlBQVUsQ0FBQ1ksVUFBWCxDQUFzQkosR0FBdEIsRUFBMkI7QUFDdkJNLFFBQUksRUFBRTtBQUNGQyxZQUFNLEVBQUV4RCxNQUFNLENBQUMwRCxLQUFQLENBQWF0RCxJQUFiLEdBQW9CcUIsS0FBcEI7QUFETjtBQURpQixHQUEzQjtBQUtILENBZEQsRTs7Ozs7Ozs7Ozs7QUNqREEsSUFBSXpCLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSW1FLElBQUo7QUFBU2hGLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGdCQUFaLEVBQTZCO0FBQUNvRSxNQUFJLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFFBQUksR0FBQ25FLENBQUw7QUFBTzs7QUFBaEIsQ0FBN0IsRUFBK0MsQ0FBL0M7QUFHekVDLE1BQU0sQ0FBQ0ssT0FBUCxDQUFlO0FBQ1gscUJBQW1COEQsSUFBbkIsRUFBd0I7QUFDcEIsUUFBRyxDQUFDLEtBQUszRCxNQUFULEVBQWdCO0FBQ1osWUFBTSxJQUFJUixNQUFNLENBQUNVLEtBQVgsQ0FBaUIsZ0JBQWpCLENBQU47QUFDSCxLQUhtQixDQUlwQjtBQUNBOzs7QUFDRCxRQUFJMEQsVUFBVSxHQUFHLElBQUlDLEtBQUosRUFBakI7QUFDQUQsY0FBVSxDQUFDeEMsSUFBWCxDQUFnQnVDLElBQUksQ0FBQ0csU0FBTCxDQUFlLENBQWYsRUFBa0IzRSxJQUFsQztBQUVDLFdBQU91RSxJQUFJLENBQUN6RCxNQUFMLENBQVk7QUFDZjhELGNBQVEsRUFBRUosSUFBSSxDQUFDSyxTQURBO0FBRWZDLHFCQUFlLEVBQUVOLElBQUksQ0FBQ00sZUFGUDtBQUdmQyxlQUFTLEVBQUcsS0FBS2xFLE1BSEY7QUFJZm1FLGlCQUFXLEVBQUdQO0FBSkMsS0FBWixDQUFQO0FBT0gsR0FqQlU7O0FBbUJYLGVBQVk7QUFDUjtBQUNELFFBQUcsQ0FBQyxLQUFLNUQsTUFBVCxFQUFnQjtBQUNYLFlBQU0sSUFBSVIsTUFBTSxDQUFDVSxLQUFYLENBQWlCLGdCQUFqQixDQUFOO0FBQ0g7O0FBRUQsUUFBSWtFLEtBQUssR0FBR1YsSUFBSSxDQUFDOUQsSUFBTCxFQUFaO0FBRUEsUUFBR3dFLEtBQUgsRUFDSSxPQUFPQSxLQUFQLENBREosS0FHRSxNQUFNLElBQUk1RSxNQUFNLENBQUNVLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsZ0JBQXRCLENBQU47QUFDTDs7QUEvQlUsQ0FBZixFOzs7Ozs7Ozs7OztBQ0hBLElBQUlWLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSThFLFFBQUo7QUFBYTNGLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUMrRSxVQUFRLENBQUM5RSxDQUFELEVBQUc7QUFBQzhFLFlBQVEsR0FBQzlFLENBQVQ7QUFBVzs7QUFBeEIsQ0FBbkMsRUFBNkQsQ0FBN0Q7QUFHN0VDLE1BQU0sQ0FBQ0csT0FBUCxDQUFlLE9BQWYsRUFBd0IsWUFBVTtBQUM5QixNQUFHLEtBQUtLLE1BQVIsRUFBZ0IsT0FBT1IsTUFBTSxDQUFDMEQsS0FBUCxDQUFhdEQsSUFBYixDQUFrQjtBQUFDUixPQUFHLEVBQUU7QUFBQ2tGLFNBQUcsRUFBRSxLQUFLdEU7QUFBWDtBQUFOLEdBQWxCLEVBQTZDO0FBQUN1RSxVQUFNLEVBQUU7QUFBRUMsYUFBTyxFQUFFO0FBQVg7QUFBVCxHQUE3QyxDQUFQO0FBQ25CLENBRkQ7QUFJQWhGLE1BQU0sQ0FBQ0csT0FBUCxDQUFlLE1BQWYsRUFBdUIsWUFBWTtBQUMvQixTQUFPSCxNQUFNLENBQUMwRCxLQUFQLENBQWF0RCxJQUFiLENBQWtCO0FBQUNSLE9BQUcsRUFBRSxLQUFLWTtBQUFYLEdBQWxCLENBQVA7QUFDSCxDQUZEO0FBSUFSLE1BQU0sQ0FBQ0ssT0FBUCxDQUFlO0FBQ1gsaUJBQWU7QUFBQzBELFlBQUQ7QUFBV0QsYUFBWDtBQUFzQkcsU0FBdEI7QUFBNkJEO0FBQTdCLEdBQWYsRUFBc0Q7QUFDbEQsUUFBR0EsUUFBUSxDQUFDaUIsTUFBVCxHQUFrQixDQUFyQixFQUF3QixNQUFNLElBQUlqRixNQUFNLENBQUNVLEtBQVgsQ0FBaUIsNENBQWpCLENBQU4sQ0FBeEIsS0FDSyxJQUFHLENBQUN1RCxLQUFELElBQVUsQ0FBQ0YsUUFBWCxJQUF1QixDQUFDRCxTQUEzQixFQUFzQyxNQUFNLElBQUk5RCxNQUFNLENBQUNVLEtBQVgsQ0FBaUIsdUJBQWpCLENBQU4sQ0FBdEMsS0FDQTtBQUNELFVBQUl3RSxPQUFPLEdBQUc7QUFDVmpCLGFBQUssRUFBRUEsS0FERztBQUVWRCxnQkFBUSxFQUFFQSxRQUZBO0FBR1ZnQixlQUFPLEVBQUU7QUFDTGpCLGtCQUFRLEVBQUVBLFFBREw7QUFFTEQsbUJBQVMsRUFBRUEsU0FGTjtBQUdMcUIsc0JBQVksRUFBRSxLQUhUO0FBSUxsQixlQUFLLEVBQUVBO0FBSkY7QUFIQyxPQUFkO0FBV0FZLGNBQVEsQ0FBQ08sVUFBVCxDQUFvQkYsT0FBcEI7QUFDSDtBQUNKLEdBbEJVOztBQW1CWCx3QkFBc0JqQixLQUF0QixFQUE2QkYsUUFBN0IsRUFBdUNELFNBQXZDLEVBQWlEO0FBQzdDOUQsVUFBTSxDQUFDMEQsS0FBUCxDQUFhdEMsTUFBYixDQUFvQnBCLE1BQU0sQ0FBQ1EsTUFBUCxFQUFwQixFQUFxQztBQUFFYSxVQUFJLEVBQUU7QUFDekNnRSxjQUFNLEVBQUUsQ0FBQztBQUFDQyxpQkFBTyxFQUFFckIsS0FBVjtBQUFpQnNCLGtCQUFRLEVBQUU7QUFBM0IsU0FBRCxDQURpQztBQUV6Qyw0QkFBb0J4QixRQUZxQjtBQUd6Qyw2QkFBcUJELFNBSG9CO0FBSXpDLHlCQUFpQkc7QUFKd0I7QUFBUixLQUFyQztBQU1BLFdBQU9qRSxNQUFNLENBQUNMLElBQVAsRUFBUDtBQUNILEdBM0JVOztBQTRCWCx5QkFBdUI2RixjQUF2QixFQUF1Q0MsV0FBdkMsRUFBbUQ7QUFDL0MsUUFBSUMsYUFBYSxHQUFHYixRQUFRLENBQUNjLGNBQVQsQ0FBd0IzRixNQUFNLENBQUNMLElBQVAsRUFBeEIsRUFBdUM2RixjQUF2QyxDQUFwQjs7QUFDQSxRQUFHRSxhQUFhLENBQUN0QyxLQUFqQixFQUF3QixNQUFNLElBQUlwRCxNQUFNLENBQUNVLEtBQVgsQ0FBaUJnRixhQUFhLENBQUN0QyxLQUFkLENBQW9Cd0MsTUFBckMsQ0FBTixDQUF4QixLQUNJO0FBQ0FmLGNBQVEsQ0FBQ2dCLFdBQVQsQ0FBcUI3RixNQUFNLENBQUNRLE1BQVAsRUFBckIsRUFBc0NpRixXQUF0QyxFQUFtRDtBQUFDSyxjQUFNLEVBQUU7QUFBVCxPQUFuRDtBQUNIO0FBQ0osR0FsQ1U7O0FBbUNYLDBCQUF3QlgsWUFBeEIsRUFBcUM7QUFDakNuRixVQUFNLENBQUMwRCxLQUFQLENBQWF0QyxNQUFiLENBQW9CcEIsTUFBTSxDQUFDUSxNQUFQLEVBQXBCLEVBQXFDO0FBQUVhLFVBQUksRUFBRTtBQUN6QyxnQ0FBd0I4RDtBQURpQjtBQUFSLEtBQXJDO0FBR0EsV0FBT25GLE1BQU0sQ0FBQ0wsSUFBUCxFQUFQO0FBQ0gsR0F4Q1U7O0FBeUNYLG1CQUFnQjtBQUNaSyxVQUFNLENBQUMwRCxLQUFQLENBQWExQyxNQUFiLENBQW9CaEIsTUFBTSxDQUFDUSxNQUFQLEVBQXBCO0FBQ0gsR0EzQ1U7O0FBNENYLGtCQUFnQnlELEtBQWhCLEVBQXNCO0FBQ2xCLFdBQU9qRSxNQUFNLENBQUMwRCxLQUFQLENBQWE1QyxPQUFiLENBQXFCO0FBQUMsdUJBQWlCbUQ7QUFBbEIsS0FBckIsQ0FBUDtBQUNILEdBOUNVOztBQStDWCxxQkFBa0I7QUFDZCxXQUFPakUsTUFBTSxDQUFDMEQsS0FBUCxDQUFhdEQsSUFBYixFQUFQO0FBQ0g7O0FBakRVLENBQWYsRTs7Ozs7Ozs7Ozs7QUNYQWxCLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUM0RyxpQkFBZSxFQUFDLE1BQUlBO0FBQXJCLENBQWQ7QUFBcUQsSUFBSUMsWUFBSjtBQUFpQjlHLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0ksU0FBTyxDQUFDSCxDQUFELEVBQUc7QUFBQ2lHLGdCQUFZLEdBQUNqRyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlrRyxVQUFKO0FBQWUvRyxNQUFNLENBQUNZLElBQVAsQ0FBWSxTQUFaLEVBQXNCO0FBQUNtRyxZQUFVLENBQUNsRyxDQUFELEVBQUc7QUFBQ2tHLGNBQVUsR0FBQ2xHLENBQVg7QUFBYTs7QUFBNUIsQ0FBdEIsRUFBb0QsQ0FBcEQ7QUFHekksTUFBTWdHLGVBQWUsR0FBRyxJQUFJQyxZQUFKLENBQWlCO0FBQzlDckcsTUFBSSxFQUFFO0FBQ0Z1RyxRQUFJLEVBQUVELFVBREo7QUFFRkUsU0FBSyxFQUFFLE1BRkw7QUFHRkMsWUFBUSxFQUFFO0FBSFIsR0FEd0M7QUFNOUNDLFVBQVEsRUFBRTtBQUNOSCxRQUFJLEVBQUVJLE1BREE7QUFFTkgsU0FBSyxFQUFFLE1BRkQ7QUFHTkMsWUFBUSxFQUFFO0FBSEo7QUFOb0MsQ0FBakIsQ0FBeEIsQzs7Ozs7Ozs7Ozs7QUNIUGxILE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNVLFFBQU0sRUFBQyxNQUFJQSxNQUFaO0FBQW1CMEcsYUFBVyxFQUFDLE1BQUlBO0FBQW5DLENBQWQ7QUFBK0QsSUFBSUMsS0FBSjtBQUFVdEgsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDMEcsT0FBSyxDQUFDekcsQ0FBRCxFQUFHO0FBQUN5RyxTQUFLLEdBQUN6RyxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBQWtELElBQUlpRyxZQUFKO0FBQWlCOUcsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDSSxTQUFPLENBQUNILENBQUQsRUFBRztBQUFDaUcsZ0JBQVksR0FBQ2pHLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTBHLFVBQUo7QUFBZXZILE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLFFBQVosRUFBcUI7QUFBQzJHLFlBQVUsQ0FBQzFHLENBQUQsRUFBRztBQUFDMEcsY0FBVSxHQUFDMUcsQ0FBWDtBQUFhOztBQUE1QixDQUFyQixFQUFtRCxDQUFuRDtBQUFzRCxJQUFJZ0csZUFBSjtBQUFvQjdHLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGFBQVosRUFBMEI7QUFBQ2lHLGlCQUFlLENBQUNoRyxDQUFELEVBQUc7QUFBQ2dHLG1CQUFlLEdBQUNoRyxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUIsRUFBa0UsQ0FBbEU7QUFFelIsTUFBTUYsTUFBTSxHQUFHLElBQUkyRyxLQUFLLENBQUNFLFVBQVYsQ0FBcUIsUUFBckIsQ0FBZjtBQU1BLE1BQU1ILFdBQVcsR0FBRyxJQUFJUCxZQUFKLENBQWlCO0FBQzFDMUUsWUFBVSxFQUFFO0FBQ1I0RSxRQUFJLEVBQUVTLE1BREU7QUFFUlIsU0FBSyxFQUFFLE9BRkM7QUFHUkMsWUFBUSxFQUFFO0FBSEYsR0FEOEI7QUFNMUNRLGtCQUFnQixFQUFFO0FBQ2RWLFFBQUksRUFBRVMsTUFEUTtBQUVkUixTQUFLLEVBQUUsYUFGTztBQUdkQyxZQUFRLEVBQUU7QUFISSxHQU53QjtBQVcxQzNHLFlBQVUsRUFBRTtBQUNSeUcsUUFBSSxFQUFFN0IsS0FERTtBQUVSOEIsU0FBSyxFQUFFLE9BRkM7QUFHUkMsWUFBUSxFQUFFO0FBSEYsR0FYOEI7QUFnQjFDLGtCQUFnQkwsZUFoQjBCO0FBZ0JUO0FBQ2pDeEUsY0FBWSxFQUFFO0FBQ1YyRSxRQUFJLEVBQUVGLFlBQVksQ0FBQ2EsT0FEVDtBQUVWVixTQUFLLEVBQUUsU0FGRztBQUdWQyxZQUFRLEVBQUU7QUFIQSxHQWpCNEI7QUFzQjFDVSxZQUFVLEVBQUU7QUFDUlosUUFBSSxFQUFFN0IsS0FERTtBQUVSOEIsU0FBSyxFQUFFLE9BRkM7QUFHUlksZ0JBQVksRUFBRTtBQUhOLEdBdEI4QjtBQTJCMUMsa0JBQWdCTixVQTNCMEI7QUEyQmQ7QUFFMUJ0RSxXQUFTLEVBQUU7QUFDVCtELFFBQUksRUFBRTdCLEtBREc7QUFFVDhCLFNBQUssRUFBRSxNQUZFO0FBR1RZLGdCQUFZLEVBQUU7QUFITCxHQTdCNkI7QUFrQzFDLGlCQUFlQyxNQWxDMkI7QUFrQ25CO0FBQ3ZCbkYsWUFBVSxFQUFFO0FBQ1JxRSxRQUFJLEVBQUU3QixLQURFO0FBRVI4QixTQUFLLEVBQUUsT0FGQztBQUdSWSxnQkFBWSxFQUFFO0FBSE4sR0FuQzhCO0FBd0MxQyxrQkFBZ0JDLE1BeEMwQjtBQXdDbEI7QUFDeEJDLGdCQUFjLEVBQUM7QUFDWGYsUUFBSSxFQUFFZ0IsSUFESztBQUVYQyxhQUFTLEVBQUUsWUFBVTtBQUFDLGFBQU8sSUFBSUQsSUFBSixFQUFQO0FBQW1CO0FBRjlCO0FBekMyQixDQUFqQixDQUFwQjtBQStDUHJILE1BQU0sQ0FBQ3VILFlBQVAsQ0FBb0JiLFdBQXBCLEU7Ozs7Ozs7Ozs7O0FDdkRBckgsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ2tJLE9BQUssRUFBQyxNQUFJQSxLQUFYO0FBQWlCQyxZQUFVLEVBQUMsTUFBSUE7QUFBaEMsQ0FBZDtBQUEyRCxJQUFJdEIsWUFBSjtBQUFpQjlHLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0ksU0FBTyxDQUFDSCxDQUFELEVBQUc7QUFBQ2lHLGdCQUFZLEdBQUNqRyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUl5RyxLQUFKO0FBQVV0SCxNQUFNLENBQUNZLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUMwRyxPQUFLLENBQUN6RyxDQUFELEVBQUc7QUFBQ3lHLFNBQUssR0FBQ3pHLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFJMUksTUFBTXNILEtBQUssR0FBRyxJQUFJYixLQUFLLENBQUNFLFVBQVYsQ0FBcUIsT0FBckIsQ0FBZDtBQUVBLE1BQU1ZLFVBQVUsR0FBRyxJQUFJdEIsWUFBSixDQUFpQjtBQUN6QzFELFFBQU0sRUFBRTtBQUNKNEQsUUFBSSxFQUFFUyxNQURGO0FBRUpSLFNBQUssRUFBRSxJQUZIO0FBR0pvQixTQUFLLEVBQUV2QixZQUFZLENBQUN3QixLQUFiLENBQW1CQztBQUh0QixHQURpQztBQU16Q0MsV0FBUyxFQUFFO0FBQ1B4QixRQUFJLEVBQUVTLE1BREM7QUFFUFIsU0FBSyxFQUFFLE9BRkE7QUFHUEMsWUFBUSxFQUFFO0FBSEgsR0FOOEI7QUFXekN1QixpQkFBZSxFQUFFO0FBQ2J6QixRQUFJLEVBQUVTLE1BRE87QUFFYlIsU0FBSyxFQUFFLGFBRk07QUFHYlksZ0JBQVksRUFBRTtBQUhELEdBWHdCO0FBZ0J6Q2EsU0FBTyxFQUFFO0FBQ0wxQixRQUFJLEVBQUU3QixLQUREO0FBRUw4QixTQUFLLEVBQUUsTUFGRjtBQUdMWSxnQkFBWSxFQUFFO0FBSFQsR0FoQmdDO0FBcUJ6QyxlQUFhQyxNQXJCNEI7QUFxQnBCO0FBQ3JCYSxhQUFXLEVBQUU7QUFDVDNCLFFBQUksRUFBRTdCLEtBREc7QUFFVDhCLFNBQUssRUFBRSxVQUZFO0FBR1RZLGdCQUFZLEVBQUU7QUFITCxHQXRCNEI7QUEyQnpDLG1CQUFpQkMsTUEzQndCO0FBMkJoQjtBQUN6QmMsZ0JBQWMsRUFBRTtBQUNaNUIsUUFBSSxFQUFFN0IsS0FETTtBQUVaOEIsU0FBSyxFQUFFLGFBRks7QUFHWlksZ0JBQVksRUFBRTtBQUhGLEdBNUJ5QjtBQWlDekMsc0JBQW9CQyxNQWpDcUI7QUFpQ2I7QUFDNUJlLGVBQWEsRUFBRTtBQUNYN0IsUUFBSSxFQUFFN0IsS0FESztBQUVYOEIsU0FBSyxFQUFFLFlBRkk7QUFHWFksZ0JBQVksRUFBRTtBQUhILEdBbEMwQjtBQXVDekMscUJBQW1CQyxNQXZDc0I7QUF1Q2Q7QUFDM0JnQixlQUFhLEVBQUM7QUFDWjlCLFFBQUksRUFBRWdCLElBRE07QUFFWkMsYUFBUyxFQUFFLFlBQVU7QUFBQyxhQUFPLElBQUlELElBQUosRUFBUDtBQUFtQjtBQUY3QjtBQXhDMkIsQ0FBakIsQ0FBbkI7QUE4Q1BHLEtBQUssQ0FBQ0QsWUFBTixDQUFtQkUsVUFBbkIsRTs7Ozs7Ozs7Ozs7QUNwREFwSSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDb0QsT0FBSyxFQUFDLE1BQUlBLEtBQVg7QUFBaUJrRSxZQUFVLEVBQUMsTUFBSUE7QUFBaEMsQ0FBZDtBQUEyRCxJQUFJVCxZQUFKO0FBQWlCOUcsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDSSxTQUFPLENBQUNILENBQUQsRUFBRztBQUFDaUcsZ0JBQVksR0FBQ2pHLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSXlHLEtBQUo7QUFBVXRILE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQzBHLE9BQUssQ0FBQ3pHLENBQUQsRUFBRztBQUFDeUcsU0FBSyxHQUFDekcsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUFrRCxJQUFJdUgsVUFBSjtBQUFlcEksTUFBTSxDQUFDWSxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDd0gsWUFBVSxDQUFDdkgsQ0FBRCxFQUFHO0FBQUN1SCxjQUFVLEdBQUN2SCxDQUFYO0FBQWE7O0FBQTVCLENBQXJCLEVBQW1ELENBQW5EO0FBSzNNLE1BQU13QyxLQUFLLEdBQUcsSUFBSWlFLEtBQUssQ0FBQ0UsVUFBVixDQUFxQixPQUFyQixDQUFkO0FBRUEsTUFBTUQsVUFBVSxHQUFHLElBQUlULFlBQUosQ0FBaUI7QUFDekMzRCxRQUFNLEVBQUU7QUFDTjZELFFBQUksRUFBRVMsTUFEQTtBQUVOUixTQUFLLEVBQUUsSUFGRDtBQUdOb0IsU0FBSyxFQUFFdkIsWUFBWSxDQUFDd0IsS0FBYixDQUFtQkM7QUFIcEIsR0FEaUM7QUFNekM5RSxXQUFTLEVBQUU7QUFDVHVELFFBQUksRUFBRVMsTUFERztBQUVUUixTQUFLLEVBQUUsT0FGRTtBQUdUQyxZQUFRLEVBQUU7QUFIRCxHQU44QjtBQVd6Q2pGLFVBQVEsRUFBQztBQUNQK0UsUUFBSSxFQUFFN0IsS0FEQztBQUVQOEIsU0FBSyxFQUFFLE9BRkE7QUFHUFksZ0JBQVksRUFBRTtBQUhQLEdBWGdDO0FBZ0J6QyxnQkFBY08sVUFoQjJCO0FBZ0JmO0FBQzFCVSxlQUFhLEVBQUM7QUFDWjlCLFFBQUksRUFBRWdCLElBRE07QUFFWkMsYUFBUyxFQUFFLFlBQVU7QUFBQyxhQUFPLElBQUlELElBQUosRUFBUDtBQUFtQjtBQUY3QjtBQWpCMkIsQ0FBakIsQ0FBbkI7QUF1QlAzRSxLQUFLLENBQUM2RSxZQUFOLENBQW1CWCxVQUFuQixFOzs7Ozs7Ozs7OztBQzlCQXZILE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUMrRSxNQUFJLEVBQUMsTUFBSUE7QUFBVixDQUFkO0FBQStCLElBQUlzQyxLQUFKO0FBQVV0SCxNQUFNLENBQUNZLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUMwRyxPQUFLLENBQUN6RyxDQUFELEVBQUc7QUFBQ3lHLFNBQUssR0FBQ3pHLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSWlHLFlBQUo7QUFBaUI5RyxNQUFNLENBQUNZLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNJLFNBQU8sQ0FBQ0gsQ0FBRCxFQUFHO0FBQUNpRyxnQkFBWSxHQUFDakcsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJa0csVUFBSjtBQUFlL0csTUFBTSxDQUFDWSxJQUFQLENBQVksWUFBWixFQUF5QjtBQUFDbUcsWUFBVSxDQUFDbEcsQ0FBRCxFQUFHO0FBQUNrRyxjQUFVLEdBQUNsRyxDQUFYO0FBQWE7O0FBQTVCLENBQXpCLEVBQXVELENBQXZEO0FBSS9LLE1BQU1tRSxJQUFJLEdBQUcsSUFBSXNDLEtBQUssQ0FBQ0UsVUFBVixDQUFxQixPQUFyQixDQUFiO0FBRVAsTUFBTXVCLFVBQVUsR0FBRyxJQUFJakMsWUFBSixDQUFpQjtBQUNoQ3pCLFVBQVEsRUFBRTtBQUNOMkIsUUFBSSxFQUFFUyxNQURBO0FBRU5SLFNBQUssRUFBRTtBQUZELEdBRHNCO0FBS2hDMUIsaUJBQWUsRUFBRTtBQUNieUIsUUFBSSxFQUFFUyxNQURPO0FBRWJSLFNBQUssRUFBRSxhQUZNO0FBR2JZLGdCQUFZLEVBQUU7QUFIRCxHQUxlO0FBVWhDckMsV0FBUyxFQUFHO0FBQ1J3QixRQUFJLEVBQUVTLE1BREU7QUFFUlIsU0FBSyxFQUFFO0FBRkMsR0FWb0I7QUFjaEN4QixhQUFXLEVBQUM7QUFDUnVCLFFBQUksRUFBRTdCLEtBREU7QUFFUjhCLFNBQUssRUFBRyxTQUZBO0FBR1JZLGdCQUFZLEVBQUU7QUFITixHQWRvQjtBQW1CaEMsbUJBQWlCZDtBQW5CZSxDQUFqQixDQUFuQjtBQXVCQS9CLElBQUksQ0FBQ2tELFlBQUwsQ0FBa0JhLFVBQWxCLEU7Ozs7Ozs7Ozs7O0FDN0JBL0ksTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQzhHLFlBQVUsRUFBQyxNQUFJQTtBQUFoQixDQUFkO0FBQTJDLElBQUlELFlBQUo7QUFBaUI5RyxNQUFNLENBQUNZLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNJLFNBQU8sQ0FBQ0gsQ0FBRCxFQUFHO0FBQUNpRyxnQkFBWSxHQUFDakcsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUU1RCxNQUFNbUksaUJBQWlCLEdBQUcsSUFBSWxDLFlBQUosQ0FBaUI7QUFDdkNsQyxXQUFTLEVBQUU7QUFDUG9DLFFBQUksRUFBRVMsTUFEQztBQUVQd0IsWUFBUSxFQUFFO0FBRkgsR0FENEI7QUFLdkNwRSxVQUFRLEVBQUU7QUFDTm1DLFFBQUksRUFBRVMsTUFEQTtBQUVOd0IsWUFBUSxFQUFFO0FBRkosR0FMNkI7QUFTdkNsRSxPQUFLLEVBQUc7QUFDSmlDLFFBQUksRUFBRVMsTUFERjtBQUVKd0IsWUFBUSxFQUFFO0FBRk4sR0FUK0I7QUFhdkNDLGVBQWEsRUFBRTtBQUNYbEMsUUFBSSxFQUFFbUMsT0FESztBQUVYRixZQUFRLEVBQUU7QUFGQztBQWJ3QixDQUFqQixDQUExQjtBQW1CTyxNQUFNbEMsVUFBVSxHQUFHLElBQUlELFlBQUosQ0FBaUI7QUFDdkNyQyxVQUFRLEVBQUU7QUFDTnVDLFFBQUksRUFBRVMsTUFEQTtBQUVOO0FBQ0E7QUFDQTtBQUNBd0IsWUFBUSxFQUFFO0FBTEosR0FENkI7QUFRdkM5QyxRQUFNLEVBQUU7QUFDSmEsUUFBSSxFQUFFN0IsS0FERjtBQUVKO0FBQ0E7QUFDQTtBQUNBOEQsWUFBUSxFQUFFO0FBTE4sR0FSK0I7QUFldkMsY0FBWTtBQUNSakMsUUFBSSxFQUFFYztBQURFLEdBZjJCO0FBa0J2QyxzQkFBb0I7QUFDaEJkLFFBQUksRUFBRVMsTUFEVTtBQUVoQlksU0FBSyxFQUFFdkIsWUFBWSxDQUFDd0IsS0FBYixDQUFtQmM7QUFGVixHQWxCbUI7QUFzQnZDLHVCQUFxQjtBQUNqQnBDLFFBQUksRUFBRW1DO0FBRFcsR0F0QmtCO0FBeUJ2QztBQUNBRSxtQkFBaUIsRUFBRTtBQUNmckMsUUFBSSxFQUFFN0IsS0FEUztBQUVmOEQsWUFBUSxFQUFFO0FBRkssR0ExQm9CO0FBOEJ2Qyx5QkFBdUI7QUFDbkJqQyxRQUFJLEVBQUVjLE1BRGE7QUFFbkJ3QixZQUFRLEVBQUU7QUFGUyxHQTlCZ0I7QUFrQ3ZDQyxXQUFTLEVBQUU7QUFDUHZDLFFBQUksRUFBRWdCO0FBREMsR0FsQzRCO0FBcUN2Q2xDLFNBQU8sRUFBRTtBQUNMa0IsUUFBSSxFQUFFZ0MsaUJBREQ7QUFFTEMsWUFBUSxFQUFFO0FBRkwsR0FyQzhCO0FBeUN2QztBQUNBTyxVQUFRLEVBQUU7QUFDTnhDLFFBQUksRUFBRWMsTUFEQTtBQUVObUIsWUFBUSxFQUFFLElBRko7QUFHTkssWUFBUSxFQUFFO0FBSEosR0ExQzZCO0FBK0N2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FHLE9BQUssRUFBRTtBQUNIekMsUUFBSSxFQUFFYyxNQURIO0FBRUhtQixZQUFRLEVBQUUsSUFGUDtBQUdISyxZQUFRLEVBQUU7QUFIUCxHQXZEZ0M7QUE0RHZDO0FBQ0E7QUFDQTtBQUNBRyxPQUFLLEVBQUU7QUFDSHpDLFFBQUksRUFBRTdCLEtBREg7QUFFSDhELFlBQVEsRUFBRTtBQUZQLEdBL0RnQztBQW1FdkMsYUFBVztBQUNQakMsUUFBSSxFQUFFUztBQURDLEdBbkU0QjtBQXNFdkM7QUFDQWlDLFdBQVMsRUFBRTtBQUNQMUMsUUFBSSxFQUFFZ0IsSUFEQztBQUVQaUIsWUFBUSxFQUFFO0FBRkg7QUF2RTRCLENBQWpCLENBQW5CO0FBNkVQbkksTUFBTSxDQUFDMEQsS0FBUCxDQUFhMEQsWUFBYixDQUEwQm5CLFVBQTFCLEU7Ozs7Ozs7Ozs7O0FDbEdBLElBQUlqRyxNQUFKO0FBQVdkLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0UsUUFBTSxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsVUFBTSxHQUFDRCxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFEYixNQUFNLENBQUNZLElBQVAsQ0FBWSxnQkFBWjtBQUE4QlosTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWjtBQUE0QlosTUFBTSxDQUFDWSxJQUFQLENBQVksYUFBWjtBQUEyQlosTUFBTSxDQUFDWSxJQUFQLENBQVksYUFBWjtBQU9ySkUsTUFBTSxDQUFDNkksT0FBUCxDQUFlLE1BQU0sQ0FFcEIsQ0FGRCxFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgYm9hcmRVdGlscyB7XHJcblxyXG4gICAgc3RhdGljIGNoZWNrSW5Cb2FyZFVzZXIoaWRVc2VyLCBib2FyZCl7XHJcbiAgICAgICAgbGV0IGlzSW4gPSBmYWxzZVxyXG4gICAgICAgIGJvYXJkLmJvYXJkVXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHVzZXIuX2lkID09IGlkVXNlcil7XHJcbiAgICAgICAgICAgICAgICBpc0luID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGlzSW5cclxuICAgIH1cclxufSIsImltcG9ydCB7Qm9hcmRzfSBmcm9tIFwiLi4vbW9kZWxzL0JvYXJkc1wiO1xyXG5pbXBvcnQge01ldGVvcn0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcclxuaW1wb3J0IHtib2FyZFV0aWxzfSBmcm9tIFwiLi9VdGlscy9ib2FyZFV0aWxzXCI7XHJcbmltcG9ydCBydXNGdW5jdGlvbiBmcm9tICdydXMtZGlmZidcclxuXHJcbk1ldGVvci5wdWJsaXNoKCdib2FyZHMnLCBmdW5jdGlvbiAoKSB7cmV0dXJuIEJvYXJkcy5maW5kKCl9KTtcclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuXHJcbiAgICAnYm9hcmRzLmNyZWF0ZUJvYXJkJyhib2FyZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGVzdFwiKVxyXG4gICAgICAgIGlmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGJvYXJkKVxyXG4gICAgICAgICAgICByZXR1cm4gQm9hcmRzLmluc2VydChib2FyZCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmRzLmdldEJvYXJkJyAoaWRCb2FyZCkge1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJib2FyZElkXCI6IGlkQm9hcmR9KS5jb3VudCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvdW50RG9jKVxyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogaWRCb2FyZH0pO1xyXG4gICAgICAgICAgICAvL2lmKGJvYXJkLmJvYXJkUHJpdmFjeSA9PSAxKXtcclxuICAgICAgICAgICAgICAvLyAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgICAgICAgIC8vICAgICAgcmV0dXJuIGJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBvbiB0aGlzIGFsbG93IHRvIHNlZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgIC8vICAgIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9hcmRcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKidib2FyZHMuZ2V0Qm9hcmRGcm9tRXh0JyAoaWRCb2FyZCx0b2tlbikge1xyXG4gICAgICAgIGxldCBkZWNvZGVkVG9rZW4gPSBcInhkXCJcclxuICAgICAgICBsZXQgYm9hcmQ7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGlkQm9hcmR9KS5jb3VudCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvdW50RG9jKVxyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogaWRCb2FyZH0pO1xyXG4gICAgICAgICAgICBpZihib2FyZC5ib2FyZFByaXZhY3kgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICBpZih0b2tlbi51c2VySWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBvbiB0aGlzIGFsbG93IHRvIHNlZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSwqL1xyXG5cclxuICAgICdib2FyZHMucmVtb3ZlQm9hcmQnKGJvYXJkSWQpIHtcclxuICAgICAgICBsZXQgYm9hcmQ7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY291bnREb2MpXHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgICAvLyAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQm9hcmRzLnJlbW92ZShib2FyZElkKTtcclxuICAgICAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkcy5lZGl0Qm9hcmQnIChuZXdCb2FyZCkge1xyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcImJvYXJkSWRcIjogbmV3Qm9hcmQuYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5cIilcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobmV3Qm9hcmQuYm9hcmRMaXN0WzBdLmxpc3RDYXJkWzBdKVxyXG4gICAgICAgICAgICBCb2FyZHMudXBkYXRlKHtib2FyZElkOiBuZXdCb2FyZC5ib2FyZElkfSwge1xyXG4gICAgICAgICAgICAgICAgJHNldDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkVGl0bGU6IG5ld0JvYXJkLmJvYXJkVGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRQcml2YWN5OiBuZXdCb2FyZC5wcml2YWN5LFxyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkVXNlcnM6IG5ld0JvYXJkLmJvYXJkVXNlcnNcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgIC8qbmV3Qm9hcmQuYm9hcmRMaXN0LmZvckVhY2goKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBCb2FyZHMudXBkYXRlKHtib2FyZElkOiBuZXdCb2FyZC5ib2FyZElkLCAnYm9hcmRMaXN0Lmxpc3RJZCc6IGxpc3QubGlzdElkfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvYXJkTGlzdC5saXN0Lmxpc3RDYXJkLiRbXVwiOiBsaXN0Lmxpc3RDYXJkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KSovXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8qbmV3Qm9hcmQuYm9hcmRMaXN0LmZvckVhY2goKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIEJvYXJkcy51cGRhdGUoe2JvYXJkSWQ6IG5ld0JvYXJkLmJvYXJkSWQsIFwiYm9hcmRMaXN0Lmxpc3RJZFwiOiBsaXN0Lmxpc3RJZH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkVGl0bGU6IG5ld0JvYXJkLmJvYXJkVGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkUHJpdmFjeTogbmV3Qm9hcmQucHJpdmFjeSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KSovXHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmQuZ2V0QWxsQm9hcmRzJyAoKXtcclxuICAgICAgICByZXR1cm4gQm9hcmRzLmZpbmQoKS5mZXRjaCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmQuZ2V0VXNlckFsbEJvYXJkcycgKHVzZXJJZCl7XHJcbiAgICAgICAgbGV0IGFsbEJvYXJkcyA9IEJvYXJkcy5maW5kKCkuZmV0Y2goKVxyXG4gICAgICAgIGxldCB1c2VyQm9hcmQgPSBbXVxyXG4gICAgICAgIGFsbEJvYXJkcy5tYXAoKGJvYXJkKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcih1c2VySWQpKXtcclxuICAgICAgICAgICAgICAgIHVzZXJCb2FyZC5wdXNoKGJvYXJkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbEJvYXJkc1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkLmdldFRlYW0nIChib2FyZElkKXtcclxuICAgICAgICBsZXQgYm9hcmQ7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogYm9hcmRJZH0pO1xyXG4gICAgICAgICAgICAvL2lmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQuYm9hcmRUZWFtcztcclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGFsbG93IHRvIGRlbGV0ZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgICdib2FyZC5nZXRDYXJkcycgKGJvYXJkSWQpIHtcclxuICAgICAgICBsZXQgYm9hcmQ7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogYm9hcmRJZH0pO1xyXG4gICAgICAgICAgICAvL2lmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICBsZXQgY2FyZHMgPSBbXVxyXG4gICAgICAgICAgICBib2FyZC5ib2FyZExpc3QubWFwKChsaXN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNBbm5vdGF0b3JcclxuICAgICAgICAgICAgICAgIGxldCB0aGVMaXN0ID0gTWV0ZW9yLmNhbGwoJ2dldExpc3QnLGxpc3QuX2lkKVxyXG4gICAgICAgICAgICAgICAgdGhlTGlzdC5saXN0Q2FyZC5tYXAoKGNhcmQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkcy5wdXNoKGNhcmQpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNhcmRzXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkcy5nZXRUYWdzJyAoYm9hcmRJZCkge1xyXG4gICAgICAgIGxldCBib2FyZFxyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcIl9pZFwiOiBib2FyZElkfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgYm9hcmQgPSBCb2FyZHMuZmluZE9uZSh7XCJib2FyZElkXCI6IGJvYXJkSWR9KTtcclxuICAgICAgICAgICAgLy9pZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAvLyAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgcmV0dXJuIGJvYXJkLmJvYXJkVGFnc1xyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYWxsb3cgdG8gZGVsZXRlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZHMuZ2V0TGlzdHMnIChib2FyZElkKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkXHJcbiAgICAgICAgbGV0IGxpc3RzID0gW11cclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgLy8gIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgIGJvYXJkLmJvYXJkTGlzdC5tYXAoKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0aGVMaXN0ID0gTWV0ZW9yLmNhbGwoJ2xpc3QuZ2V0TGlzdCcsbGlzdC5faWQpXHJcbiAgICAgICAgICAgICAgICBsaXN0cy5wdXNoKHRoZUxpc3QpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0c1xyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYWxsb3cgdG8gZGVsZXRlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ2JvYXJkLmFyY2hpdmVMaXN0JyAoYm9hcmRJZCxsaXN0SWQpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZC5hcmNoaXZlQ2FyZCcgKGJvYXJkSWQsIGNhcmRJZCkge1xyXG5cclxuICAgIH1cclxuXHJcbn0pXHJcbiIsImltcG9ydCB7TGlzdHN9IGZyb20gXCIuLi9tb2RlbHMvTGlzdFwiO1xyXG5pbXBvcnQge01ldGVvcn0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcclxuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnbWV0ZW9yL3JhbmRvbSc7XHJcbmltcG9ydCB7IEpzb25Sb3V0ZXMgfSBmcm9tICdtZXRlb3Ivc2ltcGxlOmpzb24tcm91dGVzJztcclxuXHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgICAnbGlzdC5jcmVhdGVMaXN0JyhsaXN0TmFtZSkge1xyXG4gICAgICAgIHJldHVybiBMaXN0cy5pbnNlcnQoe2xpc3RUaXRsZTogbGlzdE5hbWV9KVxyXG4gICAgfSxcclxuXHJcbiAgICAnbGlzdC5nZXRMaXN0JyAoaWRMaXN0KSB7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gTGlzdHMuZmluZCh7XCJfaWRcIjogaWRMaXN0fSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBMaXN0LmZpbmRPbmUoe1wiX2lkXCI6IGlkTGlzdH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0xpc3Qgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgICdsaXN0LmRlbGV0ZUxpc3QnKGlkQm9hcmQsIGlkTGlzdCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgJ2xpc3QuZWRpdExpc3QnIChsaXN0KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnbGlzdC5nZXRBbGxMaXN0JyAoKXtcclxuXHJcbiAgICB9XHJcbn0pXHJcblxyXG4vLyBjb2RlIHRvIHJ1biBvbiBzZXJ2ZXIgYXQgc3RhcnR1cFxyXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XHJcbiAgICBpZihyZXEucXVlcnkuZXJyb3IpIHtcclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XHJcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiBcIkVSUk9SXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpO1xyXG59KTtcclxuXHJcblxyXG5Kc29uUm91dGVzLmFkZCgncG9zdCcsICcvc2lnblVwLycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XHJcbiAgICBjb25zb2xlLmxvZyhyZXEpXHJcbiAgICBNZXRlb3IudXNlcnMuaW5zZXJ0KHtcclxuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkuc3RhdGUudXNlcm5hbWUsXHJcbiAgICAgICAgZmlyc3RuYW1lOiByZXEuYm9keS5zdGF0ZS5maXJzdG5hbWUsXHJcbiAgICAgICAgbGFzdG5hbWU6IHJlcS5ib2R5LnN0YXRlLmxhc3RuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5zdGF0ZS5wYXNzd29yZCxcclxuICAgICAgICBlbWFpbDogcmVxLmJvZHkuc3RhdGUuZW1haWxcclxuICAgIH0pXHJcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICByZXN1bHQ6IE1ldGVvci51c2Vycy5maW5kKCkuZmV0Y2goKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTtcclxuXHJcbiIsImltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xyXG5pbXBvcnQge1RlYW19ICBmcm9tIFwiLi4vbW9kZWxzL1RlYW1cIjtcclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgIFwidGVhbXMuY3JlYXRlVGVhbVwiKHRlYW0pe1xyXG4gICAgICAgIGlmKCF0aGlzLnVzZXJJZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ05vdC1BdXRob3JpemVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vbGV0IHRlYW1EZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnRlYW1EZXNjcmlwdGlvbiA/IGRlc2NyaXB0aW9uLnRlYW1EZXNjcmlwdGlvbiA6IFwiXCJcclxuICAgICAgICAvL2xldCBvd25lciA9IE1ldGVvci51c2Vycy5maW5kT25lKHRoaXMudXNlcklkKVxyXG4gICAgICAgbGV0IHRlYW1NZW1iZXIgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgIHRlYW1NZW1iZXIucHVzaCh0ZWFtLnRlYW1Vc2Vyc1swXS51c2VyKVxyXG4gICAgICBcclxuICAgICAgICByZXR1cm4gVGVhbS5pbnNlcnQoe1xyXG4gICAgICAgICAgICB0ZWFtTmFtZTogdGVhbS50ZWFtVGl0bGUsXHJcbiAgICAgICAgICAgIHRlYW1EZXNjcmlwdGlvbjogdGVhbS50ZWFtRGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIHRlYW1Pd25lciA6IHRoaXMudXNlcklkLFxyXG4gICAgICAgICAgICB0ZWFtTWVtYmVycyA6IHRlYW1NZW1iZXJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgICdnZXRUZWFtcycoKXtcclxuICAgICAgICAvL2NoZWNrKHRlYW1JZCxTdHJpbmcpXHJcbiAgICAgICBpZighdGhpcy51c2VySWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXNlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlYW1zID0gVGVhbS5maW5kKCk7XHJcblxyXG4gICAgICAgIGlmKHRlYW1zKVxyXG4gICAgICAgICAgICByZXR1cm4gdGVhbXNcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ1RlYW0gbm90IGZvdW5kJylcclxuICAgIH1cclxuXHJcbn0pOyIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xyXG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcclxuXHJcbk1ldGVvci5wdWJsaXNoKCd1c2VycycsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZih0aGlzLnVzZXJJZCkgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKHtfaWQ6IHskbmU6IHRoaXMudXNlcklkfX0sIHtmaWVsZHM6IHsgcHJvZmlsZTogMSB9fSk7XHJcbn0pO1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goJ3VzZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoe19pZDogdGhpcy51c2VySWR9KTtcclxufSk7XHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgICBcInVzZXJzLnNpZ25VcFwiKHtsYXN0bmFtZSwgZmlyc3RuYW1lLCBlbWFpbCwgcGFzc3dvcmR9KXtcclxuICAgICAgICBpZihwYXNzd29yZC5sZW5ndGggPCA2KSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiVG9vIHNob3J0IHBhc3N3b3JkLCBhdCBsZWFzdCA2IGNoYXJhY3RlcnMuXCIpXHJcbiAgICAgICAgZWxzZSBpZighZW1haWwgfHwgIWxhc3RuYW1lIHx8ICFmaXJzdG5hbWUpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJTb21lIGZpZWxkIGFyZSBlbXB0eS5cIilcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdG5hbWU6IGxhc3RuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0bmFtZTogZmlyc3RuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWRNYWlsczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgQWNjb3VudHMuY3JlYXRlVXNlcihvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ1c2Vycy51cGRhdGVQcm9maWxlXCIoZW1haWwsIGxhc3RuYW1lLCBmaXJzdG5hbWUpe1xyXG4gICAgICAgIE1ldGVvci51c2Vycy51cGRhdGUoTWV0ZW9yLnVzZXJJZCgpLCB7ICRzZXQ6IHtcclxuICAgICAgICAgICAgZW1haWxzOiBbe2FkZHJlc3M6IGVtYWlsLCB2ZXJpZmllZDogdHJ1ZX1dLFxyXG4gICAgICAgICAgICAncHJvZmlsZS5sYXN0bmFtZSc6IGxhc3RuYW1lLFxyXG4gICAgICAgICAgICAncHJvZmlsZS5maXJzdG5hbWUnOiBmaXJzdG5hbWUsXHJcbiAgICAgICAgICAgICdwcm9maWxlLmVtYWlsJzogZW1haWxcclxuICAgICAgICB9fSk7XHJcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2VyKCk7XHJcbiAgICB9LFxyXG4gICAgJ3VzZXJzLmNoYW5nZVBhc3N3b3JkJyhhY3R1YWxQYXNzd29yZCwgbmV3UGFzc3dvcmQpe1xyXG4gICAgICAgIGxldCBjaGVja1Bhc3N3b3JkID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoTWV0ZW9yLnVzZXIoKSwgYWN0dWFsUGFzc3dvcmQpO1xyXG4gICAgICAgIGlmKGNoZWNrUGFzc3dvcmQuZXJyb3IpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoY2hlY2tQYXNzd29yZC5lcnJvci5yZWFzb24pXHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgQWNjb3VudHMuc2V0UGFzc3dvcmQoTWV0ZW9yLnVzZXJJZCgpLCBuZXdQYXNzd29yZCwge2xvZ291dDogZmFsc2V9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ3VzZXJzLnNldEVuYWJsZWRNYWlscycoZW5hYmxlZE1haWxzKXtcclxuICAgICAgICBNZXRlb3IudXNlcnMudXBkYXRlKE1ldGVvci51c2VySWQoKSwgeyAkc2V0OiB7XHJcbiAgICAgICAgICAgICdwcm9maWxlLmVuYWJsZWRNYWlscyc6IGVuYWJsZWRNYWlsc1xyXG4gICAgICAgIH19KTtcclxuICAgICAgICByZXR1cm4gTWV0ZW9yLnVzZXIoKTtcclxuICAgIH0sXHJcbiAgICAndXNlcnMucmVtb3ZlJygpe1xyXG4gICAgICAgIE1ldGVvci51c2Vycy5yZW1vdmUoTWV0ZW9yLnVzZXJJZCgpKTtcclxuICAgIH0sXHJcbiAgICBcInVzZXJzLmdldFVzZXJcIihlbWFpbCl7XHJcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kT25lKHtcInByb2ZpbGUuZW1haWxcIjogZW1haWx9KTtcclxuICAgIH0sXHJcbiAgICBcInVzZXJzLmdldFVzZXJzXCIoKXtcclxuICAgICAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoKTtcclxuICAgIH1cclxufSkiLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcbmltcG9ydCB7IFVzZXJTY2hlbWEgfSBmcm9tICcuL1VzZXJzJztcclxuXHJcbmV4cG9ydCBjb25zdCBCb2FyZFVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICB1c2VyOiB7XHJcbiAgICAgIHR5cGU6IFVzZXJTY2hlbWEsXHJcbiAgICAgIGxhYmVsOiBcIlVzZXJcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIHVzZXJSb2xlOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgbGFiZWw6IFwiUm9sZVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH1cclxufSk7IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcblxyXG5leHBvcnQgY29uc3QgQm9hcmRzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2JvYXJkcycpXHJcblxyXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcbmltcG9ydCB7TGlzdFNjaGVtYX0gZnJvbSBcIi4vTGlzdFwiO1xyXG5pbXBvcnQgeyBCb2FyZFVzZXJTY2hlbWEgfSBmcm9tICcuL0JvYXJkVXNlcic7XHJcblxyXG5leHBvcnQgY29uc3QgQm9hcmRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBib2FyZFRpdGxlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiVGl0bGVcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIGJvYXJkRGVzY3JpcHRpb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJEZXNjcmlwdGlvblwiLFxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICB9LFxyXG4gIGJvYXJkVXNlcnM6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIlVzZXJzXCIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfSxcclxuICAnYm9hcmRVc2Vycy4kJzogQm9hcmRVc2VyU2NoZW1hLCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGJvYXJkUHJpdmFjeToge1xyXG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcclxuICAgICAgbGFiZWw6IFwiUHJpdmFjeVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgYm9hcmRMaXN0czoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiTGlzdHNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2JvYXJkTGlzdHMuJCc6IExpc3RTY2hlbWEsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcblxyXG4gICAgYm9hcmRUYWdzOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJUYWdzXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdib2FyZFRhZ3MuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBib2FyZFRlYW1zOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJUZWFtc1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnYm9hcmRUZWFtcy4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGJvYXJkQ3JlYXRlZEF0OntcclxuICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgYXV0b1ZhbHVlOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRGF0ZSgpO31cclxuICB9XHJcbn0pO1xyXG5cclxuQm9hcmRzLmF0dGFjaFNjaGVtYShCb2FyZFNjaGVtYSk7IiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5cclxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcblxyXG5leHBvcnQgY29uc3QgQ2FyZHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignY2FyZHMnKVxyXG5cclxuZXhwb3J0IGNvbnN0IENhcmRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBjYXJkSWQ6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJJZFwiLFxyXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXHJcbiAgfSxcclxuICBjYXJkVGl0bGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJUaXRsZVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgY2FyZERlc2NyaXB0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgY2FyZFRhZzoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiVGFnc1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZFRhZy4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGNhcmRDb21tZW50OiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJDb21tZW50c1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZENvbW1lbnQuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBjYXJkQXR0YWNobWVudDoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiQXR0YWNobWVudHNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2NhcmRBdHRhY2htZW50LiQnOiBPYmplY3QsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgY2FyZENoZWNrbGlzdDoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiQ2hlY2tMaXN0c1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZENoZWNrbGlzdC4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGxpc3RDcmVhdGVkQXQ6e1xyXG4gICAgdHlwZTogRGF0ZSxcclxuICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IERhdGUoKTt9XHJcbn1cclxufSk7XHJcblxyXG5DYXJkcy5hdHRhY2hTY2hlbWEoQ2FyZFNjaGVtYSk7IiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5cclxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcbmltcG9ydCB7Q2FyZFNjaGVtYX0gZnJvbSBcIi4vQ2FyZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IExpc3RzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2xpc3RzJylcclxuXHJcbmV4cG9ydCBjb25zdCBMaXN0U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgbGlzdElkOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBsYWJlbDogXCJJZFwiLFxyXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxyXG4gIH0sXHJcbiAgbGlzdFRpdGxlOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBsYWJlbDogXCJUaXRsZVwiLFxyXG4gICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIGxpc3RDYXJkOntcclxuICAgIHR5cGU6IEFycmF5LFxyXG4gICAgbGFiZWw6IFwiQ2FyZHNcIixcclxuICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdsaXN0Q2FyZC4kJzogQ2FyZFNjaGVtYSwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBsaXN0Q3JlYXRlZEF0OntcclxuICAgIHR5cGU6IERhdGUsXHJcbiAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBEYXRlKCk7fVxyXG59XHJcbn0pO1xyXG5cclxuTGlzdHMuYXR0YWNoU2NoZW1hKExpc3RTY2hlbWEpOyIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJ1xyXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcbmltcG9ydCB7VXNlclNjaGVtYX0gZnJvbSAnLi9Vc2Vycy5qcydcclxuXHJcbmV4cG9ydCBjb25zdCBUZWFtID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3RlYW1zJyk7XHJcblxyXG5jb25zdCBUZWFtU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgICB0ZWFtTmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBsYWJlbDogXCJOYW1lXCIsXHJcbiAgICB9LFxyXG4gICAgdGVhbURlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGxhYmVsOiBcIkRlc2NyaXB0aW9uXCIsXHJcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiIFxyXG4gICAgfSxcclxuICAgIHRlYW1Pd25lciA6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgbGFiZWw6IFwiT3duZXJcIlxyXG4gICAgfSxcclxuICAgIHRlYW1NZW1iZXJzOntcclxuICAgICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgICBsYWJlbCA6IFwiTWVtYmVyc1wiLFxyXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICAgIH0sXHJcbiAgICAndGVhbU1lbWJlcnMuJCc6IFVzZXJTY2hlbWFcclxufSk7XHJcblxyXG5cclxuVGVhbS5hdHRhY2hTY2hlbWEoVGVhbVNjaGVtYSk7IiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5cclxuY29uc3QgVXNlclByb2ZpbGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgZW1haWwgOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgZW5uYWJsZWRNYWlsczoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gICAgdXNlcm5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgLy8gRm9yIGFjY291bnRzLXBhc3N3b3JkLCBlaXRoZXIgZW1haWxzIG9yIHVzZXJuYW1lIGlzIHJlcXVpcmVkLCBidXQgbm90IGJvdGguIEl0IGlzIE9LIHRvIG1ha2UgdGhpc1xyXG4gICAgICAgIC8vIG9wdGlvbmFsIGhlcmUgYmVjYXVzZSB0aGUgYWNjb3VudHMtcGFzc3dvcmQgcGFja2FnZSBkb2VzIGl0cyBvd24gdmFsaWRhdGlvbi5cclxuICAgICAgICAvLyBUaGlyZC1wYXJ0eSBsb2dpbiBwYWNrYWdlcyBtYXkgbm90IHJlcXVpcmUgZWl0aGVyLiBBZGp1c3QgdGhpcyBzY2hlbWEgYXMgbmVjZXNzYXJ5IGZvciB5b3VyIHVzYWdlLlxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgZW1haWxzOiB7XHJcbiAgICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgICAgLy8gRm9yIGFjY291bnRzLXBhc3N3b3JkLCBlaXRoZXIgZW1haWxzIG9yIHVzZXJuYW1lIGlzIHJlcXVpcmVkLCBidXQgbm90IGJvdGguIEl0IGlzIE9LIHRvIG1ha2UgdGhpc1xyXG4gICAgICAgIC8vIG9wdGlvbmFsIGhlcmUgYmVjYXVzZSB0aGUgYWNjb3VudHMtcGFzc3dvcmQgcGFja2FnZSBkb2VzIGl0cyBvd24gdmFsaWRhdGlvbi5cclxuICAgICAgICAvLyBUaGlyZC1wYXJ0eSBsb2dpbiBwYWNrYWdlcyBtYXkgbm90IHJlcXVpcmUgZWl0aGVyLiBBZGp1c3QgdGhpcyBzY2hlbWEgYXMgbmVjZXNzYXJ5IGZvciB5b3VyIHVzYWdlLlxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgXCJlbWFpbHMuJFwiOiB7XHJcbiAgICAgICAgdHlwZTogT2JqZWN0XHJcbiAgICB9LFxyXG4gICAgXCJlbWFpbHMuJC5hZGRyZXNzXCI6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxyXG4gICAgfSxcclxuICAgIFwiZW1haWxzLiQudmVyaWZpZWRcIjoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW5cclxuICAgIH0sXHJcbiAgICAvLyBVc2UgdGhpcyByZWdpc3RlcmVkX2VtYWlscyBmaWVsZCBpZiB5b3UgYXJlIHVzaW5nIHNwbGVuZGlkbzptZXRlb3ItYWNjb3VudHMtZW1haWxzLWZpZWxkIC8gc3BsZW5kaWRvOm1ldGVvci1hY2NvdW50cy1tZWxkXHJcbiAgICByZWdpc3RlcmVkX2VtYWlsczoge1xyXG4gICAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgJ3JlZ2lzdGVyZWRfZW1haWxzLiQnOiB7XHJcbiAgICAgICAgdHlwZTogT2JqZWN0LFxyXG4gICAgICAgIGJsYWNrYm94OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgY3JlYXRlZEF0OiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZVxyXG4gICAgfSxcclxuICAgIHByb2ZpbGU6IHtcclxuICAgICAgICB0eXBlOiBVc2VyUHJvZmlsZVNjaGVtYSxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIC8vIE1ha2Ugc3VyZSB0aGlzIHNlcnZpY2VzIGZpZWxkIGlzIGluIHlvdXIgc2NoZW1hIGlmIHlvdSdyZSB1c2luZyBhbnkgb2YgdGhlIGFjY291bnRzIHBhY2thZ2VzXHJcbiAgICBzZXJ2aWNlczoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdCxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcclxuICAgICAgICBibGFja2JveDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIC8vIEFkZCBgcm9sZXNgIHRvIHlvdXIgc2NoZW1hIGlmIHlvdSB1c2UgdGhlIG1ldGVvci1yb2xlcyBwYWNrYWdlLlxyXG4gICAgLy8gT3B0aW9uIDE6IE9iamVjdCB0eXBlXHJcbiAgICAvLyBJZiB5b3Ugc3BlY2lmeSB0aGF0IHR5cGUgYXMgT2JqZWN0LCB5b3UgbXVzdCBhbHNvIHNwZWNpZnkgdGhlXHJcbiAgICAvLyBgUm9sZXMuR0xPQkFMX0dST1VQYCBncm91cCB3aGVuZXZlciB5b3UgYWRkIGEgdXNlciB0byBhIHJvbGUuXHJcbiAgICAvLyBFeGFtcGxlOlxyXG4gICAgLy8gUm9sZXMuYWRkVXNlcnNUb1JvbGVzKHVzZXJJZCwgW1wiYWRtaW5cIl0sIFJvbGVzLkdMT0JBTF9HUk9VUCk7XHJcbiAgICAvLyBZb3UgY2FuJ3QgbWl4IGFuZCBtYXRjaCBhZGRpbmcgd2l0aCBhbmQgd2l0aG91dCBhIGdyb3VwIHNpbmNlXHJcbiAgICAvLyB5b3Ugd2lsbCBmYWlsIHZhbGlkYXRpb24gaW4gc29tZSBjYXNlcy5cclxuICAgIHJvbGVzOiB7XHJcbiAgICAgICAgdHlwZTogT2JqZWN0LFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gICAgICAgIGJsYWNrYm94OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLy8gT3B0aW9uIDI6IFtTdHJpbmddIHR5cGVcclxuICAgIC8vIElmIHlvdSBhcmUgc3VyZSB5b3Ugd2lsbCBuZXZlciBuZWVkIHRvIHVzZSByb2xlIGdyb3VwcywgdGhlblxyXG4gICAgLy8geW91IGNhbiBzcGVjaWZ5IFtTdHJpbmddIGFzIHRoZSB0eXBlXHJcbiAgICByb2xlczoge1xyXG4gICAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgJ3JvbGVzLiQnOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICB9LFxyXG4gICAgLy8gSW4gb3JkZXIgdG8gYXZvaWQgYW4gJ0V4Y2VwdGlvbiBpbiBzZXRJbnRlcnZhbCBjYWxsYmFjaycgZnJvbSBNZXRlb3JcclxuICAgIGhlYXJ0YmVhdDoge1xyXG4gICAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH1cclxufSk7XHJcblxyXG5NZXRlb3IudXNlcnMuYXR0YWNoU2NoZW1hKFVzZXJTY2hlbWEpOyIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xyXG5cclxuaW1wb3J0ICcuL2FwaS91c2Vycy5qcyc7XHJcbmltcG9ydCAnLi9hcGkvYm9hcmRzJztcclxuaW1wb3J0ICcuL2FwaS9saXN0cyc7XHJcbmltcG9ydCAnLi9hcGkvdGVhbXMnIFxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xyXG5cclxufSk7Il19
