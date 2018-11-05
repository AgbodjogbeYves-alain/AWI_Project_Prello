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
    }

    let teamDescription = description.teamDescription ? description.teamDescription : ""; //let owner = Meteor.users.findOne(this.userId)

    return Team.insert({
      teamName: team.teamTitle,
      teamDescription: teamDescription,
      teamOwner: this.userId
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
    optional: true,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvYXBpL1V0aWxzL2JvYXJkVXRpbHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9ib2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9saXN0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvYXBpL3RlYW1zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9hcGkvdXNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Cb2FyZFVzZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Cb2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9DYXJkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvTGlzdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL1RlYW0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Vc2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJib2FyZFV0aWxzIiwiY2hlY2tJbkJvYXJkVXNlciIsImlkVXNlciIsImJvYXJkIiwiaXNJbiIsImJvYXJkVXNlcnMiLCJtYXAiLCJ1c2VyIiwiX2lkIiwiQm9hcmRzIiwibGluayIsInYiLCJNZXRlb3IiLCJydXNGdW5jdGlvbiIsImRlZmF1bHQiLCJwdWJsaXNoIiwiZmluZCIsIm1ldGhvZHMiLCJjb25zb2xlIiwibG9nIiwidXNlcklkIiwiaW5zZXJ0IiwiRXJyb3IiLCJpZEJvYXJkIiwiY291bnREb2MiLCJjb3VudCIsImZpbmRPbmUiLCJib2FyZElkIiwicmVtb3ZlIiwibmV3Qm9hcmQiLCJib2FyZExpc3QiLCJsaXN0Q2FyZCIsInVwZGF0ZSIsIiRzZXQiLCJib2FyZFRpdGxlIiwiYm9hcmRQcml2YWN5IiwicHJpdmFjeSIsImZldGNoIiwiYWxsQm9hcmRzIiwidXNlckJvYXJkIiwicHVzaCIsImJvYXJkVGVhbXMiLCJjYXJkcyIsImxpc3QiLCJ0aGVMaXN0IiwiY2FsbCIsImNhcmQiLCJib2FyZFRhZ3MiLCJsaXN0cyIsImxpc3RJZCIsImNhcmRJZCIsIkxpc3RzIiwiUmFuZG9tIiwiSnNvblJvdXRlcyIsImxpc3ROYW1lIiwibGlzdFRpdGxlIiwiaWRMaXN0IiwiTGlzdCIsIk1pZGRsZXdhcmUiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJlcnJvciIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInJlc3VsdCIsImFkZCIsInVzZXJzIiwidXNlcm5hbWUiLCJib2R5Iiwic3RhdGUiLCJmaXJzdG5hbWUiLCJsYXN0bmFtZSIsInBhc3N3b3JkIiwiZW1haWwiLCJUZWFtIiwidGVhbSIsInRlYW1EZXNjcmlwdGlvbiIsImRlc2NyaXB0aW9uIiwidGVhbU5hbWUiLCJ0ZWFtVGl0bGUiLCJ0ZWFtT3duZXIiLCJ0ZWFtcyIsIkFjY291bnRzIiwiJG5lIiwiZmllbGRzIiwicHJvZmlsZSIsImxlbmd0aCIsIm9wdGlvbnMiLCJlbmFibGVkTWFpbHMiLCJjcmVhdGVVc2VyIiwiZW1haWxzIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwiYWN0dWFsUGFzc3dvcmQiLCJuZXdQYXNzd29yZCIsImNoZWNrUGFzc3dvcmQiLCJfY2hlY2tQYXNzd29yZCIsInJlYXNvbiIsInNldFBhc3N3b3JkIiwibG9nb3V0IiwiQm9hcmRVc2VyU2NoZW1hIiwiU2ltcGxlU2NoZW1hIiwiVXNlclNjaGVtYSIsInR5cGUiLCJsYWJlbCIsInJlcXVpcmVkIiwidXNlclJvbGUiLCJOdW1iZXIiLCJCb2FyZFNjaGVtYSIsIk1vbmdvIiwiTGlzdFNjaGVtYSIsIkNvbGxlY3Rpb24iLCJTdHJpbmciLCJib2FyZERlc2NyaXB0aW9uIiwiQXJyYXkiLCJJbnRlZ2VyIiwiYm9hcmRMaXN0cyIsImRlZmF1bHRWYWx1ZSIsIk9iamVjdCIsImJvYXJkQ3JlYXRlZEF0IiwiRGF0ZSIsImF1dG9WYWx1ZSIsImF0dGFjaFNjaGVtYSIsIkNhcmRzIiwiQ2FyZFNjaGVtYSIsInJlZ0V4IiwiUmVnRXgiLCJJZCIsImNhcmRUaXRsZSIsImNhcmREZXNjcmlwdGlvbiIsImNhcmRUYWciLCJjYXJkQ29tbWVudCIsImNhcmRBdHRhY2htZW50IiwiY2FyZENoZWNrbGlzdCIsImxpc3RDcmVhdGVkQXQiLCJUZWFtU2NoZW1hIiwib3B0aW9uYWwiLCJ0ZWFtTWVtYmVycyIsIlVzZXJQcm9maWxlU2NoZW1hIiwiZW5uYWJsZWRNYWlscyIsIkJvb2xlYW4iLCJFbWFpbCIsInJlZ2lzdGVyZWRfZW1haWxzIiwiYmxhY2tib3giLCJjcmVhdGVkQXQiLCJzZXJ2aWNlcyIsInJvbGVzIiwiaGVhcnRiZWF0Iiwic3RhcnR1cCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7O0FBQU8sTUFBTUEsVUFBTixDQUFpQjtBQUVwQixTQUFPQyxnQkFBUCxDQUF3QkMsTUFBeEIsRUFBZ0NDLEtBQWhDLEVBQXNDO0FBQ2xDLFFBQUlDLElBQUksR0FBRyxLQUFYO0FBQ0FELFNBQUssQ0FBQ0UsVUFBTixDQUFpQkMsR0FBakIsQ0FBc0JDLElBQUQsSUFBVTtBQUMzQixVQUFHQSxJQUFJLENBQUNDLEdBQUwsSUFBWU4sTUFBZixFQUFzQjtBQUNsQkUsWUFBSSxHQUFHLElBQVA7QUFDSDtBQUNKLEtBSkQ7QUFNQSxXQUFPQSxJQUFQO0FBQ0g7O0FBWG1CLEM7Ozs7Ozs7Ozs7O0FDQXhCLElBQUlLLE1BQUo7QUFBV1gsTUFBTSxDQUFDWSxJQUFQLENBQVksa0JBQVosRUFBK0I7QUFBQ0QsUUFBTSxDQUFDRSxDQUFELEVBQUc7QUFBQ0YsVUFBTSxHQUFDRSxDQUFQO0FBQVM7O0FBQXBCLENBQS9CLEVBQXFELENBQXJEO0FBQXdELElBQUlDLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0Qs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RUFBRWUsTUFEQTtBQUVOa0IsWUFBUSxFQUFFLElBRko7QUFHTk8sWUFBUSxFQUFFO0FBSEosR0ExQzZCO0FBK0N2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FHLE9BQUssRUFBRTtBQUNIM0MsUUFBSSxFQUFFZSxNQURIO0FBRUhrQixZQUFRLEVBQUUsSUFGUDtBQUdITyxZQUFRLEVBQUU7QUFIUCxHQXZEZ0M7QUE0RHZDO0FBQ0E7QUFDQTtBQUNBRyxPQUFLLEVBQUU7QUFDSDNDLFFBQUksRUFBRVcsS0FESDtBQUVIc0IsWUFBUSxFQUFFO0FBRlAsR0EvRGdDO0FBbUV2QyxhQUFXO0FBQ1BqQyxRQUFJLEVBQUVTO0FBREMsR0FuRTRCO0FBc0V2QztBQUNBbUMsV0FBUyxFQUFFO0FBQ1A1QyxRQUFJLEVBQUVpQixJQURDO0FBRVBnQixZQUFRLEVBQUU7QUFGSDtBQXZFNEIsQ0FBakIsQ0FBbkI7QUE2RVBoSSxNQUFNLENBQUMwRCxLQUFQLENBQWF3RCxZQUFiLENBQTBCcEIsVUFBMUIsRTs7Ozs7Ozs7Ozs7QUNsR0EsSUFBSTlGLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcURiLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGdCQUFaO0FBQThCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxjQUFaO0FBQTRCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxhQUFaO0FBQTJCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxhQUFaO0FBT3JKRSxNQUFNLENBQUM0SSxPQUFQLENBQWUsTUFBTSxDQUVwQixDQUZELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBib2FyZFV0aWxzIHtcclxuXHJcbiAgICBzdGF0aWMgY2hlY2tJbkJvYXJkVXNlcihpZFVzZXIsIGJvYXJkKXtcclxuICAgICAgICBsZXQgaXNJbiA9IGZhbHNlXHJcbiAgICAgICAgYm9hcmQuYm9hcmRVc2Vycy5tYXAoKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgaWYodXNlci5faWQgPT0gaWRVc2VyKXtcclxuICAgICAgICAgICAgICAgIGlzSW4gPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gaXNJblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtCb2FyZHN9IGZyb20gXCIuLi9tb2RlbHMvQm9hcmRzXCI7XHJcbmltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xyXG5pbXBvcnQge2JvYXJkVXRpbHN9IGZyb20gXCIuL1V0aWxzL2JvYXJkVXRpbHNcIjtcclxuaW1wb3J0IHJ1c0Z1bmN0aW9uIGZyb20gJ3J1cy1kaWZmJ1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goJ2JvYXJkcycsIGZ1bmN0aW9uICgpIHtyZXR1cm4gQm9hcmRzLmZpbmQoKX0pO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG5cclxuICAgICdib2FyZHMuY3JlYXRlQm9hcmQnKGJvYXJkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0XCIpXHJcbiAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYm9hcmQpXHJcbiAgICAgICAgICAgIHJldHVybiBCb2FyZHMuaW5zZXJ0KGJvYXJkKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhyb3cgTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZHMuZ2V0Qm9hcmQnIChpZEJvYXJkKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkO1xyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcImJvYXJkSWRcIjogaWRCb2FyZH0pLmNvdW50KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY291bnREb2MpXHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBpZEJvYXJkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoYm9hcmQuYm9hcmRQcml2YWN5ID09IDEpe1xyXG4gICAgICAgICAgICAgIC8vICBpZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAgICAgLy8gICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgICAgICAgLy8gICAgICByZXR1cm4gYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IG9uIHRoaXMgYWxsb3cgdG8gc2VlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAgICAgLy8gICAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib2FyZFxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qJ2JvYXJkcy5nZXRCb2FyZEZyb21FeHQnIChpZEJvYXJkLHRva2VuKSB7XHJcbiAgICAgICAgbGV0IGRlY29kZWRUb2tlbiA9IFwieGRcIlxyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogaWRCb2FyZH0pLmNvdW50KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY291bnREb2MpXHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBpZEJvYXJkfSk7XHJcbiAgICAgICAgICAgIGlmKGJvYXJkLmJvYXJkUHJpdmFjeSA9PSAxKXtcclxuICAgICAgICAgICAgICAgIGlmKHRva2VuLnVzZXJJZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IG9uIHRoaXMgYWxsb3cgdG8gc2VlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJvYXJkO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LCovXHJcblxyXG4gICAgJ2JvYXJkcy5yZW1vdmVCb2FyZCcoYm9hcmRJZCkge1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb3VudERvYylcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgYm9hcmQgPSBCb2FyZHMuZmluZE9uZSh7XCJib2FyZElkXCI6IGJvYXJkSWR9KTtcclxuICAgICAgICAgICAgLy9pZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCb2FyZHMucmVtb3ZlKGJvYXJkSWQpO1xyXG4gICAgICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGFsbG93IHRvIGRlbGV0ZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmRzLmVkaXRCb2FyZCcgKG5ld0JvYXJkKSB7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiYm9hcmRJZFwiOiBuZXdCb2FyZC5ib2FyZElkfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJblwiKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuZXdCb2FyZC5ib2FyZExpc3RbMF0ubGlzdENhcmRbMF0pXHJcbiAgICAgICAgICAgIEJvYXJkcy51cGRhdGUoe2JvYXJkSWQ6IG5ld0JvYXJkLmJvYXJkSWR9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRUaXRsZTogbmV3Qm9hcmQuYm9hcmRUaXRsZSxcclxuICAgICAgICAgICAgICAgICAgICBib2FyZFByaXZhY3k6IG5ld0JvYXJkLnByaXZhY3ksXHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRVc2VyczogbmV3Qm9hcmQuYm9hcmRVc2Vyc1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgLypuZXdCb2FyZC5ib2FyZExpc3QuZm9yRWFjaCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIEJvYXJkcy51cGRhdGUoe2JvYXJkSWQ6IG5ld0JvYXJkLmJvYXJkSWQsICdib2FyZExpc3QubGlzdElkJzogbGlzdC5saXN0SWR9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9hcmRMaXN0Lmxpc3QubGlzdENhcmQuJFtdXCI6IGxpc3QubGlzdENhcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pKi9cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLypuZXdCb2FyZC5ib2FyZExpc3QuZm9yRWFjaCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgQm9hcmRzLnVwZGF0ZSh7Ym9hcmRJZDogbmV3Qm9hcmQuYm9hcmRJZCwgXCJib2FyZExpc3QubGlzdElkXCI6IGxpc3QubGlzdElkfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRUaXRsZTogbmV3Qm9hcmQuYm9hcmRUaXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRQcml2YWN5OiBuZXdCb2FyZC5wcml2YWN5LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pKi9cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZC5nZXRBbGxCb2FyZHMnICgpe1xyXG4gICAgICAgIHJldHVybiBCb2FyZHMuZmluZCgpLmZldGNoKCk7XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZC5nZXRVc2VyQWxsQm9hcmRzJyAodXNlcklkKXtcclxuICAgICAgICBsZXQgYWxsQm9hcmRzID0gQm9hcmRzLmZpbmQoKS5mZXRjaCgpXHJcbiAgICAgICAgbGV0IHVzZXJCb2FyZCA9IFtdXHJcbiAgICAgICAgYWxsQm9hcmRzLm1hcCgoYm9hcmQpID0+IHtcclxuICAgICAgICAgICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKHVzZXJJZCkpe1xyXG4gICAgICAgICAgICAgICAgdXNlckJvYXJkLnB1c2goYm9hcmQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsQm9hcmRzXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmQuZ2V0VGVhbScgKGJvYXJkSWQpe1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgLy8gIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZC5ib2FyZFRlYW1zO1xyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYWxsb3cgdG8gZGVsZXRlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ2JvYXJkLmdldENhcmRzJyAoYm9hcmRJZCkge1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgLy8gIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgIGxldCBjYXJkcyA9IFtdXHJcbiAgICAgICAgICAgIGJvYXJkLmJvYXJkTGlzdC5tYXAoKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0Fubm90YXRvclxyXG4gICAgICAgICAgICAgICAgbGV0IHRoZUxpc3QgPSBNZXRlb3IuY2FsbCgnZ2V0TGlzdCcsbGlzdC5faWQpXHJcbiAgICAgICAgICAgICAgICB0aGVMaXN0Lmxpc3RDYXJkLm1hcCgoY2FyZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmRzLnB1c2goY2FyZClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY2FyZHNcclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGFsbG93IHRvIGRlbGV0ZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmRzLmdldFRhZ3MnIChib2FyZElkKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkXHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogYm9hcmRJZH0pO1xyXG4gICAgICAgICAgICAvL2lmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQuYm9hcmRUYWdzXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkcy5nZXRMaXN0cycgKGJvYXJkSWQpIHtcclxuICAgICAgICBsZXQgYm9hcmRcclxuICAgICAgICBsZXQgbGlzdHMgPSBbXVxyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcIl9pZFwiOiBib2FyZElkfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgYm9hcmQgPSBCb2FyZHMuZmluZE9uZSh7XCJib2FyZElkXCI6IGJvYXJkSWR9KTtcclxuICAgICAgICAgICAgLy9pZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAvLyAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgYm9hcmQuYm9hcmRMaXN0Lm1hcCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRoZUxpc3QgPSBNZXRlb3IuY2FsbCgnbGlzdC5nZXRMaXN0JyxsaXN0Ll9pZClcclxuICAgICAgICAgICAgICAgIGxpc3RzLnB1c2godGhlTGlzdClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3RzXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAnYm9hcmQuYXJjaGl2ZUxpc3QnIChib2FyZElkLGxpc3RJZCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkLmFyY2hpdmVDYXJkJyAoYm9hcmRJZCwgY2FyZElkKSB7XHJcblxyXG4gICAgfVxyXG5cclxufSlcclxuIiwiaW1wb3J0IHtMaXN0c30gZnJvbSBcIi4uL21vZGVscy9MaXN0XCI7XHJcbmltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xyXG5pbXBvcnQgeyBSYW5kb20gfSBmcm9tICdtZXRlb3IvcmFuZG9tJztcclxuaW1wb3J0IHsgSnNvblJvdXRlcyB9IGZyb20gJ21ldGVvci9zaW1wbGU6anNvbi1yb3V0ZXMnO1xyXG5cclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgICdsaXN0LmNyZWF0ZUxpc3QnKGxpc3ROYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIExpc3RzLmluc2VydCh7bGlzdFRpdGxlOiBsaXN0TmFtZX0pXHJcbiAgICB9LFxyXG5cclxuICAgICdsaXN0LmdldExpc3QnIChpZExpc3QpIHtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBMaXN0cy5maW5kKHtcIl9pZFwiOiBpZExpc3R9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IExpc3QuZmluZE9uZSh7XCJfaWRcIjogaWRMaXN0fSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnTGlzdCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgJ2xpc3QuZGVsZXRlTGlzdCcoaWRCb2FyZCwgaWRMaXN0KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnbGlzdC5lZGl0TGlzdCcgKGxpc3QpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgICdsaXN0LmdldEFsbExpc3QnICgpe1xyXG5cclxuICAgIH1cclxufSlcclxuXHJcbi8vIGNvZGUgdG8gcnVuIG9uIHNlcnZlciBhdCBzdGFydHVwXHJcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcclxuICAgIGlmKHJlcS5xdWVyeS5lcnJvcikge1xyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgICAgICAgICAgY29kZTogNDAxLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IFwiRVJST1JcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk7XHJcbn0pO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9zaWduVXAvJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcclxuICAgIGNvbnNvbGUubG9nKHJlcSlcclxuICAgIE1ldGVvci51c2Vycy5pbnNlcnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBmaXJzdG5hbWU6IHJlcS5ib2R5LnN0YXRlLmZpcnN0bmFtZSxcclxuICAgICAgICBsYXN0bmFtZTogcmVxLmJvZHkuc3RhdGUubGFzdG5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnN0YXRlLnBhc3N3b3JkLFxyXG4gICAgICAgIGVtYWlsOiByZXEuYm9keS5zdGF0ZS5lbWFpbFxyXG4gICAgfSlcclxuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHJlc3VsdDogTWV0ZW9yLnVzZXJzLmZpbmQoKS5mZXRjaCgpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuIiwiaW1wb3J0IHtNZXRlb3J9IGZyb20gXCJtZXRlb3IvbWV0ZW9yXCI7XHJcbmltcG9ydCB7VGVhbX0gIGZyb20gXCIuLi9tb2RlbHMvVGVhbVwiO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgXCJ0ZWFtcy5jcmVhdGVUZWFtXCIodGVhbSl7XHJcbiAgICAgICAgaWYoIXRoaXMudXNlcklkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignTm90LUF1dGhvcml6ZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRlYW1EZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnRlYW1EZXNjcmlwdGlvbiA/IGRlc2NyaXB0aW9uLnRlYW1EZXNjcmlwdGlvbiA6IFwiXCJcclxuICAgICAgICAvL2xldCBvd25lciA9IE1ldGVvci51c2Vycy5maW5kT25lKHRoaXMudXNlcklkKVxyXG4gICAgXHJcbiAgICAgICAgcmV0dXJuIFRlYW0uaW5zZXJ0KHtcclxuICAgICAgICAgICAgdGVhbU5hbWU6IHRlYW0udGVhbVRpdGxlLFxyXG4gICAgICAgICAgICB0ZWFtRGVzY3JpcHRpb246IHRlYW1EZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgdGVhbU93bmVyIDogdGhpcy51c2VySWRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgICdnZXRUZWFtcycoKXtcclxuICAgICAgICAvL2NoZWNrKHRlYW1JZCxTdHJpbmcpXHJcbiAgICAgICBpZighdGhpcy51c2VySWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXNlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlYW1zID0gVGVhbS5maW5kKCk7XHJcblxyXG4gICAgICAgIGlmKHRlYW1zKVxyXG4gICAgICAgICAgICByZXR1cm4gdGVhbXNcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ1RlYW0gbm90IGZvdW5kJylcclxuICAgIH1cclxuXHJcbn0pOyIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xyXG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcclxuXHJcbk1ldGVvci5wdWJsaXNoKCd1c2VycycsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZih0aGlzLnVzZXJJZCkgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKHtfaWQ6IHskbmU6IHRoaXMudXNlcklkfX0sIHtmaWVsZHM6IHsgcHJvZmlsZTogMSB9fSk7XHJcbn0pO1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goJ3VzZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoe19pZDogdGhpcy51c2VySWR9KTtcclxufSk7XHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgICBcInVzZXJzLnNpZ25VcFwiKHtsYXN0bmFtZSwgZmlyc3RuYW1lLCBlbWFpbCwgcGFzc3dvcmR9KXtcclxuICAgICAgICBpZihwYXNzd29yZC5sZW5ndGggPCA2KSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiVG9vIHNob3J0IHBhc3N3b3JkLCBhdCBsZWFzdCA2IGNoYXJhY3RlcnMuXCIpXHJcbiAgICAgICAgZWxzZSBpZighZW1haWwgfHwgIWxhc3RuYW1lIHx8ICFmaXJzdG5hbWUpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJTb21lIGZpZWxkIGFyZSBlbXB0eS5cIilcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdG5hbWU6IGxhc3RuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0bmFtZTogZmlyc3RuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWRNYWlsczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgQWNjb3VudHMuY3JlYXRlVXNlcihvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ1c2Vycy51cGRhdGVQcm9maWxlXCIoZW1haWwsIGxhc3RuYW1lLCBmaXJzdG5hbWUpe1xyXG4gICAgICAgIE1ldGVvci51c2Vycy51cGRhdGUoTWV0ZW9yLnVzZXJJZCgpLCB7ICRzZXQ6IHtcclxuICAgICAgICAgICAgZW1haWxzOiBbe2FkZHJlc3M6IGVtYWlsLCB2ZXJpZmllZDogdHJ1ZX1dLFxyXG4gICAgICAgICAgICAncHJvZmlsZS5sYXN0bmFtZSc6IGxhc3RuYW1lLFxyXG4gICAgICAgICAgICAncHJvZmlsZS5maXJzdG5hbWUnOiBmaXJzdG5hbWUsXHJcbiAgICAgICAgICAgICdwcm9maWxlLmVtYWlsJzogZW1haWxcclxuICAgICAgICB9fSk7XHJcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2VyKCk7XHJcbiAgICB9LFxyXG4gICAgJ3VzZXJzLmNoYW5nZVBhc3N3b3JkJyhhY3R1YWxQYXNzd29yZCwgbmV3UGFzc3dvcmQpe1xyXG4gICAgICAgIGxldCBjaGVja1Bhc3N3b3JkID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoTWV0ZW9yLnVzZXIoKSwgYWN0dWFsUGFzc3dvcmQpO1xyXG4gICAgICAgIGlmKGNoZWNrUGFzc3dvcmQuZXJyb3IpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoY2hlY2tQYXNzd29yZC5lcnJvci5yZWFzb24pXHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgQWNjb3VudHMuc2V0UGFzc3dvcmQoTWV0ZW9yLnVzZXJJZCgpLCBuZXdQYXNzd29yZCwge2xvZ291dDogZmFsc2V9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ3VzZXJzLnNldEVuYWJsZWRNYWlscycoZW5hYmxlZE1haWxzKXtcclxuICAgICAgICBNZXRlb3IudXNlcnMudXBkYXRlKE1ldGVvci51c2VySWQoKSwgeyAkc2V0OiB7XHJcbiAgICAgICAgICAgICdwcm9maWxlLmVuYWJsZWRNYWlscyc6IGVuYWJsZWRNYWlsc1xyXG4gICAgICAgIH19KTtcclxuICAgICAgICByZXR1cm4gTWV0ZW9yLnVzZXIoKTtcclxuICAgIH0sXHJcbiAgICAndXNlcnMucmVtb3ZlJygpe1xyXG4gICAgICAgIE1ldGVvci51c2Vycy5yZW1vdmUoTWV0ZW9yLnVzZXJJZCgpKTtcclxuICAgIH0sXHJcbiAgICBcInVzZXJzLmdldFVzZXJcIihlbWFpbCl7XHJcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kT25lKHtcInByb2ZpbGUuZW1haWxcIjogZW1haWx9KTtcclxuICAgIH0sXHJcbiAgICBcInVzZXJzLmdldFVzZXJzXCIoKXtcclxuICAgICAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoKTtcclxuICAgIH1cclxufSkiLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcbmltcG9ydCB7IFVzZXJTY2hlbWEgfSBmcm9tICcuL1VzZXJzJztcclxuXHJcbmV4cG9ydCBjb25zdCBCb2FyZFVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICB1c2VyOiB7XHJcbiAgICAgIHR5cGU6IFVzZXJTY2hlbWEsXHJcbiAgICAgIGxhYmVsOiBcIlVzZXJcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIHVzZXJSb2xlOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgbGFiZWw6IFwiUm9sZVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH1cclxufSk7IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcblxyXG5leHBvcnQgY29uc3QgQm9hcmRzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2JvYXJkcycpXHJcblxyXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcbmltcG9ydCB7TGlzdFNjaGVtYX0gZnJvbSBcIi4vTGlzdFwiO1xyXG5pbXBvcnQgeyBCb2FyZFVzZXJTY2hlbWEgfSBmcm9tICcuL0JvYXJkVXNlcic7XHJcblxyXG5leHBvcnQgY29uc3QgQm9hcmRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBib2FyZFRpdGxlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiVGl0bGVcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIGJvYXJkRGVzY3JpcHRpb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJEZXNjcmlwdGlvblwiLFxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICB9LFxyXG4gIGJvYXJkVXNlcnM6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIlVzZXJzXCIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfSxcclxuICAnYm9hcmRVc2Vycy4kJzogQm9hcmRVc2VyU2NoZW1hLCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGJvYXJkUHJpdmFjeToge1xyXG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcclxuICAgICAgbGFiZWw6IFwiUHJpdmFjeVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgYm9hcmRMaXN0czoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiTGlzdHNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2JvYXJkTGlzdHMuJCc6IExpc3RTY2hlbWEsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcblxyXG4gICAgYm9hcmRUYWdzOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJUYWdzXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdib2FyZFRhZ3MuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBib2FyZFRlYW1zOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJUZWFtc1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnYm9hcmRUZWFtcy4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGJvYXJkQ3JlYXRlZEF0OntcclxuICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgYXV0b1ZhbHVlOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRGF0ZSgpO31cclxuICB9XHJcbn0pO1xyXG5cclxuQm9hcmRzLmF0dGFjaFNjaGVtYShCb2FyZFNjaGVtYSk7IiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5cclxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcblxyXG5leHBvcnQgY29uc3QgQ2FyZHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignY2FyZHMnKVxyXG5cclxuZXhwb3J0IGNvbnN0IENhcmRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBjYXJkSWQ6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJJZFwiLFxyXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXHJcbiAgfSxcclxuICBjYXJkVGl0bGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJUaXRsZVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgY2FyZERlc2NyaXB0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgY2FyZFRhZzoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiVGFnc1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZFRhZy4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGNhcmRDb21tZW50OiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJDb21tZW50c1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZENvbW1lbnQuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBjYXJkQXR0YWNobWVudDoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiQXR0YWNobWVudHNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2NhcmRBdHRhY2htZW50LiQnOiBPYmplY3QsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgY2FyZENoZWNrbGlzdDoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiQ2hlY2tMaXN0c1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZENoZWNrbGlzdC4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGxpc3RDcmVhdGVkQXQ6e1xyXG4gICAgdHlwZTogRGF0ZSxcclxuICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IERhdGUoKTt9XHJcbn1cclxufSk7XHJcblxyXG5DYXJkcy5hdHRhY2hTY2hlbWEoQ2FyZFNjaGVtYSk7IiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5cclxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcbmltcG9ydCB7Q2FyZFNjaGVtYX0gZnJvbSBcIi4vQ2FyZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IExpc3RzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2xpc3RzJylcclxuXHJcbmV4cG9ydCBjb25zdCBMaXN0U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgbGlzdElkOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBsYWJlbDogXCJJZFwiLFxyXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxyXG4gIH0sXHJcbiAgbGlzdFRpdGxlOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBsYWJlbDogXCJUaXRsZVwiLFxyXG4gICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIGxpc3RDYXJkOntcclxuICAgIHR5cGU6IEFycmF5LFxyXG4gICAgbGFiZWw6IFwiQ2FyZHNcIixcclxuICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdsaXN0Q2FyZC4kJzogQ2FyZFNjaGVtYSwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBsaXN0Q3JlYXRlZEF0OntcclxuICAgIHR5cGU6IERhdGUsXHJcbiAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBEYXRlKCk7fVxyXG59XHJcbn0pO1xyXG5cclxuTGlzdHMuYXR0YWNoU2NoZW1hKExpc3RTY2hlbWEpOyIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJ1xyXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcbmltcG9ydCB7VXNlclNjaGVtYX0gZnJvbSAnLi9Vc2Vycy5qcydcclxuXHJcbmV4cG9ydCBjb25zdCBUZWFtID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3RlYW1zJyk7XHJcblxyXG5jb25zdCBUZWFtU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgICB0ZWFtTmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBsYWJlbDogXCJOYW1lXCIsXHJcbiAgICB9LFxyXG4gICAgdGVhbURlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGxhYmVsOiBcIkRlc2NyaXB0aW9uXCIsXHJcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSxcclxuICAgICAgICBkZWZhdWx0VmFsdWU6IFwiXCJcclxuICAgIH0sXHJcbiAgICB0ZWFtT3duZXIgOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGxhYmVsOiBcIk93bmVyXCJcclxuICAgIH0sXHJcbiAgICB0ZWFtTWVtYmVyczp7XHJcbiAgICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgICAgbGFiZWwgOiBcIk1lbWJlcnNcIixcclxuICAgICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgICB9LFxyXG4gICAgJ3RlYW1NZW1iZXJzLiQnOiBVc2VyU2NoZW1hXHJcbn0pO1xyXG5cclxuXHJcblRlYW0uYXR0YWNoU2NoZW1hKFRlYW1TY2hlbWEpOyIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcclxuXHJcbmNvbnN0IFVzZXJQcm9maWxlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBsYXN0bmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGVtYWlsIDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGVubmFibGVkTWFpbHM6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IFVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICAgIHVzZXJuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIC8vIEZvciBhY2NvdW50cy1wYXNzd29yZCwgZWl0aGVyIGVtYWlscyBvciB1c2VybmFtZSBpcyByZXF1aXJlZCwgYnV0IG5vdCBib3RoLiBJdCBpcyBPSyB0byBtYWtlIHRoaXNcclxuICAgICAgICAvLyBvcHRpb25hbCBoZXJlIGJlY2F1c2UgdGhlIGFjY291bnRzLXBhc3N3b3JkIHBhY2thZ2UgZG9lcyBpdHMgb3duIHZhbGlkYXRpb24uXHJcbiAgICAgICAgLy8gVGhpcmQtcGFydHkgbG9naW4gcGFja2FnZXMgbWF5IG5vdCByZXF1aXJlIGVpdGhlci4gQWRqdXN0IHRoaXMgc2NoZW1hIGFzIG5lY2Vzc2FyeSBmb3IgeW91ciB1c2FnZS5cclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGVtYWlsczoge1xyXG4gICAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICAgIC8vIEZvciBhY2NvdW50cy1wYXNzd29yZCwgZWl0aGVyIGVtYWlscyBvciB1c2VybmFtZSBpcyByZXF1aXJlZCwgYnV0IG5vdCBib3RoLiBJdCBpcyBPSyB0byBtYWtlIHRoaXNcclxuICAgICAgICAvLyBvcHRpb25hbCBoZXJlIGJlY2F1c2UgdGhlIGFjY291bnRzLXBhc3N3b3JkIHBhY2thZ2UgZG9lcyBpdHMgb3duIHZhbGlkYXRpb24uXHJcbiAgICAgICAgLy8gVGhpcmQtcGFydHkgbG9naW4gcGFja2FnZXMgbWF5IG5vdCByZXF1aXJlIGVpdGhlci4gQWRqdXN0IHRoaXMgc2NoZW1hIGFzIG5lY2Vzc2FyeSBmb3IgeW91ciB1c2FnZS5cclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIFwiZW1haWxzLiRcIjoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdFxyXG4gICAgfSxcclxuICAgIFwiZW1haWxzLiQuYWRkcmVzc1wiOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcclxuICAgIH0sXHJcbiAgICBcImVtYWlscy4kLnZlcmlmaWVkXCI6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuXHJcbiAgICB9LFxyXG4gICAgLy8gVXNlIHRoaXMgcmVnaXN0ZXJlZF9lbWFpbHMgZmllbGQgaWYgeW91IGFyZSB1c2luZyBzcGxlbmRpZG86bWV0ZW9yLWFjY291bnRzLWVtYWlscy1maWVsZCAvIHNwbGVuZGlkbzptZXRlb3ItYWNjb3VudHMtbWVsZFxyXG4gICAgcmVnaXN0ZXJlZF9lbWFpbHM6IHtcclxuICAgICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgICdyZWdpc3RlcmVkX2VtYWlscy4kJzoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdCxcclxuICAgICAgICBibGFja2JveDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGNyZWF0ZWRBdDoge1xyXG4gICAgICAgIHR5cGU6IERhdGVcclxuICAgIH0sXHJcbiAgICBwcm9maWxlOiB7XHJcbiAgICAgICAgdHlwZTogVXNlclByb2ZpbGVTY2hlbWEsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICAvLyBNYWtlIHN1cmUgdGhpcyBzZXJ2aWNlcyBmaWVsZCBpcyBpbiB5b3VyIHNjaGVtYSBpZiB5b3UncmUgdXNpbmcgYW55IG9mIHRoZSBhY2NvdW50cyBwYWNrYWdlc1xyXG4gICAgc2VydmljZXM6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3QsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgICAgICAgYmxhY2tib3g6IHRydWVcclxuICAgIH0sXHJcbiAgICAvLyBBZGQgYHJvbGVzYCB0byB5b3VyIHNjaGVtYSBpZiB5b3UgdXNlIHRoZSBtZXRlb3Itcm9sZXMgcGFja2FnZS5cclxuICAgIC8vIE9wdGlvbiAxOiBPYmplY3QgdHlwZVxyXG4gICAgLy8gSWYgeW91IHNwZWNpZnkgdGhhdCB0eXBlIGFzIE9iamVjdCwgeW91IG11c3QgYWxzbyBzcGVjaWZ5IHRoZVxyXG4gICAgLy8gYFJvbGVzLkdMT0JBTF9HUk9VUGAgZ3JvdXAgd2hlbmV2ZXIgeW91IGFkZCBhIHVzZXIgdG8gYSByb2xlLlxyXG4gICAgLy8gRXhhbXBsZTpcclxuICAgIC8vIFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyh1c2VySWQsIFtcImFkbWluXCJdLCBSb2xlcy5HTE9CQUxfR1JPVVApO1xyXG4gICAgLy8gWW91IGNhbid0IG1peCBhbmQgbWF0Y2ggYWRkaW5nIHdpdGggYW5kIHdpdGhvdXQgYSBncm91cCBzaW5jZVxyXG4gICAgLy8geW91IHdpbGwgZmFpbCB2YWxpZGF0aW9uIGluIHNvbWUgY2FzZXMuXHJcbiAgICByb2xlczoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdCxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcclxuICAgICAgICBibGFja2JveDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIC8vIE9wdGlvbiAyOiBbU3RyaW5nXSB0eXBlXHJcbiAgICAvLyBJZiB5b3UgYXJlIHN1cmUgeW91IHdpbGwgbmV2ZXIgbmVlZCB0byB1c2Ugcm9sZSBncm91cHMsIHRoZW5cclxuICAgIC8vIHlvdSBjYW4gc3BlY2lmeSBbU3RyaW5nXSBhcyB0aGUgdHlwZVxyXG4gICAgcm9sZXM6IHtcclxuICAgICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgICdyb2xlcy4kJzoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgfSxcclxuICAgIC8vIEluIG9yZGVyIHRvIGF2b2lkIGFuICdFeGNlcHRpb24gaW4gc2V0SW50ZXJ2YWwgY2FsbGJhY2snIGZyb20gTWV0ZW9yXHJcbiAgICBoZWFydGJlYXQ6IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuTWV0ZW9yLnVzZXJzLmF0dGFjaFNjaGVtYShVc2VyU2NoZW1hKTsiLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuXHJcbmltcG9ydCAnLi9hcGkvdXNlcnMuanMnO1xyXG5pbXBvcnQgJy4vYXBpL2JvYXJkcyc7XHJcbmltcG9ydCAnLi9hcGkvbGlzdHMnO1xyXG5pbXBvcnQgJy4vYXBpL3RlYW1zJyBcclxuXHJcbk1ldGVvci5zdGFydHVwKCgpID0+IHtcclxuXHJcbn0pOyJdfQ==
