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


    return Team.insert({
      teamName: team.teamTitle,
      teamDescription: team.teamDescription,
      teamOwner: this.userId,
      teamMembers: team.teamUsers
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
let TeamMembers;
module.link("./TeamMembers.js", {
  TeamMembers(v) {
    TeamMembers = v;
  }

}, 3);
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
  'teamMembers.$': TeamMembers
});
Team.attachSchema(TeamSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TeamMembers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// models/TeamMembers.js                                                                                  //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
module.export({
  TeamMembers: () => TeamMembers
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
const TeamMembers = new SimpleSchema({
  user: {
    type: UserSchema,
    label: "User"
  },
  userRole: {
    type: Number,
    label: "Role"
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvYXBpL1V0aWxzL2JvYXJkVXRpbHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9ib2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9saXN0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvYXBpL3RlYW1zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9hcGkvdXNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Cb2FyZFVzZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Cb2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9DYXJkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvTGlzdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL1RlYW0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9UZWFtTWVtYmVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL1VzZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9tYWluLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsImJvYXJkVXRpbHMiLCJjaGVja0luQm9hcmRVc2VyIiwiaWRVc2VyIiwiYm9hcmQiLCJpc0luIiwiYm9hcmRVc2VycyIsIm1hcCIsInVzZXIiLCJfaWQiLCJCb2FyZHMiLCJsaW5rIiwidiIsIk1ldGVvciIsInJ1c0Z1bmN0aW9uIiwiZGVmYXVsdCIsInB1Ymxpc2giLCJmaW5kIiwibWV0aG9kcyIsImNvbnNvbGUiLCJsb2ciLCJ1c2VySWQiLCJpbnNlcnQiLCJFcnJvciIsImlkQm9hcmQiLCJjb3VudERvYyIsImNvdW50IiwiZmluZE9uZSIsImJvYXJkSWQiLCJyZW1vdmUiLCJuZXdCb2FyZCIsImJvYXJkTGlzdCIsImxpc3RDYXJkIiwidXBkYXRlIiwiJHNldCIsImJvYXJkVGl0bGUiLCJib2FyZFByaXZhY3kiLCJwcml2YWN5IiwiZmV0Y2giLCJhbGxCb2FyZHMiLCJ1c2VyQm9hcmQiLCJwdXNoIiwiYm9hcmRUZWFtcyIsImNhcmRzIiwibGlzdCIsInRoZUxpc3QiLCJjYWxsIiwiY2FyZCIsImJvYXJkVGFncyIsImxpc3RzIiwibGlzdElkIiwiY2FyZElkIiwiTGlzdHMiLCJSYW5kb20iLCJKc29uUm91dGVzIiwibGlzdE5hbWUiLCJsaXN0VGl0bGUiLCJpZExpc3QiLCJMaXN0IiwiTWlkZGxld2FyZSIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJxdWVyeSIsImVycm9yIiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwicmVzdWx0IiwiYWRkIiwidXNlcnMiLCJ1c2VybmFtZSIsImJvZHkiLCJzdGF0ZSIsImZpcnN0bmFtZSIsImxhc3RuYW1lIiwicGFzc3dvcmQiLCJlbWFpbCIsIlRlYW0iLCJ0ZWFtIiwidGVhbU5hbWUiLCJ0ZWFtVGl0bGUiLCJ0ZWFtRGVzY3JpcHRpb24iLCJ0ZWFtT3duZXIiLCJ0ZWFtTWVtYmVycyIsInRlYW1Vc2VycyIsInRlYW1zIiwiQWNjb3VudHMiLCIkbmUiLCJmaWVsZHMiLCJwcm9maWxlIiwibGVuZ3RoIiwib3B0aW9ucyIsImVuYWJsZWRNYWlscyIsImNyZWF0ZVVzZXIiLCJlbWFpbHMiLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJhY3R1YWxQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwiY2hlY2tQYXNzd29yZCIsIl9jaGVja1Bhc3N3b3JkIiwicmVhc29uIiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJCb2FyZFVzZXJTY2hlbWEiLCJTaW1wbGVTY2hlbWEiLCJVc2VyU2NoZW1hIiwidHlwZSIsImxhYmVsIiwicmVxdWlyZWQiLCJ1c2VyUm9sZSIsIk51bWJlciIsIkJvYXJkU2NoZW1hIiwiTW9uZ28iLCJMaXN0U2NoZW1hIiwiQ29sbGVjdGlvbiIsIlN0cmluZyIsImJvYXJkRGVzY3JpcHRpb24iLCJBcnJheSIsIkludGVnZXIiLCJib2FyZExpc3RzIiwiZGVmYXVsdFZhbHVlIiwiT2JqZWN0IiwiYm9hcmRDcmVhdGVkQXQiLCJEYXRlIiwiYXV0b1ZhbHVlIiwiYXR0YWNoU2NoZW1hIiwiQ2FyZHMiLCJDYXJkU2NoZW1hIiwicmVnRXgiLCJSZWdFeCIsIklkIiwiY2FyZFRpdGxlIiwiY2FyZERlc2NyaXB0aW9uIiwiY2FyZFRhZyIsImNhcmRDb21tZW50IiwiY2FyZEF0dGFjaG1lbnQiLCJjYXJkQ2hlY2tsaXN0IiwibGlzdENyZWF0ZWRBdCIsIlRlYW1NZW1iZXJzIiwiVGVhbVNjaGVtYSIsIlVzZXJQcm9maWxlU2NoZW1hIiwib3B0aW9uYWwiLCJlbm5hYmxlZE1haWxzIiwiQm9vbGVhbiIsIkVtYWlsIiwicmVnaXN0ZXJlZF9lbWFpbHMiLCJibGFja2JveCIsImNyZWF0ZWRBdCIsInNlcnZpY2VzIiwicm9sZXMiLCJoZWFydGJlYXQiLCJzdGFydHVwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxZQUFVLEVBQUMsTUFBSUE7QUFBaEIsQ0FBZDs7QUFBTyxNQUFNQSxVQUFOLENBQWlCO0FBRXBCLFNBQU9DLGdCQUFQLENBQXdCQyxNQUF4QixFQUFnQ0MsS0FBaEMsRUFBc0M7QUFDbEMsUUFBSUMsSUFBSSxHQUFHLEtBQVg7QUFDQUQsU0FBSyxDQUFDRSxVQUFOLENBQWlCQyxHQUFqQixDQUFzQkMsSUFBRCxJQUFVO0FBQzNCLFVBQUdBLElBQUksQ0FBQ0MsR0FBTCxJQUFZTixNQUFmLEVBQXNCO0FBQ2xCRSxZQUFJLEdBQUcsSUFBUDtBQUNIO0FBQ0osS0FKRDtBQU1BLFdBQU9BLElBQVA7QUFDSDs7QUFYbUIsQzs7Ozs7Ozs7Ozs7QUNBeEIsSUFBSUssTUFBSjtBQUFXWCxNQUFNLENBQUNZLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDRCxRQUFNLENBQUNFLENBQUQsRUFBRztBQUFDRixVQUFNLEdBQUNFLENBQVA7QUFBUzs7QUFBcEIsQ0FBL0IsRUFBcUQsQ0FBckQ7QUFBd0QsSUFBSUMsTUFBSjtBQUFXZCxNQUFNLENBQUNZLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNFLFFBQU0sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFVBQU0sR0FBQ0QsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJWCxVQUFKO0FBQWVGLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUNWLFlBQVUsQ0FBQ1csQ0FBRCxFQUFHO0FBQUNYLGNBQVUsR0FBQ1csQ0FBWDtBQUFhOztBQUE1QixDQUFqQyxFQUErRCxDQUEvRDtBQUFrRSxJQUFJRSxXQUFKO0FBQWdCZixNQUFNLENBQUNZLElBQVAsQ0FBWSxVQUFaLEVBQXVCO0FBQUNJLFNBQU8sQ0FBQ0gsQ0FBRCxFQUFHO0FBQUNFLGVBQVcsR0FBQ0YsQ0FBWjtBQUFjOztBQUExQixDQUF2QixFQUFtRCxDQUFuRDtBQUtwT0MsTUFBTSxDQUFDRyxPQUFQLENBQWUsUUFBZixFQUF5QixZQUFZO0FBQUMsU0FBT04sTUFBTSxDQUFDTyxJQUFQLEVBQVA7QUFBcUIsQ0FBM0Q7QUFFQUosTUFBTSxDQUFDSyxPQUFQLENBQWU7QUFFWCx1QkFBcUJkLEtBQXJCLEVBQTRCO0FBQ3hCZSxXQUFPLENBQUNDLEdBQVIsQ0FBWSxNQUFaOztBQUNBLFFBQUdQLE1BQU0sQ0FBQ1EsTUFBUCxFQUFILEVBQW1CO0FBQ2ZGLGFBQU8sQ0FBQ0MsR0FBUixDQUFZaEIsS0FBWjtBQUNBLGFBQU9NLE1BQU0sQ0FBQ1ksTUFBUCxDQUFjbEIsS0FBZCxDQUFQO0FBQ0gsS0FIRCxNQUdLO0FBQ0QsWUFBTVMsTUFBTSxDQUFDVSxLQUFQLENBQWEsR0FBYixFQUFrQiw2QkFBbEIsQ0FBTjtBQUNIO0FBQ0osR0FWVTs7QUFZWCxvQkFBbUJDLE9BQW5CLEVBQTRCO0FBQ3hCLFFBQUlwQixLQUFKO0FBQ0EsUUFBSXFCLFFBQVEsR0FBR2YsTUFBTSxDQUFDTyxJQUFQLENBQVk7QUFBQyxpQkFBV087QUFBWixLQUFaLEVBQWtDRSxLQUFsQyxFQUFmO0FBQ0FQLFdBQU8sQ0FBQ0MsR0FBUixDQUFZSyxRQUFaOztBQUNBLFFBQUlBLFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQnJCLFdBQUssR0FBR00sTUFBTSxDQUFDaUIsT0FBUCxDQUFlO0FBQUMsbUJBQVdIO0FBQVosT0FBZixDQUFSLENBRGdCLENBRWhCO0FBQ0U7QUFDRTtBQUNFO0FBQ0U7QUFDRTtBQUNGO0FBRUo7QUFDQTtBQUNBO0FBQ0o7O0FBQ0ksYUFBT3BCLEtBQVAsQ0FkWSxDQWVoQjtBQUNILEtBaEJELE1BZ0JPO0FBQ0gsWUFBTSxJQUFJUyxNQUFNLENBQUNVLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsaUJBQXRCLENBQU47QUFDSDtBQUVKLEdBcENVOztBQXNDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsdUJBQXFCSyxPQUFyQixFQUE4QjtBQUMxQixRQUFJeEIsS0FBSjtBQUNBLFFBQUlxQixRQUFRLEdBQUdmLE1BQU0sQ0FBQ08sSUFBUCxDQUFZO0FBQUMsYUFBT1c7QUFBUixLQUFaLEVBQThCRixLQUE5QixFQUFmLENBRjBCLENBRzFCOztBQUNBLFFBQUlELFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQnJCLFdBQUssR0FBR00sTUFBTSxDQUFDaUIsT0FBUCxDQUFlO0FBQUMsbUJBQVdDO0FBQVosT0FBZixDQUFSLENBRGdCLENBRWhCO0FBQ0U7O0FBQ00sYUFBT2xCLE1BQU0sQ0FBQ21CLE1BQVAsQ0FBY0QsT0FBZCxDQUFQLENBSlEsQ0FLWjtBQUNFO0FBQ0Y7QUFFSjtBQUNFO0FBQ0Y7QUFDSCxLQVpELE1BWU87QUFDSCxZQUFNLElBQUlmLE1BQU0sQ0FBQ1UsS0FBWCxDQUFpQixHQUFqQixFQUFzQixpQkFBdEIsQ0FBTjtBQUNIO0FBQ0osR0FsRlU7O0FBb0ZYLHFCQUFvQk8sUUFBcEIsRUFBOEI7QUFDMUIsUUFBSUwsUUFBUSxHQUFHZixNQUFNLENBQUNPLElBQVAsQ0FBWTtBQUFDLGlCQUFXYSxRQUFRLENBQUNGO0FBQXJCLEtBQVosRUFBMkNGLEtBQTNDLEVBQWY7O0FBQ0EsUUFBSUQsUUFBUSxLQUFLLENBQWpCLEVBQW9CO0FBQ2hCTixhQUFPLENBQUNDLEdBQVIsQ0FBWSxJQUFaO0FBQ0FELGFBQU8sQ0FBQ0MsR0FBUixDQUFZVSxRQUFRLENBQUNDLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0JDLFFBQXRCLENBQStCLENBQS9CLENBQVo7QUFDQXRCLFlBQU0sQ0FBQ3VCLE1BQVAsQ0FBYztBQUFDTCxlQUFPLEVBQUVFLFFBQVEsQ0FBQ0Y7QUFBbkIsT0FBZCxFQUEyQztBQUN2Q00sWUFBSSxFQUFFO0FBQ0ZDLG9CQUFVLEVBQUVMLFFBQVEsQ0FBQ0ssVUFEbkI7QUFFRkMsc0JBQVksRUFBRU4sUUFBUSxDQUFDTyxPQUZyQjtBQUdGL0Isb0JBQVUsRUFBRXdCLFFBQVEsQ0FBQ3hCO0FBSG5CO0FBRGlDLE9BQTNDO0FBU0Q7Ozs7Ozs7O0FBV0M7Ozs7Ozs7O0FBUUgsS0EvQkQsTUErQk07QUFDRixZQUFNLElBQUlPLE1BQU0sQ0FBQ1UsS0FBWCxDQUFpQixHQUFqQixFQUFzQixpQkFBdEIsQ0FBTjtBQUNIO0FBQ0osR0F4SFU7O0FBMEhYLHlCQUF1QjtBQUNuQixXQUFPYixNQUFNLENBQUNPLElBQVAsR0FBY3FCLEtBQWQsRUFBUDtBQUNILEdBNUhVOztBQThIWCwyQkFBMEJqQixNQUExQixFQUFpQztBQUM3QixRQUFJa0IsU0FBUyxHQUFHN0IsTUFBTSxDQUFDTyxJQUFQLEdBQWNxQixLQUFkLEVBQWhCO0FBQ0EsUUFBSUUsU0FBUyxHQUFHLEVBQWhCO0FBQ0FELGFBQVMsQ0FBQ2hDLEdBQVYsQ0FBZUgsS0FBRCxJQUFXO0FBQ3JCLFVBQUdILFVBQVUsQ0FBQ0MsZ0JBQVgsQ0FBNEJtQixNQUE1QixDQUFILEVBQXVDO0FBQ25DbUIsaUJBQVMsQ0FBQ0MsSUFBVixDQUFlckMsS0FBZjtBQUNIO0FBQ0osS0FKRDtBQU1BLFdBQU9tQyxTQUFQO0FBRUgsR0F6SVU7O0FBMklYLGtCQUFpQlgsT0FBakIsRUFBeUI7QUFDckIsUUFBSXhCLEtBQUo7QUFDQSxRQUFJcUIsUUFBUSxHQUFHZixNQUFNLENBQUNPLElBQVAsQ0FBWTtBQUFDLGFBQU9XO0FBQVIsS0FBWixFQUE4QkYsS0FBOUIsRUFBZjs7QUFDQSxRQUFJRCxRQUFRLEtBQUssQ0FBakIsRUFBb0I7QUFDaEJyQixXQUFLLEdBQUdNLE1BQU0sQ0FBQ2lCLE9BQVAsQ0FBZTtBQUFDLG1CQUFXQztBQUFaLE9BQWYsQ0FBUixDQURnQixDQUVoQjtBQUNBOztBQUNBLGFBQU94QixLQUFLLENBQUNzQyxVQUFiLENBSmdCLENBS2hCO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNILEtBWkQsTUFZTztBQUNILFlBQU0sSUFBSTdCLE1BQU0sQ0FBQ1UsS0FBWCxDQUFpQixHQUFqQixFQUFzQixpQkFBdEIsQ0FBTjtBQUNIO0FBQ0osR0E3SlU7O0FBOEpYLG1CQUFrQkssT0FBbEIsRUFBMkI7QUFDdkIsUUFBSXhCLEtBQUo7QUFDQSxRQUFJcUIsUUFBUSxHQUFHZixNQUFNLENBQUNPLElBQVAsQ0FBWTtBQUFDLGFBQU9XO0FBQVIsS0FBWixFQUE4QkYsS0FBOUIsRUFBZjs7QUFDQSxRQUFJRCxRQUFRLEtBQUssQ0FBakIsRUFBb0I7QUFDaEJyQixXQUFLLEdBQUdNLE1BQU0sQ0FBQ2lCLE9BQVAsQ0FBZTtBQUFDLG1CQUFXQztBQUFaLE9BQWYsQ0FBUixDQURnQixDQUVoQjtBQUNBOztBQUNBLFVBQUllLEtBQUssR0FBRyxFQUFaO0FBQ0F2QyxXQUFLLENBQUMyQixTQUFOLENBQWdCeEIsR0FBaEIsQ0FBcUJxQyxJQUFELElBQVU7QUFDMUI7QUFDQSxZQUFJQyxPQUFPLEdBQUdoQyxNQUFNLENBQUNpQyxJQUFQLENBQVksU0FBWixFQUFzQkYsSUFBSSxDQUFDbkMsR0FBM0IsQ0FBZDtBQUNBb0MsZUFBTyxDQUFDYixRQUFSLENBQWlCekIsR0FBakIsQ0FBc0J3QyxJQUFELElBQVU7QUFDM0JKLGVBQUssQ0FBQ0YsSUFBTixDQUFXTSxJQUFYO0FBQ0gsU0FGRDtBQUdILE9BTkQ7QUFRQSxhQUFPSixLQUFQLENBYmdCLENBY2hCO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNILEtBckJELE1BcUJPO0FBQ0gsWUFBTSxJQUFJOUIsTUFBTSxDQUFDVSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGlCQUF0QixDQUFOO0FBQ0g7QUFDSixHQXpMVTs7QUEyTFgsbUJBQWtCSyxPQUFsQixFQUEyQjtBQUN2QixRQUFJeEIsS0FBSjtBQUNBLFFBQUlxQixRQUFRLEdBQUdmLE1BQU0sQ0FBQ08sSUFBUCxDQUFZO0FBQUMsYUFBT1c7QUFBUixLQUFaLEVBQThCRixLQUE5QixFQUFmOztBQUNBLFFBQUlELFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQnJCLFdBQUssR0FBR00sTUFBTSxDQUFDaUIsT0FBUCxDQUFlO0FBQUMsbUJBQVdDO0FBQVosT0FBZixDQUFSLENBRGdCLENBRWhCO0FBQ0E7O0FBQ0EsYUFBT3hCLEtBQUssQ0FBQzRDLFNBQWIsQ0FKZ0IsQ0FLaEI7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0gsS0FaRCxNQVlPO0FBQ0gsWUFBTSxJQUFJbkMsTUFBTSxDQUFDVSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGlCQUF0QixDQUFOO0FBQ0g7QUFDSixHQTdNVTs7QUErTVgsb0JBQW1CSyxPQUFuQixFQUE0QjtBQUN4QixRQUFJeEIsS0FBSjtBQUNBLFFBQUk2QyxLQUFLLEdBQUcsRUFBWjtBQUNBLFFBQUl4QixRQUFRLEdBQUdmLE1BQU0sQ0FBQ08sSUFBUCxDQUFZO0FBQUMsYUFBT1c7QUFBUixLQUFaLEVBQThCRixLQUE5QixFQUFmOztBQUNBLFFBQUlELFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQnJCLFdBQUssR0FBR00sTUFBTSxDQUFDaUIsT0FBUCxDQUFlO0FBQUMsbUJBQVdDO0FBQVosT0FBZixDQUFSLENBRGdCLENBRWhCO0FBQ0E7O0FBQ0F4QixXQUFLLENBQUMyQixTQUFOLENBQWdCeEIsR0FBaEIsQ0FBcUJxQyxJQUFELElBQVU7QUFDMUIsWUFBSUMsT0FBTyxHQUFHaEMsTUFBTSxDQUFDaUMsSUFBUCxDQUFZLGNBQVosRUFBMkJGLElBQUksQ0FBQ25DLEdBQWhDLENBQWQ7QUFDQXdDLGFBQUssQ0FBQ1IsSUFBTixDQUFXSSxPQUFYO0FBQ0gsT0FIRDtBQUlBLGFBQU9JLEtBQVAsQ0FSZ0IsQ0FTaEI7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0gsS0FoQkQsTUFnQk87QUFDSCxZQUFNLElBQUlwQyxNQUFNLENBQUNVLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsaUJBQXRCLENBQU47QUFDSDtBQUNKLEdBdE9VOztBQXVPWCxzQkFBcUJLLE9BQXJCLEVBQTZCc0IsTUFBN0IsRUFBcUMsQ0FFcEMsQ0F6T1U7O0FBMk9YLHNCQUFxQnRCLE9BQXJCLEVBQThCdUIsTUFBOUIsRUFBc0MsQ0FFckM7O0FBN09VLENBQWYsRTs7Ozs7Ozs7Ozs7QUNQQSxJQUFJQyxLQUFKO0FBQVVyRCxNQUFNLENBQUNZLElBQVAsQ0FBWSxnQkFBWixFQUE2QjtBQUFDeUMsT0FBSyxDQUFDeEMsQ0FBRCxFQUFHO0FBQUN3QyxTQUFLLEdBQUN4QyxDQUFOO0FBQVE7O0FBQWxCLENBQTdCLEVBQWlELENBQWpEO0FBQW9ELElBQUlDLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXlDLE1BQUo7QUFBV3RELE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQzBDLFFBQU0sQ0FBQ3pDLENBQUQsRUFBRztBQUFDeUMsVUFBTSxHQUFDekMsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJMEMsVUFBSjtBQUFldkQsTUFBTSxDQUFDWSxJQUFQLENBQVksMkJBQVosRUFBd0M7QUFBQzJDLFlBQVUsQ0FBQzFDLENBQUQsRUFBRztBQUFDMEMsY0FBVSxHQUFDMUMsQ0FBWDtBQUFhOztBQUE1QixDQUF4QyxFQUFzRSxDQUF0RTtBQU03TUMsTUFBTSxDQUFDSyxPQUFQLENBQWU7QUFDWCxvQkFBa0JxQyxRQUFsQixFQUE0QjtBQUN4QixXQUFPSCxLQUFLLENBQUM5QixNQUFOLENBQWE7QUFBQ2tDLGVBQVMsRUFBRUQ7QUFBWixLQUFiLENBQVA7QUFDSCxHQUhVOztBQUtYLGlCQUFnQkUsTUFBaEIsRUFBd0I7QUFDcEIsUUFBSWhDLFFBQVEsR0FBRzJCLEtBQUssQ0FBQ25DLElBQU4sQ0FBVztBQUFDLGFBQU93QztBQUFSLEtBQVgsRUFBNEIvQixLQUE1QixFQUFmOztBQUNBLFFBQUlELFFBQVEsS0FBSyxDQUFqQixFQUFvQjtBQUNoQixVQUFJbUIsSUFBSSxHQUFHYyxJQUFJLENBQUMvQixPQUFMLENBQWE7QUFBQyxlQUFPOEI7QUFBUixPQUFiLENBQVg7QUFDQSxhQUFPYixJQUFQO0FBQ0gsS0FIRCxNQUdPO0FBQ0gsWUFBTSxJQUFJL0IsTUFBTSxDQUFDVSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGdCQUF0QixDQUFOO0FBQ0g7QUFFSixHQWRVOztBQWVYLG9CQUFrQkMsT0FBbEIsRUFBMkJpQyxNQUEzQixFQUFtQyxDQUVsQyxDQWpCVTs7QUFtQlgsa0JBQWlCYixJQUFqQixFQUF1QixDQUV0QixDQXJCVTs7QUF1Qlgsc0JBQW9CLENBRW5COztBQXpCVSxDQUFmLEUsQ0E0QkE7O0FBQ0FVLFVBQVUsQ0FBQ0ssVUFBWCxDQUFzQkMsR0FBdEIsQ0FBMEIsVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CQyxJQUFuQixFQUF5QjtBQUMvQyxNQUFHRixHQUFHLENBQUNHLEtBQUosQ0FBVUMsS0FBYixFQUFvQjtBQUNoQlgsY0FBVSxDQUFDWSxVQUFYLENBQXNCSixHQUF0QixFQUEyQjtBQUN2QkssVUFBSSxFQUFFLEdBRGlCO0FBRXZCQyxVQUFJLEVBQUU7QUFDRkMsY0FBTSxFQUFFO0FBRE47QUFGaUIsS0FBM0I7QUFNSDs7QUFFRE4sTUFBSTtBQUNQLENBWEQ7QUFjQVQsVUFBVSxDQUFDZ0IsR0FBWCxDQUFlLE1BQWYsRUFBdUIsVUFBdkIsRUFBbUMsVUFBU1QsR0FBVCxFQUFjQyxHQUFkLEVBQW1CQyxJQUFuQixFQUF5QjtBQUN4RDVDLFNBQU8sQ0FBQ0MsR0FBUixDQUFZeUMsR0FBWjtBQUNBaEQsUUFBTSxDQUFDMEQsS0FBUCxDQUFhakQsTUFBYixDQUFvQjtBQUNoQmtELFlBQVEsRUFBRVgsR0FBRyxDQUFDWSxJQUFKLENBQVNDLEtBQVQsQ0FBZUYsUUFEVDtBQUVoQkcsYUFBUyxFQUFFZCxHQUFHLENBQUNZLElBQUosQ0FBU0MsS0FBVCxDQUFlQyxTQUZWO0FBR2hCQyxZQUFRLEVBQUVmLEdBQUcsQ0FBQ1ksSUFBSixDQUFTQyxLQUFULENBQWVFLFFBSFQ7QUFJaEJDLFlBQVEsRUFBRWhCLEdBQUcsQ0FBQ1ksSUFBSixDQUFTQyxLQUFULENBQWVHLFFBSlQ7QUFLaEJDLFNBQUssRUFBRWpCLEdBQUcsQ0FBQ1ksSUFBSixDQUFTQyxLQUFULENBQWVJO0FBTE4sR0FBcEI7QUFPQXhCLFlBQVUsQ0FBQ1ksVUFBWCxDQUFzQkosR0FBdEIsRUFBMkI7QUFDdkJNLFFBQUksRUFBRTtBQUNGQyxZQUFNLEVBQUV4RCxNQUFNLENBQUMwRCxLQUFQLENBQWF0RCxJQUFiLEdBQW9CcUIsS0FBcEI7QUFETjtBQURpQixHQUEzQjtBQUtILENBZEQsRTs7Ozs7Ozs7Ozs7QUNqREEsSUFBSXpCLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSW1FLElBQUo7QUFBU2hGLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGdCQUFaLEVBQTZCO0FBQUNvRSxNQUFJLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFFBQUksR0FBQ25FLENBQUw7QUFBTzs7QUFBaEIsQ0FBN0IsRUFBK0MsQ0FBL0M7QUFHekVDLE1BQU0sQ0FBQ0ssT0FBUCxDQUFlO0FBQ1gscUJBQW1COEQsSUFBbkIsRUFBd0I7QUFDcEIsUUFBRyxDQUFDLEtBQUszRCxNQUFULEVBQWdCO0FBQ1osWUFBTSxJQUFJUixNQUFNLENBQUNVLEtBQVgsQ0FBaUIsZ0JBQWpCLENBQU47QUFDSCxLQUhtQixDQUlwQjtBQUNBOzs7QUFDQSxXQUFPd0QsSUFBSSxDQUFDekQsTUFBTCxDQUFZO0FBQ2YyRCxjQUFRLEVBQUVELElBQUksQ0FBQ0UsU0FEQTtBQUVmQyxxQkFBZSxFQUFFSCxJQUFJLENBQUNHLGVBRlA7QUFHZkMsZUFBUyxFQUFHLEtBQUsvRCxNQUhGO0FBSWZnRSxpQkFBVyxFQUFHTCxJQUFJLENBQUNNO0FBSkosS0FBWixDQUFQO0FBT0gsR0FkVTs7QUFnQlgsZUFBWTtBQUNSO0FBQ0QsUUFBRyxDQUFDLEtBQUtqRSxNQUFULEVBQWdCO0FBQ1gsWUFBTSxJQUFJUixNQUFNLENBQUNVLEtBQVgsQ0FBaUIsZ0JBQWpCLENBQU47QUFDSDs7QUFFRCxRQUFJZ0UsS0FBSyxHQUFHUixJQUFJLENBQUM5RCxJQUFMLEVBQVo7QUFFQSxRQUFHc0UsS0FBSCxFQUNJLE9BQU9BLEtBQVAsQ0FESixLQUdFLE1BQU0sSUFBSTFFLE1BQU0sQ0FBQ1UsS0FBWCxDQUFpQixHQUFqQixFQUFzQixnQkFBdEIsQ0FBTjtBQUNMOztBQTVCVSxDQUFmLEU7Ozs7Ozs7Ozs7O0FDSEEsSUFBSVYsTUFBSjtBQUFXZCxNQUFNLENBQUNZLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNFLFFBQU0sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFVBQU0sR0FBQ0QsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJNEUsUUFBSjtBQUFhekYsTUFBTSxDQUFDWSxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQzZFLFVBQVEsQ0FBQzVFLENBQUQsRUFBRztBQUFDNEUsWUFBUSxHQUFDNUUsQ0FBVDtBQUFXOztBQUF4QixDQUFuQyxFQUE2RCxDQUE3RDtBQUc3RUMsTUFBTSxDQUFDRyxPQUFQLENBQWUsT0FBZixFQUF3QixZQUFVO0FBQzlCLE1BQUcsS0FBS0ssTUFBUixFQUFnQixPQUFPUixNQUFNLENBQUMwRCxLQUFQLENBQWF0RCxJQUFiLENBQWtCO0FBQUNSLE9BQUcsRUFBRTtBQUFDZ0YsU0FBRyxFQUFFLEtBQUtwRTtBQUFYO0FBQU4sR0FBbEIsRUFBNkM7QUFBQ3FFLFVBQU0sRUFBRTtBQUFFQyxhQUFPLEVBQUU7QUFBWDtBQUFULEdBQTdDLENBQVA7QUFDbkIsQ0FGRDtBQUlBOUUsTUFBTSxDQUFDRyxPQUFQLENBQWUsTUFBZixFQUF1QixZQUFZO0FBQy9CLFNBQU9ILE1BQU0sQ0FBQzBELEtBQVAsQ0FBYXRELElBQWIsQ0FBa0I7QUFBQ1IsT0FBRyxFQUFFLEtBQUtZO0FBQVgsR0FBbEIsQ0FBUDtBQUNILENBRkQ7QUFJQVIsTUFBTSxDQUFDSyxPQUFQLENBQWU7QUFDWCxpQkFBZTtBQUFDMEQsWUFBRDtBQUFXRCxhQUFYO0FBQXNCRyxTQUF0QjtBQUE2QkQ7QUFBN0IsR0FBZixFQUFzRDtBQUNsRCxRQUFHQSxRQUFRLENBQUNlLE1BQVQsR0FBa0IsQ0FBckIsRUFBd0IsTUFBTSxJQUFJL0UsTUFBTSxDQUFDVSxLQUFYLENBQWlCLDRDQUFqQixDQUFOLENBQXhCLEtBQ0ssSUFBRyxDQUFDdUQsS0FBRCxJQUFVLENBQUNGLFFBQVgsSUFBdUIsQ0FBQ0QsU0FBM0IsRUFBc0MsTUFBTSxJQUFJOUQsTUFBTSxDQUFDVSxLQUFYLENBQWlCLHVCQUFqQixDQUFOLENBQXRDLEtBQ0E7QUFDRCxVQUFJc0UsT0FBTyxHQUFHO0FBQ1ZmLGFBQUssRUFBRUEsS0FERztBQUVWRCxnQkFBUSxFQUFFQSxRQUZBO0FBR1ZjLGVBQU8sRUFBRTtBQUNMZixrQkFBUSxFQUFFQSxRQURMO0FBRUxELG1CQUFTLEVBQUVBLFNBRk47QUFHTG1CLHNCQUFZLEVBQUUsS0FIVDtBQUlMaEIsZUFBSyxFQUFFQTtBQUpGO0FBSEMsT0FBZDtBQVdBVSxjQUFRLENBQUNPLFVBQVQsQ0FBb0JGLE9BQXBCO0FBQ0g7QUFDSixHQWxCVTs7QUFtQlgsd0JBQXNCZixLQUF0QixFQUE2QkYsUUFBN0IsRUFBdUNELFNBQXZDLEVBQWlEO0FBQzdDOUQsVUFBTSxDQUFDMEQsS0FBUCxDQUFhdEMsTUFBYixDQUFvQnBCLE1BQU0sQ0FBQ1EsTUFBUCxFQUFwQixFQUFxQztBQUFFYSxVQUFJLEVBQUU7QUFDekM4RCxjQUFNLEVBQUUsQ0FBQztBQUFDQyxpQkFBTyxFQUFFbkIsS0FBVjtBQUFpQm9CLGtCQUFRLEVBQUU7QUFBM0IsU0FBRCxDQURpQztBQUV6Qyw0QkFBb0J0QixRQUZxQjtBQUd6Qyw2QkFBcUJELFNBSG9CO0FBSXpDLHlCQUFpQkc7QUFKd0I7QUFBUixLQUFyQztBQU1BLFdBQU9qRSxNQUFNLENBQUNMLElBQVAsRUFBUDtBQUNILEdBM0JVOztBQTRCWCx5QkFBdUIyRixjQUF2QixFQUF1Q0MsV0FBdkMsRUFBbUQ7QUFDL0MsUUFBSUMsYUFBYSxHQUFHYixRQUFRLENBQUNjLGNBQVQsQ0FBd0J6RixNQUFNLENBQUNMLElBQVAsRUFBeEIsRUFBdUMyRixjQUF2QyxDQUFwQjs7QUFDQSxRQUFHRSxhQUFhLENBQUNwQyxLQUFqQixFQUF3QixNQUFNLElBQUlwRCxNQUFNLENBQUNVLEtBQVgsQ0FBaUI4RSxhQUFhLENBQUNwQyxLQUFkLENBQW9Cc0MsTUFBckMsQ0FBTixDQUF4QixLQUNJO0FBQ0FmLGNBQVEsQ0FBQ2dCLFdBQVQsQ0FBcUIzRixNQUFNLENBQUNRLE1BQVAsRUFBckIsRUFBc0MrRSxXQUF0QyxFQUFtRDtBQUFDSyxjQUFNLEVBQUU7QUFBVCxPQUFuRDtBQUNIO0FBQ0osR0FsQ1U7O0FBbUNYLDBCQUF3QlgsWUFBeEIsRUFBcUM7QUFDakNqRixVQUFNLENBQUMwRCxLQUFQLENBQWF0QyxNQUFiLENBQW9CcEIsTUFBTSxDQUFDUSxNQUFQLEVBQXBCLEVBQXFDO0FBQUVhLFVBQUksRUFBRTtBQUN6QyxnQ0FBd0I0RDtBQURpQjtBQUFSLEtBQXJDO0FBR0EsV0FBT2pGLE1BQU0sQ0FBQ0wsSUFBUCxFQUFQO0FBQ0gsR0F4Q1U7O0FBeUNYLG1CQUFnQjtBQUNaSyxVQUFNLENBQUMwRCxLQUFQLENBQWExQyxNQUFiLENBQW9CaEIsTUFBTSxDQUFDUSxNQUFQLEVBQXBCO0FBQ0gsR0EzQ1U7O0FBNENYLGtCQUFnQnlELEtBQWhCLEVBQXNCO0FBQ2xCLFdBQU9qRSxNQUFNLENBQUMwRCxLQUFQLENBQWE1QyxPQUFiLENBQXFCO0FBQUMsdUJBQWlCbUQ7QUFBbEIsS0FBckIsQ0FBUDtBQUNILEdBOUNVOztBQStDWCxxQkFBa0I7QUFDZCxXQUFPakUsTUFBTSxDQUFDMEQsS0FBUCxDQUFhdEQsSUFBYixFQUFQO0FBQ0g7O0FBakRVLENBQWYsRTs7Ozs7Ozs7Ozs7QUNYQWxCLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUMwRyxpQkFBZSxFQUFDLE1BQUlBO0FBQXJCLENBQWQ7QUFBcUQsSUFBSUMsWUFBSjtBQUFpQjVHLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0ksU0FBTyxDQUFDSCxDQUFELEVBQUc7QUFBQytGLGdCQUFZLEdBQUMvRixDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlnRyxVQUFKO0FBQWU3RyxNQUFNLENBQUNZLElBQVAsQ0FBWSxTQUFaLEVBQXNCO0FBQUNpRyxZQUFVLENBQUNoRyxDQUFELEVBQUc7QUFBQ2dHLGNBQVUsR0FBQ2hHLENBQVg7QUFBYTs7QUFBNUIsQ0FBdEIsRUFBb0QsQ0FBcEQ7QUFHekksTUFBTThGLGVBQWUsR0FBRyxJQUFJQyxZQUFKLENBQWlCO0FBQzlDbkcsTUFBSSxFQUFFO0FBQ0ZxRyxRQUFJLEVBQUVELFVBREo7QUFFRkUsU0FBSyxFQUFFLE1BRkw7QUFHRkMsWUFBUSxFQUFFO0FBSFIsR0FEd0M7QUFNOUNDLFVBQVEsRUFBRTtBQUNOSCxRQUFJLEVBQUVJLE1BREE7QUFFTkgsU0FBSyxFQUFFLE1BRkQ7QUFHTkMsWUFBUSxFQUFFO0FBSEo7QUFOb0MsQ0FBakIsQ0FBeEIsQzs7Ozs7Ozs7Ozs7QUNIUGhILE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNVLFFBQU0sRUFBQyxNQUFJQSxNQUFaO0FBQW1Cd0csYUFBVyxFQUFDLE1BQUlBO0FBQW5DLENBQWQ7QUFBK0QsSUFBSUMsS0FBSjtBQUFVcEgsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDd0csT0FBSyxDQUFDdkcsQ0FBRCxFQUFHO0FBQUN1RyxTQUFLLEdBQUN2RyxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBQWtELElBQUkrRixZQUFKO0FBQWlCNUcsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDSSxTQUFPLENBQUNILENBQUQsRUFBRztBQUFDK0YsZ0JBQVksR0FBQy9GLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSXdHLFVBQUo7QUFBZXJILE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLFFBQVosRUFBcUI7QUFBQ3lHLFlBQVUsQ0FBQ3hHLENBQUQsRUFBRztBQUFDd0csY0FBVSxHQUFDeEcsQ0FBWDtBQUFhOztBQUE1QixDQUFyQixFQUFtRCxDQUFuRDtBQUFzRCxJQUFJOEYsZUFBSjtBQUFvQjNHLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGFBQVosRUFBMEI7QUFBQytGLGlCQUFlLENBQUM5RixDQUFELEVBQUc7QUFBQzhGLG1CQUFlLEdBQUM5RixDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUIsRUFBa0UsQ0FBbEU7QUFFelIsTUFBTUYsTUFBTSxHQUFHLElBQUl5RyxLQUFLLENBQUNFLFVBQVYsQ0FBcUIsUUFBckIsQ0FBZjtBQU1BLE1BQU1ILFdBQVcsR0FBRyxJQUFJUCxZQUFKLENBQWlCO0FBQzFDeEUsWUFBVSxFQUFFO0FBQ1IwRSxRQUFJLEVBQUVTLE1BREU7QUFFUlIsU0FBSyxFQUFFLE9BRkM7QUFHUkMsWUFBUSxFQUFFO0FBSEYsR0FEOEI7QUFNMUNRLGtCQUFnQixFQUFFO0FBQ2RWLFFBQUksRUFBRVMsTUFEUTtBQUVkUixTQUFLLEVBQUUsYUFGTztBQUdkQyxZQUFRLEVBQUU7QUFISSxHQU53QjtBQVcxQ3pHLFlBQVUsRUFBRTtBQUNSdUcsUUFBSSxFQUFFVyxLQURFO0FBRVJWLFNBQUssRUFBRSxPQUZDO0FBR1JDLFlBQVEsRUFBRTtBQUhGLEdBWDhCO0FBZ0IxQyxrQkFBZ0JMLGVBaEIwQjtBQWdCVDtBQUNqQ3RFLGNBQVksRUFBRTtBQUNWeUUsUUFBSSxFQUFFRixZQUFZLENBQUNjLE9BRFQ7QUFFVlgsU0FBSyxFQUFFLFNBRkc7QUFHVkMsWUFBUSxFQUFFO0FBSEEsR0FqQjRCO0FBc0IxQ1csWUFBVSxFQUFFO0FBQ1JiLFFBQUksRUFBRVcsS0FERTtBQUVSVixTQUFLLEVBQUUsT0FGQztBQUdSYSxnQkFBWSxFQUFFO0FBSE4sR0F0QjhCO0FBMkIxQyxrQkFBZ0JQLFVBM0IwQjtBQTJCZDtBQUUxQnBFLFdBQVMsRUFBRTtBQUNUNkQsUUFBSSxFQUFFVyxLQURHO0FBRVRWLFNBQUssRUFBRSxNQUZFO0FBR1RhLGdCQUFZLEVBQUU7QUFITCxHQTdCNkI7QUFrQzFDLGlCQUFlQyxNQWxDMkI7QUFrQ25CO0FBQ3ZCbEYsWUFBVSxFQUFFO0FBQ1JtRSxRQUFJLEVBQUVXLEtBREU7QUFFUlYsU0FBSyxFQUFFLE9BRkM7QUFHUmEsZ0JBQVksRUFBRTtBQUhOLEdBbkM4QjtBQXdDMUMsa0JBQWdCQyxNQXhDMEI7QUF3Q2xCO0FBQ3hCQyxnQkFBYyxFQUFDO0FBQ1hoQixRQUFJLEVBQUVpQixJQURLO0FBRVhDLGFBQVMsRUFBRSxZQUFVO0FBQUMsYUFBTyxJQUFJRCxJQUFKLEVBQVA7QUFBbUI7QUFGOUI7QUF6QzJCLENBQWpCLENBQXBCO0FBK0NQcEgsTUFBTSxDQUFDc0gsWUFBUCxDQUFvQmQsV0FBcEIsRTs7Ozs7Ozs7Ozs7QUN2REFuSCxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDaUksT0FBSyxFQUFDLE1BQUlBLEtBQVg7QUFBaUJDLFlBQVUsRUFBQyxNQUFJQTtBQUFoQyxDQUFkO0FBQTJELElBQUl2QixZQUFKO0FBQWlCNUcsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDSSxTQUFPLENBQUNILENBQUQsRUFBRztBQUFDK0YsZ0JBQVksR0FBQy9GLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSXVHLEtBQUo7QUFBVXBILE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ3dHLE9BQUssQ0FBQ3ZHLENBQUQsRUFBRztBQUFDdUcsU0FBSyxHQUFDdkcsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUkxSSxNQUFNcUgsS0FBSyxHQUFHLElBQUlkLEtBQUssQ0FBQ0UsVUFBVixDQUFxQixPQUFyQixDQUFkO0FBRUEsTUFBTWEsVUFBVSxHQUFHLElBQUl2QixZQUFKLENBQWlCO0FBQ3pDeEQsUUFBTSxFQUFFO0FBQ0owRCxRQUFJLEVBQUVTLE1BREY7QUFFSlIsU0FBSyxFQUFFLElBRkg7QUFHSnFCLFNBQUssRUFBRXhCLFlBQVksQ0FBQ3lCLEtBQWIsQ0FBbUJDO0FBSHRCLEdBRGlDO0FBTXpDQyxXQUFTLEVBQUU7QUFDUHpCLFFBQUksRUFBRVMsTUFEQztBQUVQUixTQUFLLEVBQUUsT0FGQTtBQUdQQyxZQUFRLEVBQUU7QUFISCxHQU44QjtBQVd6Q3dCLGlCQUFlLEVBQUU7QUFDYjFCLFFBQUksRUFBRVMsTUFETztBQUViUixTQUFLLEVBQUUsYUFGTTtBQUdiYSxnQkFBWSxFQUFFO0FBSEQsR0FYd0I7QUFnQnpDYSxTQUFPLEVBQUU7QUFDTDNCLFFBQUksRUFBRVcsS0FERDtBQUVMVixTQUFLLEVBQUUsTUFGRjtBQUdMYSxnQkFBWSxFQUFFO0FBSFQsR0FoQmdDO0FBcUJ6QyxlQUFhQyxNQXJCNEI7QUFxQnBCO0FBQ3JCYSxhQUFXLEVBQUU7QUFDVDVCLFFBQUksRUFBRVcsS0FERztBQUVUVixTQUFLLEVBQUUsVUFGRTtBQUdUYSxnQkFBWSxFQUFFO0FBSEwsR0F0QjRCO0FBMkJ6QyxtQkFBaUJDLE1BM0J3QjtBQTJCaEI7QUFDekJjLGdCQUFjLEVBQUU7QUFDWjdCLFFBQUksRUFBRVcsS0FETTtBQUVaVixTQUFLLEVBQUUsYUFGSztBQUdaYSxnQkFBWSxFQUFFO0FBSEYsR0E1QnlCO0FBaUN6QyxzQkFBb0JDLE1BakNxQjtBQWlDYjtBQUM1QmUsZUFBYSxFQUFFO0FBQ1g5QixRQUFJLEVBQUVXLEtBREs7QUFFWFYsU0FBSyxFQUFFLFlBRkk7QUFHWGEsZ0JBQVksRUFBRTtBQUhILEdBbEMwQjtBQXVDekMscUJBQW1CQyxNQXZDc0I7QUF1Q2Q7QUFDM0JnQixlQUFhLEVBQUM7QUFDWi9CLFFBQUksRUFBRWlCLElBRE07QUFFWkMsYUFBUyxFQUFFLFlBQVU7QUFBQyxhQUFPLElBQUlELElBQUosRUFBUDtBQUFtQjtBQUY3QjtBQXhDMkIsQ0FBakIsQ0FBbkI7QUE4Q1BHLEtBQUssQ0FBQ0QsWUFBTixDQUFtQkUsVUFBbkIsRTs7Ozs7Ozs7Ozs7QUNwREFuSSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDb0QsT0FBSyxFQUFDLE1BQUlBLEtBQVg7QUFBaUJnRSxZQUFVLEVBQUMsTUFBSUE7QUFBaEMsQ0FBZDtBQUEyRCxJQUFJVCxZQUFKO0FBQWlCNUcsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDSSxTQUFPLENBQUNILENBQUQsRUFBRztBQUFDK0YsZ0JBQVksR0FBQy9GLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSXVHLEtBQUo7QUFBVXBILE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ3dHLE9BQUssQ0FBQ3ZHLENBQUQsRUFBRztBQUFDdUcsU0FBSyxHQUFDdkcsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUFrRCxJQUFJc0gsVUFBSjtBQUFlbkksTUFBTSxDQUFDWSxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDdUgsWUFBVSxDQUFDdEgsQ0FBRCxFQUFHO0FBQUNzSCxjQUFVLEdBQUN0SCxDQUFYO0FBQWE7O0FBQTVCLENBQXJCLEVBQW1ELENBQW5EO0FBSzNNLE1BQU13QyxLQUFLLEdBQUcsSUFBSStELEtBQUssQ0FBQ0UsVUFBVixDQUFxQixPQUFyQixDQUFkO0FBRUEsTUFBTUQsVUFBVSxHQUFHLElBQUlULFlBQUosQ0FBaUI7QUFDekN6RCxRQUFNLEVBQUU7QUFDTjJELFFBQUksRUFBRVMsTUFEQTtBQUVOUixTQUFLLEVBQUUsSUFGRDtBQUdOcUIsU0FBSyxFQUFFeEIsWUFBWSxDQUFDeUIsS0FBYixDQUFtQkM7QUFIcEIsR0FEaUM7QUFNekM3RSxXQUFTLEVBQUU7QUFDVHFELFFBQUksRUFBRVMsTUFERztBQUVUUixTQUFLLEVBQUUsT0FGRTtBQUdUQyxZQUFRLEVBQUU7QUFIRCxHQU44QjtBQVd6Qy9FLFVBQVEsRUFBQztBQUNQNkUsUUFBSSxFQUFFVyxLQURDO0FBRVBWLFNBQUssRUFBRSxPQUZBO0FBR1BhLGdCQUFZLEVBQUU7QUFIUCxHQVhnQztBQWdCekMsZ0JBQWNPLFVBaEIyQjtBQWdCZjtBQUMxQlUsZUFBYSxFQUFDO0FBQ1ovQixRQUFJLEVBQUVpQixJQURNO0FBRVpDLGFBQVMsRUFBRSxZQUFVO0FBQUMsYUFBTyxJQUFJRCxJQUFKLEVBQVA7QUFBbUI7QUFGN0I7QUFqQjJCLENBQWpCLENBQW5CO0FBdUJQMUUsS0FBSyxDQUFDNEUsWUFBTixDQUFtQlosVUFBbkIsRTs7Ozs7Ozs7Ozs7QUM5QkFySCxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDK0UsTUFBSSxFQUFDLE1BQUlBO0FBQVYsQ0FBZDtBQUErQixJQUFJb0MsS0FBSjtBQUFVcEgsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDd0csT0FBSyxDQUFDdkcsQ0FBRCxFQUFHO0FBQUN1RyxTQUFLLEdBQUN2RyxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBQWtELElBQUkrRixZQUFKO0FBQWlCNUcsTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDSSxTQUFPLENBQUNILENBQUQsRUFBRztBQUFDK0YsZ0JBQVksR0FBQy9GLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSWdHLFVBQUo7QUFBZTdHLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLFlBQVosRUFBeUI7QUFBQ2lHLFlBQVUsQ0FBQ2hHLENBQUQsRUFBRztBQUFDZ0csY0FBVSxHQUFDaEcsQ0FBWDtBQUFhOztBQUE1QixDQUF6QixFQUF1RCxDQUF2RDtBQUEwRCxJQUFJaUksV0FBSjtBQUFnQjlJLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUNrSSxhQUFXLENBQUNqSSxDQUFELEVBQUc7QUFBQ2lJLGVBQVcsR0FBQ2pJLENBQVo7QUFBYzs7QUFBOUIsQ0FBL0IsRUFBK0QsQ0FBL0Q7QUFLelAsTUFBTW1FLElBQUksR0FBRyxJQUFJb0MsS0FBSyxDQUFDRSxVQUFWLENBQXFCLE9BQXJCLENBQWI7QUFFUCxNQUFNeUIsVUFBVSxHQUFHLElBQUluQyxZQUFKLENBQWlCO0FBQ2hDMUIsVUFBUSxFQUFFO0FBQ040QixRQUFJLEVBQUVTLE1BREE7QUFFTlIsU0FBSyxFQUFFO0FBRkQsR0FEc0I7QUFLaEMzQixpQkFBZSxFQUFFO0FBQ2IwQixRQUFJLEVBQUVTLE1BRE87QUFFYlIsU0FBSyxFQUFFLGFBRk07QUFHYmEsZ0JBQVksRUFBRTtBQUhELEdBTGU7QUFVaEN2QyxXQUFTLEVBQUc7QUFDUnlCLFFBQUksRUFBRVMsTUFERTtBQUVSUixTQUFLLEVBQUU7QUFGQyxHQVZvQjtBQWNoQ3pCLGFBQVcsRUFBQztBQUNSd0IsUUFBSSxFQUFFVyxLQURFO0FBRVJWLFNBQUssRUFBRyxTQUZBO0FBR1JhLGdCQUFZLEVBQUU7QUFITixHQWRvQjtBQW1CaEMsbUJBQWlCa0I7QUFuQmUsQ0FBakIsQ0FBbkI7QUF1QkE5RCxJQUFJLENBQUNpRCxZQUFMLENBQWtCYyxVQUFsQixFOzs7Ozs7Ozs7OztBQzlCQS9JLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUM2SSxhQUFXLEVBQUMsTUFBSUE7QUFBakIsQ0FBZDtBQUE2QyxJQUFJbEMsWUFBSjtBQUFpQjVHLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0ksU0FBTyxDQUFDSCxDQUFELEVBQUc7QUFBQytGLGdCQUFZLEdBQUMvRixDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlnRyxVQUFKO0FBQWU3RyxNQUFNLENBQUNZLElBQVAsQ0FBWSxTQUFaLEVBQXNCO0FBQUNpRyxZQUFVLENBQUNoRyxDQUFELEVBQUc7QUFBQ2dHLGNBQVUsR0FBQ2hHLENBQVg7QUFBYTs7QUFBNUIsQ0FBdEIsRUFBb0QsQ0FBcEQ7QUFHakksTUFBTWlJLFdBQVcsR0FBRyxJQUFJbEMsWUFBSixDQUFpQjtBQUN4Q25HLE1BQUksRUFBRTtBQUNKcUcsUUFBSSxFQUFFRCxVQURGO0FBRUpFLFNBQUssRUFBRTtBQUZILEdBRGtDO0FBTXhDRSxVQUFRLEVBQUU7QUFDUkgsUUFBSSxFQUFFSSxNQURFO0FBRVJILFNBQUssRUFBRTtBQUZDO0FBTjhCLENBQWpCLENBQXBCLEM7Ozs7Ozs7Ozs7O0FDSFAvRyxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDNEcsWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7QUFBMkMsSUFBSUQsWUFBSjtBQUFpQjVHLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0ksU0FBTyxDQUFDSCxDQUFELEVBQUc7QUFBQytGLGdCQUFZLEdBQUMvRixDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBRTVELE1BQU1tSSxpQkFBaUIsR0FBRyxJQUFJcEMsWUFBSixDQUFpQjtBQUN2Q2hDLFdBQVMsRUFBRTtBQUNQa0MsUUFBSSxFQUFFUyxNQURDO0FBRVAwQixZQUFRLEVBQUU7QUFGSCxHQUQ0QjtBQUt2Q3BFLFVBQVEsRUFBRTtBQUNOaUMsUUFBSSxFQUFFUyxNQURBO0FBRU4wQixZQUFRLEVBQUU7QUFGSixHQUw2QjtBQVN2Q2xFLE9BQUssRUFBRztBQUNKK0IsUUFBSSxFQUFFUyxNQURGO0FBRUowQixZQUFRLEVBQUU7QUFGTixHQVQrQjtBQWF2Q0MsZUFBYSxFQUFFO0FBQ1hwQyxRQUFJLEVBQUVxQyxPQURLO0FBRVhGLFlBQVEsRUFBRTtBQUZDO0FBYndCLENBQWpCLENBQTFCO0FBbUJPLE1BQU1wQyxVQUFVLEdBQUcsSUFBSUQsWUFBSixDQUFpQjtBQUN2Q25DLFVBQVEsRUFBRTtBQUNOcUMsUUFBSSxFQUFFUyxNQURBO0FBRU47QUFDQTtBQUNBO0FBQ0EwQixZQUFRLEVBQUU7QUFMSixHQUQ2QjtBQVF2Q2hELFFBQU0sRUFBRTtBQUNKYSxRQUFJLEVBQUVXLEtBREY7QUFFSjtBQUNBO0FBQ0E7QUFDQXdCLFlBQVEsRUFBRTtBQUxOLEdBUitCO0FBZXZDLGNBQVk7QUFDUm5DLFFBQUksRUFBRWU7QUFERSxHQWYyQjtBQWtCdkMsc0JBQW9CO0FBQ2hCZixRQUFJLEVBQUVTLE1BRFU7QUFFaEJhLFNBQUssRUFBRXhCLFlBQVksQ0FBQ3lCLEtBQWIsQ0FBbUJlO0FBRlYsR0FsQm1CO0FBc0J2Qyx1QkFBcUI7QUFDakJ0QyxRQUFJLEVBQUVxQztBQURXLEdBdEJrQjtBQXlCdkM7QUFDQUUsbUJBQWlCLEVBQUU7QUFDZnZDLFFBQUksRUFBRVcsS0FEUztBQUVmd0IsWUFBUSxFQUFFO0FBRkssR0ExQm9CO0FBOEJ2Qyx5QkFBdUI7QUFDbkJuQyxRQUFJLEVBQUVlLE1BRGE7QUFFbkJ5QixZQUFRLEVBQUU7QUFGUyxHQTlCZ0I7QUFrQ3ZDQyxXQUFTLEVBQUU7QUFDUHpDLFFBQUksRUFBRWlCO0FBREMsR0FsQzRCO0FBcUN2Q25DLFNBQU8sRUFBRTtBQUNMa0IsUUFBSSxFQUFFa0MsaUJBREQ7QUFFTEMsWUFBUSxFQUFFO0FBRkwsR0FyQzhCO0FBeUN2QztBQUNBTyxVQUFRLEVBQUU7QUFDTjFDLFFBQUksRUFBRWUsTUFEQTtBQUVOb0IsWUFBUSxFQUFFLElBRko7QUFHTkssWUFBUSxFQUFFO0FBSEosR0ExQzZCO0FBK0N2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FHLE9BQUssRUFBRTtBQUNIM0MsUUFBSSxFQUFFZSxNQURIO0FBRUhvQixZQUFRLEVBQUUsSUFGUDtBQUdISyxZQUFRLEVBQUU7QUFIUCxHQXZEZ0M7QUE0RHZDO0FBQ0E7QUFDQTtBQUNBRyxPQUFLLEVBQUU7QUFDSDNDLFFBQUksRUFBRVcsS0FESDtBQUVId0IsWUFBUSxFQUFFO0FBRlAsR0EvRGdDO0FBbUV2QyxhQUFXO0FBQ1BuQyxRQUFJLEVBQUVTO0FBREMsR0FuRTRCO0FBc0V2QztBQUNBbUMsV0FBUyxFQUFFO0FBQ1A1QyxRQUFJLEVBQUVpQixJQURDO0FBRVBrQixZQUFRLEVBQUU7QUFGSDtBQXZFNEIsQ0FBakIsQ0FBbkI7QUE2RVBuSSxNQUFNLENBQUMwRCxLQUFQLENBQWF5RCxZQUFiLENBQTBCcEIsVUFBMUIsRTs7Ozs7Ozs7Ozs7QUNsR0EsSUFBSS9GLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcURiLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGdCQUFaO0FBQThCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxjQUFaO0FBQTRCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxhQUFaO0FBQTJCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxhQUFaO0FBT3JKRSxNQUFNLENBQUM2SSxPQUFQLENBQWUsTUFBTSxDQUVwQixDQUZELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBib2FyZFV0aWxzIHtcclxuXHJcbiAgICBzdGF0aWMgY2hlY2tJbkJvYXJkVXNlcihpZFVzZXIsIGJvYXJkKXtcclxuICAgICAgICBsZXQgaXNJbiA9IGZhbHNlXHJcbiAgICAgICAgYm9hcmQuYm9hcmRVc2Vycy5tYXAoKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgaWYodXNlci5faWQgPT0gaWRVc2VyKXtcclxuICAgICAgICAgICAgICAgIGlzSW4gPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gaXNJblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtCb2FyZHN9IGZyb20gXCIuLi9tb2RlbHMvQm9hcmRzXCI7XHJcbmltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xyXG5pbXBvcnQge2JvYXJkVXRpbHN9IGZyb20gXCIuL1V0aWxzL2JvYXJkVXRpbHNcIjtcclxuaW1wb3J0IHJ1c0Z1bmN0aW9uIGZyb20gJ3J1cy1kaWZmJ1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goJ2JvYXJkcycsIGZ1bmN0aW9uICgpIHtyZXR1cm4gQm9hcmRzLmZpbmQoKX0pO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG5cclxuICAgICdib2FyZHMuY3JlYXRlQm9hcmQnKGJvYXJkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0XCIpXHJcbiAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYm9hcmQpXHJcbiAgICAgICAgICAgIHJldHVybiBCb2FyZHMuaW5zZXJ0KGJvYXJkKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhyb3cgTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZHMuZ2V0Qm9hcmQnIChpZEJvYXJkKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkO1xyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcImJvYXJkSWRcIjogaWRCb2FyZH0pLmNvdW50KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY291bnREb2MpXHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBpZEJvYXJkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoYm9hcmQuYm9hcmRQcml2YWN5ID09IDEpe1xyXG4gICAgICAgICAgICAgIC8vICBpZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAgICAgLy8gICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgICAgICAgLy8gICAgICByZXR1cm4gYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IG9uIHRoaXMgYWxsb3cgdG8gc2VlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAgICAgLy8gICAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib2FyZFxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qJ2JvYXJkcy5nZXRCb2FyZEZyb21FeHQnIChpZEJvYXJkLHRva2VuKSB7XHJcbiAgICAgICAgbGV0IGRlY29kZWRUb2tlbiA9IFwieGRcIlxyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogaWRCb2FyZH0pLmNvdW50KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY291bnREb2MpXHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBpZEJvYXJkfSk7XHJcbiAgICAgICAgICAgIGlmKGJvYXJkLmJvYXJkUHJpdmFjeSA9PSAxKXtcclxuICAgICAgICAgICAgICAgIGlmKHRva2VuLnVzZXJJZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IG9uIHRoaXMgYWxsb3cgdG8gc2VlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJvYXJkO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LCovXHJcblxyXG4gICAgJ2JvYXJkcy5yZW1vdmVCb2FyZCcoYm9hcmRJZCkge1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb3VudERvYylcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgYm9hcmQgPSBCb2FyZHMuZmluZE9uZSh7XCJib2FyZElkXCI6IGJvYXJkSWR9KTtcclxuICAgICAgICAgICAgLy9pZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCb2FyZHMucmVtb3ZlKGJvYXJkSWQpO1xyXG4gICAgICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGFsbG93IHRvIGRlbGV0ZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmRzLmVkaXRCb2FyZCcgKG5ld0JvYXJkKSB7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiYm9hcmRJZFwiOiBuZXdCb2FyZC5ib2FyZElkfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJblwiKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuZXdCb2FyZC5ib2FyZExpc3RbMF0ubGlzdENhcmRbMF0pXHJcbiAgICAgICAgICAgIEJvYXJkcy51cGRhdGUoe2JvYXJkSWQ6IG5ld0JvYXJkLmJvYXJkSWR9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRUaXRsZTogbmV3Qm9hcmQuYm9hcmRUaXRsZSxcclxuICAgICAgICAgICAgICAgICAgICBib2FyZFByaXZhY3k6IG5ld0JvYXJkLnByaXZhY3ksXHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRVc2VyczogbmV3Qm9hcmQuYm9hcmRVc2Vyc1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgLypuZXdCb2FyZC5ib2FyZExpc3QuZm9yRWFjaCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIEJvYXJkcy51cGRhdGUoe2JvYXJkSWQ6IG5ld0JvYXJkLmJvYXJkSWQsICdib2FyZExpc3QubGlzdElkJzogbGlzdC5saXN0SWR9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9hcmRMaXN0Lmxpc3QubGlzdENhcmQuJFtdXCI6IGxpc3QubGlzdENhcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pKi9cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLypuZXdCb2FyZC5ib2FyZExpc3QuZm9yRWFjaCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgQm9hcmRzLnVwZGF0ZSh7Ym9hcmRJZDogbmV3Qm9hcmQuYm9hcmRJZCwgXCJib2FyZExpc3QubGlzdElkXCI6IGxpc3QubGlzdElkfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRUaXRsZTogbmV3Qm9hcmQuYm9hcmRUaXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRQcml2YWN5OiBuZXdCb2FyZC5wcml2YWN5LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pKi9cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZC5nZXRBbGxCb2FyZHMnICgpe1xyXG4gICAgICAgIHJldHVybiBCb2FyZHMuZmluZCgpLmZldGNoKCk7XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZC5nZXRVc2VyQWxsQm9hcmRzJyAodXNlcklkKXtcclxuICAgICAgICBsZXQgYWxsQm9hcmRzID0gQm9hcmRzLmZpbmQoKS5mZXRjaCgpXHJcbiAgICAgICAgbGV0IHVzZXJCb2FyZCA9IFtdXHJcbiAgICAgICAgYWxsQm9hcmRzLm1hcCgoYm9hcmQpID0+IHtcclxuICAgICAgICAgICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKHVzZXJJZCkpe1xyXG4gICAgICAgICAgICAgICAgdXNlckJvYXJkLnB1c2goYm9hcmQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsQm9hcmRzXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmQuZ2V0VGVhbScgKGJvYXJkSWQpe1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgLy8gIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZC5ib2FyZFRlYW1zO1xyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYWxsb3cgdG8gZGVsZXRlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ2JvYXJkLmdldENhcmRzJyAoYm9hcmRJZCkge1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgLy8gIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgIGxldCBjYXJkcyA9IFtdXHJcbiAgICAgICAgICAgIGJvYXJkLmJvYXJkTGlzdC5tYXAoKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0Fubm90YXRvclxyXG4gICAgICAgICAgICAgICAgbGV0IHRoZUxpc3QgPSBNZXRlb3IuY2FsbCgnZ2V0TGlzdCcsbGlzdC5faWQpXHJcbiAgICAgICAgICAgICAgICB0aGVMaXN0Lmxpc3RDYXJkLm1hcCgoY2FyZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmRzLnB1c2goY2FyZClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY2FyZHNcclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGFsbG93IHRvIGRlbGV0ZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmRzLmdldFRhZ3MnIChib2FyZElkKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkXHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogYm9hcmRJZH0pO1xyXG4gICAgICAgICAgICAvL2lmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQuYm9hcmRUYWdzXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkcy5nZXRMaXN0cycgKGJvYXJkSWQpIHtcclxuICAgICAgICBsZXQgYm9hcmRcclxuICAgICAgICBsZXQgbGlzdHMgPSBbXVxyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcIl9pZFwiOiBib2FyZElkfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgYm9hcmQgPSBCb2FyZHMuZmluZE9uZSh7XCJib2FyZElkXCI6IGJvYXJkSWR9KTtcclxuICAgICAgICAgICAgLy9pZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAvLyAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgYm9hcmQuYm9hcmRMaXN0Lm1hcCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRoZUxpc3QgPSBNZXRlb3IuY2FsbCgnbGlzdC5nZXRMaXN0JyxsaXN0Ll9pZClcclxuICAgICAgICAgICAgICAgIGxpc3RzLnB1c2godGhlTGlzdClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3RzXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAnYm9hcmQuYXJjaGl2ZUxpc3QnIChib2FyZElkLGxpc3RJZCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkLmFyY2hpdmVDYXJkJyAoYm9hcmRJZCwgY2FyZElkKSB7XHJcblxyXG4gICAgfVxyXG5cclxufSlcclxuIiwiaW1wb3J0IHtMaXN0c30gZnJvbSBcIi4uL21vZGVscy9MaXN0XCI7XHJcbmltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xyXG5pbXBvcnQgeyBSYW5kb20gfSBmcm9tICdtZXRlb3IvcmFuZG9tJztcclxuaW1wb3J0IHsgSnNvblJvdXRlcyB9IGZyb20gJ21ldGVvci9zaW1wbGU6anNvbi1yb3V0ZXMnO1xyXG5cclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgICdsaXN0LmNyZWF0ZUxpc3QnKGxpc3ROYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIExpc3RzLmluc2VydCh7bGlzdFRpdGxlOiBsaXN0TmFtZX0pXHJcbiAgICB9LFxyXG5cclxuICAgICdsaXN0LmdldExpc3QnIChpZExpc3QpIHtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBMaXN0cy5maW5kKHtcIl9pZFwiOiBpZExpc3R9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IExpc3QuZmluZE9uZSh7XCJfaWRcIjogaWRMaXN0fSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnTGlzdCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgJ2xpc3QuZGVsZXRlTGlzdCcoaWRCb2FyZCwgaWRMaXN0KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnbGlzdC5lZGl0TGlzdCcgKGxpc3QpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgICdsaXN0LmdldEFsbExpc3QnICgpe1xyXG5cclxuICAgIH1cclxufSlcclxuXHJcbi8vIGNvZGUgdG8gcnVuIG9uIHNlcnZlciBhdCBzdGFydHVwXHJcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcclxuICAgIGlmKHJlcS5xdWVyeS5lcnJvcikge1xyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgICAgICAgICAgY29kZTogNDAxLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IFwiRVJST1JcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk7XHJcbn0pO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9zaWduVXAvJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcclxuICAgIGNvbnNvbGUubG9nKHJlcSlcclxuICAgIE1ldGVvci51c2Vycy5pbnNlcnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBmaXJzdG5hbWU6IHJlcS5ib2R5LnN0YXRlLmZpcnN0bmFtZSxcclxuICAgICAgICBsYXN0bmFtZTogcmVxLmJvZHkuc3RhdGUubGFzdG5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnN0YXRlLnBhc3N3b3JkLFxyXG4gICAgICAgIGVtYWlsOiByZXEuYm9keS5zdGF0ZS5lbWFpbFxyXG4gICAgfSlcclxuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHJlc3VsdDogTWV0ZW9yLnVzZXJzLmZpbmQoKS5mZXRjaCgpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuIiwiaW1wb3J0IHtNZXRlb3J9IGZyb20gXCJtZXRlb3IvbWV0ZW9yXCI7XHJcbmltcG9ydCB7VGVhbX0gIGZyb20gXCIuLi9tb2RlbHMvVGVhbVwiO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgXCJ0ZWFtcy5jcmVhdGVUZWFtXCIodGVhbSl7XHJcbiAgICAgICAgaWYoIXRoaXMudXNlcklkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignTm90LUF1dGhvcml6ZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9sZXQgdGVhbURlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24udGVhbURlc2NyaXB0aW9uID8gZGVzY3JpcHRpb24udGVhbURlc2NyaXB0aW9uIDogXCJcIlxyXG4gICAgICAgIC8vbGV0IG93bmVyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodGhpcy51c2VySWQpXHJcbiAgICAgICAgcmV0dXJuIFRlYW0uaW5zZXJ0KHtcclxuICAgICAgICAgICAgdGVhbU5hbWU6IHRlYW0udGVhbVRpdGxlLFxyXG4gICAgICAgICAgICB0ZWFtRGVzY3JpcHRpb246IHRlYW0udGVhbURlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICB0ZWFtT3duZXIgOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgICAgdGVhbU1lbWJlcnMgOiB0ZWFtLnRlYW1Vc2Vyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgJ2dldFRlYW1zJygpe1xyXG4gICAgICAgIC8vY2hlY2sodGVhbUlkLFN0cmluZylcclxuICAgICAgIGlmKCF0aGlzLnVzZXJJZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3Jpc2VkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVhbXMgPSBUZWFtLmZpbmQoKTtcclxuXHJcbiAgICAgICAgaWYodGVhbXMpXHJcbiAgICAgICAgICAgIHJldHVybiB0ZWFtc1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnVGVhbSBub3QgZm91bmQnKVxyXG4gICAgfVxyXG5cclxufSk7IiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XHJcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goJ3VzZXJzJywgZnVuY3Rpb24oKXtcclxuICAgIGlmKHRoaXMudXNlcklkKSByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoe19pZDogeyRuZTogdGhpcy51c2VySWR9fSwge2ZpZWxkczogeyBwcm9maWxlOiAxIH19KTtcclxufSk7XHJcblxyXG5NZXRlb3IucHVibGlzaCgndXNlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBNZXRlb3IudXNlcnMuZmluZCh7X2lkOiB0aGlzLnVzZXJJZH0pO1xyXG59KTtcclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgIFwidXNlcnMuc2lnblVwXCIoe2xhc3RuYW1lLCBmaXJzdG5hbWUsIGVtYWlsLCBwYXNzd29yZH0pe1xyXG4gICAgICAgIGlmKHBhc3N3b3JkLmxlbmd0aCA8IDYpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJUb28gc2hvcnQgcGFzc3dvcmQsIGF0IGxlYXN0IDYgY2hhcmFjdGVycy5cIilcclxuICAgICAgICBlbHNlIGlmKCFlbWFpbCB8fCAhbGFzdG5hbWUgfHwgIWZpcnN0bmFtZSkgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIlNvbWUgZmllbGQgYXJlIGVtcHR5LlwiKVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcclxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0bmFtZTogbGFzdG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RuYW1lOiBmaXJzdG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZE1haWxzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBBY2NvdW50cy5jcmVhdGVVc2VyKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInVzZXJzLnVwZGF0ZVByb2ZpbGVcIihlbWFpbCwgbGFzdG5hbWUsIGZpcnN0bmFtZSl7XHJcbiAgICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZShNZXRlb3IudXNlcklkKCksIHsgJHNldDoge1xyXG4gICAgICAgICAgICBlbWFpbHM6IFt7YWRkcmVzczogZW1haWwsIHZlcmlmaWVkOiB0cnVlfV0sXHJcbiAgICAgICAgICAgICdwcm9maWxlLmxhc3RuYW1lJzogbGFzdG5hbWUsXHJcbiAgICAgICAgICAgICdwcm9maWxlLmZpcnN0bmFtZSc6IGZpcnN0bmFtZSxcclxuICAgICAgICAgICAgJ3Byb2ZpbGUuZW1haWwnOiBlbWFpbFxyXG4gICAgICAgIH19KTtcclxuICAgICAgICByZXR1cm4gTWV0ZW9yLnVzZXIoKTtcclxuICAgIH0sXHJcbiAgICAndXNlcnMuY2hhbmdlUGFzc3dvcmQnKGFjdHVhbFBhc3N3b3JkLCBuZXdQYXNzd29yZCl7XHJcbiAgICAgICAgbGV0IGNoZWNrUGFzc3dvcmQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZChNZXRlb3IudXNlcigpLCBhY3R1YWxQYXNzd29yZCk7XHJcbiAgICAgICAgaWYoY2hlY2tQYXNzd29yZC5lcnJvcikgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihjaGVja1Bhc3N3b3JkLmVycm9yLnJlYXNvbilcclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBBY2NvdW50cy5zZXRQYXNzd29yZChNZXRlb3IudXNlcklkKCksIG5ld1Bhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAndXNlcnMuc2V0RW5hYmxlZE1haWxzJyhlbmFibGVkTWFpbHMpe1xyXG4gICAgICAgIE1ldGVvci51c2Vycy51cGRhdGUoTWV0ZW9yLnVzZXJJZCgpLCB7ICRzZXQ6IHtcclxuICAgICAgICAgICAgJ3Byb2ZpbGUuZW5hYmxlZE1haWxzJzogZW5hYmxlZE1haWxzXHJcbiAgICAgICAgfX0pO1xyXG4gICAgICAgIHJldHVybiBNZXRlb3IudXNlcigpO1xyXG4gICAgfSxcclxuICAgICd1c2Vycy5yZW1vdmUnKCl7XHJcbiAgICAgICAgTWV0ZW9yLnVzZXJzLnJlbW92ZShNZXRlb3IudXNlcklkKCkpO1xyXG4gICAgfSxcclxuICAgIFwidXNlcnMuZ2V0VXNlclwiKGVtYWlsKXtcclxuICAgICAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1wicHJvZmlsZS5lbWFpbFwiOiBlbWFpbH0pO1xyXG4gICAgfSxcclxuICAgIFwidXNlcnMuZ2V0VXNlcnNcIigpe1xyXG4gICAgICAgIHJldHVybiBNZXRlb3IudXNlcnMuZmluZCgpO1xyXG4gICAgfVxyXG59KSIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcclxuaW1wb3J0IHsgVXNlclNjaGVtYSB9IGZyb20gJy4vVXNlcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJvYXJkVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gIHVzZXI6IHtcclxuICAgICAgdHlwZTogVXNlclNjaGVtYSxcclxuICAgICAgbGFiZWw6IFwiVXNlclwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgdXNlclJvbGU6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBsYWJlbDogXCJSb2xlXCIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfVxyXG59KTsiLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbydcclxuXHJcbmV4cG9ydCBjb25zdCBCb2FyZHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignYm9hcmRzJylcclxuXHJcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcclxuaW1wb3J0IHtMaXN0U2NoZW1hfSBmcm9tIFwiLi9MaXN0XCI7XHJcbmltcG9ydCB7IEJvYXJkVXNlclNjaGVtYSB9IGZyb20gJy4vQm9hcmRVc2VyJztcclxuXHJcbmV4cG9ydCBjb25zdCBCb2FyZFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gIGJvYXJkVGl0bGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJUaXRsZVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgYm9hcmREZXNjcmlwdGlvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGxhYmVsOiBcIkRlc2NyaXB0aW9uXCIsXHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gIH0sXHJcbiAgYm9hcmRVc2Vyczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiVXNlcnNcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gICdib2FyZFVzZXJzLiQnOiBCb2FyZFVzZXJTY2hlbWEsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgYm9hcmRQcml2YWN5OiB7XHJcbiAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxyXG4gICAgICBsYWJlbDogXCJQcml2YWN5XCIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfSxcclxuICBib2FyZExpc3RzOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJMaXN0c1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnYm9hcmRMaXN0cy4kJzogTGlzdFNjaGVtYSwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuXHJcbiAgICBib2FyZFRhZ3M6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIlRhZ3NcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2JvYXJkVGFncy4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGJvYXJkVGVhbXM6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIlRlYW1zXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdib2FyZFRlYW1zLiQnOiBPYmplY3QsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgYm9hcmRDcmVhdGVkQXQ6e1xyXG4gICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBEYXRlKCk7fVxyXG4gIH1cclxufSk7XHJcblxyXG5Cb2FyZHMuYXR0YWNoU2NoZW1hKEJvYXJkU2NoZW1hKTsiLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcblxyXG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbydcclxuXHJcbmV4cG9ydCBjb25zdCBDYXJkcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdjYXJkcycpXHJcblxyXG5leHBvcnQgY29uc3QgQ2FyZFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gIGNhcmRJZDoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGxhYmVsOiBcIklkXCIsXHJcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcclxuICB9LFxyXG4gIGNhcmRUaXRsZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGxhYmVsOiBcIlRpdGxlXCIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfSxcclxuICBjYXJkRGVzY3JpcHRpb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJEZXNjcmlwdGlvblwiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICBjYXJkVGFnOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJUYWdzXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdjYXJkVGFnLiQnOiBPYmplY3QsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgY2FyZENvbW1lbnQ6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIkNvbW1lbnRzXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdjYXJkQ29tbWVudC4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGNhcmRBdHRhY2htZW50OiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJBdHRhY2htZW50c1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZEF0dGFjaG1lbnQuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBjYXJkQ2hlY2tsaXN0OiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJDaGVja0xpc3RzXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdjYXJkQ2hlY2tsaXN0LiQnOiBPYmplY3QsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgbGlzdENyZWF0ZWRBdDp7XHJcbiAgICB0eXBlOiBEYXRlLFxyXG4gICAgYXV0b1ZhbHVlOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRGF0ZSgpO31cclxufVxyXG59KTtcclxuXHJcbkNhcmRzLmF0dGFjaFNjaGVtYShDYXJkU2NoZW1hKTsiLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcblxyXG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbydcclxuaW1wb3J0IHtDYXJkU2NoZW1hfSBmcm9tIFwiLi9DYXJkXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTGlzdHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignbGlzdHMnKVxyXG5cclxuZXhwb3J0IGNvbnN0IExpc3RTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBsaXN0SWQ6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGxhYmVsOiBcIklkXCIsXHJcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXHJcbiAgfSxcclxuICBsaXN0VGl0bGU6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGxhYmVsOiBcIlRpdGxlXCIsXHJcbiAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgbGlzdENhcmQ6e1xyXG4gICAgdHlwZTogQXJyYXksXHJcbiAgICBsYWJlbDogXCJDYXJkc1wiLFxyXG4gICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2xpc3RDYXJkLiQnOiBDYXJkU2NoZW1hLCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGxpc3RDcmVhdGVkQXQ6e1xyXG4gICAgdHlwZTogRGF0ZSxcclxuICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IERhdGUoKTt9XHJcbn1cclxufSk7XHJcblxyXG5MaXN0cy5hdHRhY2hTY2hlbWEoTGlzdFNjaGVtYSk7IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcclxuaW1wb3J0IHtVc2VyU2NoZW1hfSBmcm9tICcuL1VzZXJzLmpzJ1xyXG5pbXBvcnQge1RlYW1NZW1iZXJzfSBmcm9tICcuL1RlYW1NZW1iZXJzLmpzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IFRlYW0gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbigndGVhbXMnKTtcclxuXHJcbmNvbnN0IFRlYW1TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICAgIHRlYW1OYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGxhYmVsOiBcIk5hbWVcIixcclxuICAgIH0sXHJcbiAgICB0ZWFtRGVzY3JpcHRpb246IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIixcclxuICAgICAgICBkZWZhdWx0VmFsdWU6IFwiXCIgXHJcbiAgICB9LFxyXG4gICAgdGVhbU93bmVyIDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBsYWJlbDogXCJPd25lclwiXHJcbiAgICB9LFxyXG4gICAgdGVhbU1lbWJlcnM6e1xyXG4gICAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICAgIGxhYmVsIDogXCJNZW1iZXJzXCIsXHJcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gICAgfSxcclxuICAgICd0ZWFtTWVtYmVycy4kJzogVGVhbU1lbWJlcnNcclxufSk7XHJcblxyXG5cclxuVGVhbS5hdHRhY2hTY2hlbWEoVGVhbVNjaGVtYSk7IiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5pbXBvcnQgeyBVc2VyU2NoZW1hIH0gZnJvbSAnLi9Vc2Vycyc7XHJcblxyXG5leHBvcnQgY29uc3QgVGVhbU1lbWJlcnMgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICAgIHVzZXI6IHtcclxuICAgICAgdHlwZTogVXNlclNjaGVtYSxcclxuICAgICAgbGFiZWw6IFwiVXNlclwiLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgdXNlclJvbGU6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBsYWJlbDogXCJSb2xlXCIsXHJcbiAgICB9XHJcbiAgICBcclxufSkiLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcblxyXG5jb25zdCBVc2VyUHJvZmlsZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgbGFzdG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBlbWFpbCA6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBlbm5hYmxlZE1haWxzOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBVc2VyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgICB1c2VybmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICAvLyBGb3IgYWNjb3VudHMtcGFzc3dvcmQsIGVpdGhlciBlbWFpbHMgb3IgdXNlcm5hbWUgaXMgcmVxdWlyZWQsIGJ1dCBub3QgYm90aC4gSXQgaXMgT0sgdG8gbWFrZSB0aGlzXHJcbiAgICAgICAgLy8gb3B0aW9uYWwgaGVyZSBiZWNhdXNlIHRoZSBhY2NvdW50cy1wYXNzd29yZCBwYWNrYWdlIGRvZXMgaXRzIG93biB2YWxpZGF0aW9uLlxyXG4gICAgICAgIC8vIFRoaXJkLXBhcnR5IGxvZ2luIHBhY2thZ2VzIG1heSBub3QgcmVxdWlyZSBlaXRoZXIuIEFkanVzdCB0aGlzIHNjaGVtYSBhcyBuZWNlc3NhcnkgZm9yIHlvdXIgdXNhZ2UuXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBlbWFpbHM6IHtcclxuICAgICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgICAvLyBGb3IgYWNjb3VudHMtcGFzc3dvcmQsIGVpdGhlciBlbWFpbHMgb3IgdXNlcm5hbWUgaXMgcmVxdWlyZWQsIGJ1dCBub3QgYm90aC4gSXQgaXMgT0sgdG8gbWFrZSB0aGlzXHJcbiAgICAgICAgLy8gb3B0aW9uYWwgaGVyZSBiZWNhdXNlIHRoZSBhY2NvdW50cy1wYXNzd29yZCBwYWNrYWdlIGRvZXMgaXRzIG93biB2YWxpZGF0aW9uLlxyXG4gICAgICAgIC8vIFRoaXJkLXBhcnR5IGxvZ2luIHBhY2thZ2VzIG1heSBub3QgcmVxdWlyZSBlaXRoZXIuIEFkanVzdCB0aGlzIHNjaGVtYSBhcyBuZWNlc3NhcnkgZm9yIHlvdXIgdXNhZ2UuXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBcImVtYWlscy4kXCI6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3RcclxuICAgIH0sXHJcbiAgICBcImVtYWlscy4kLmFkZHJlc3NcIjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXHJcbiAgICB9LFxyXG4gICAgXCJlbWFpbHMuJC52ZXJpZmllZFwiOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhblxyXG4gICAgfSxcclxuICAgIC8vIFVzZSB0aGlzIHJlZ2lzdGVyZWRfZW1haWxzIGZpZWxkIGlmIHlvdSBhcmUgdXNpbmcgc3BsZW5kaWRvOm1ldGVvci1hY2NvdW50cy1lbWFpbHMtZmllbGQgLyBzcGxlbmRpZG86bWV0ZW9yLWFjY291bnRzLW1lbGRcclxuICAgIHJlZ2lzdGVyZWRfZW1haWxzOiB7XHJcbiAgICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICAncmVnaXN0ZXJlZF9lbWFpbHMuJCc6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3QsXHJcbiAgICAgICAgYmxhY2tib3g6IHRydWVcclxuICAgIH0sXHJcbiAgICBjcmVhdGVkQXQ6IHtcclxuICAgICAgICB0eXBlOiBEYXRlXHJcbiAgICB9LFxyXG4gICAgcHJvZmlsZToge1xyXG4gICAgICAgIHR5cGU6IFVzZXJQcm9maWxlU2NoZW1hLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLy8gTWFrZSBzdXJlIHRoaXMgc2VydmljZXMgZmllbGQgaXMgaW4geW91ciBzY2hlbWEgaWYgeW91J3JlIHVzaW5nIGFueSBvZiB0aGUgYWNjb3VudHMgcGFja2FnZXNcclxuICAgIHNlcnZpY2VzOiB7XHJcbiAgICAgICAgdHlwZTogT2JqZWN0LFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gICAgICAgIGJsYWNrYm94OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLy8gQWRkIGByb2xlc2AgdG8geW91ciBzY2hlbWEgaWYgeW91IHVzZSB0aGUgbWV0ZW9yLXJvbGVzIHBhY2thZ2UuXHJcbiAgICAvLyBPcHRpb24gMTogT2JqZWN0IHR5cGVcclxuICAgIC8vIElmIHlvdSBzcGVjaWZ5IHRoYXQgdHlwZSBhcyBPYmplY3QsIHlvdSBtdXN0IGFsc28gc3BlY2lmeSB0aGVcclxuICAgIC8vIGBSb2xlcy5HTE9CQUxfR1JPVVBgIGdyb3VwIHdoZW5ldmVyIHlvdSBhZGQgYSB1c2VyIHRvIGEgcm9sZS5cclxuICAgIC8vIEV4YW1wbGU6XHJcbiAgICAvLyBSb2xlcy5hZGRVc2Vyc1RvUm9sZXModXNlcklkLCBbXCJhZG1pblwiXSwgUm9sZXMuR0xPQkFMX0dST1VQKTtcclxuICAgIC8vIFlvdSBjYW4ndCBtaXggYW5kIG1hdGNoIGFkZGluZyB3aXRoIGFuZCB3aXRob3V0IGEgZ3JvdXAgc2luY2VcclxuICAgIC8vIHlvdSB3aWxsIGZhaWwgdmFsaWRhdGlvbiBpbiBzb21lIGNhc2VzLlxyXG4gICAgcm9sZXM6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3QsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgICAgICAgYmxhY2tib3g6IHRydWVcclxuICAgIH0sXHJcbiAgICAvLyBPcHRpb24gMjogW1N0cmluZ10gdHlwZVxyXG4gICAgLy8gSWYgeW91IGFyZSBzdXJlIHlvdSB3aWxsIG5ldmVyIG5lZWQgdG8gdXNlIHJvbGUgZ3JvdXBzLCB0aGVuXHJcbiAgICAvLyB5b3UgY2FuIHNwZWNpZnkgW1N0cmluZ10gYXMgdGhlIHR5cGVcclxuICAgIHJvbGVzOiB7XHJcbiAgICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICAncm9sZXMuJCc6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgIH0sXHJcbiAgICAvLyBJbiBvcmRlciB0byBhdm9pZCBhbiAnRXhjZXB0aW9uIGluIHNldEludGVydmFsIGNhbGxiYWNrJyBmcm9tIE1ldGVvclxyXG4gICAgaGVhcnRiZWF0OiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfVxyXG59KTtcclxuXHJcbk1ldGVvci51c2Vycy5hdHRhY2hTY2hlbWEoVXNlclNjaGVtYSk7IiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XHJcblxyXG5pbXBvcnQgJy4vYXBpL3VzZXJzLmpzJztcclxuaW1wb3J0ICcuL2FwaS9ib2FyZHMnO1xyXG5pbXBvcnQgJy4vYXBpL2xpc3RzJztcclxuaW1wb3J0ICcuL2FwaS90ZWFtcycgXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XHJcblxyXG59KTsiXX0=
