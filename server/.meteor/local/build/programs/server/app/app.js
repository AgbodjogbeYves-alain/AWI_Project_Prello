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
  "teams.createTeam"({
    teamName,
    description
  }) {
    if (!this.userId) {
      throw new Meteor.Error('Not-Authorized');
    }

    let teamDescription = description ? description : ""; //let owner = Meteor.users.findOne(this.userId)

    /*console.log("*********")
    console.log(teamName)
    console.log("*********")*/

    return Team.insert({
      teamName: teamName,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvYXBpL1V0aWxzL2JvYXJkVXRpbHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9ib2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9saXN0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvYXBpL3RlYW1zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9hcGkvdXNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Cb2FyZFVzZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Cb2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9DYXJkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvTGlzdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL1RlYW0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Vc2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJib2FyZFV0aWxzIiwiY2hlY2tJbkJvYXJkVXNlciIsImlkVXNlciIsImJvYXJkIiwiaXNJbiIsImJvYXJkVXNlcnMiLCJtYXAiLCJ1c2VyIiwiX2lkIiwiQm9hcmRzIiwibGluayIsInYiLCJNZXRlb3IiLCJydXNGdW5jdGlvbiIsImRlZmF1bHQiLCJwdWJsaXNoIiwiZmluZCIsIm1ldGhvZHMiLCJjb25zb2xlIiwibG9nIiwidXNlcklkIiwiaW5zZXJ0IiwiRXJyb3IiLCJpZEJvYXJkIiwiY291bnREb2MiLCJjb3VudCIsImZpbmRPbmUiLCJib2FyZElkIiwicmVtb3ZlIiwibmV3Qm9hcmQiLCJib2FyZExpc3QiLCJsaXN0Q2FyZCIsInVwZGF0ZSIsIiRzZXQiLCJib2FyZFRpdGxlIiwiYm9hcmRQcml2YWN5IiwicHJpdmFjeSIsImZldGNoIiwiYWxsQm9hcmRzIiwidXNlckJvYXJkIiwicHVzaCIsImJvYXJkVGVhbXMiLCJjYXJkcyIsImxpc3QiLCJ0aGVMaXN0IiwiY2FsbCIsImNhcmQiLCJib2FyZFRhZ3MiLCJsaXN0cyIsImxpc3RJZCIsImNhcmRJZCIsIkxpc3RzIiwiUmFuZG9tIiwiSnNvblJvdXRlcyIsImxpc3ROYW1lIiwibGlzdFRpdGxlIiwiaWRMaXN0IiwiTGlzdCIsIk1pZGRsZXdhcmUiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJlcnJvciIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInJlc3VsdCIsImFkZCIsInVzZXJzIiwidXNlcm5hbWUiLCJib2R5Iiwic3RhdGUiLCJmaXJzdG5hbWUiLCJsYXN0bmFtZSIsInBhc3N3b3JkIiwiZW1haWwiLCJUZWFtIiwidGVhbU5hbWUiLCJkZXNjcmlwdGlvbiIsInRlYW1EZXNjcmlwdGlvbiIsInRlYW1Pd25lciIsInRlYW1zIiwiQWNjb3VudHMiLCIkbmUiLCJmaWVsZHMiLCJwcm9maWxlIiwibGVuZ3RoIiwib3B0aW9ucyIsImVuYWJsZWRNYWlscyIsImNyZWF0ZVVzZXIiLCJlbWFpbHMiLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJhY3R1YWxQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwiY2hlY2tQYXNzd29yZCIsIl9jaGVja1Bhc3N3b3JkIiwicmVhc29uIiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJCb2FyZFVzZXJTY2hlbWEiLCJTaW1wbGVTY2hlbWEiLCJVc2VyU2NoZW1hIiwidHlwZSIsImxhYmVsIiwicmVxdWlyZWQiLCJ1c2VyUm9sZSIsIk51bWJlciIsIkJvYXJkU2NoZW1hIiwiTW9uZ28iLCJMaXN0U2NoZW1hIiwiQ29sbGVjdGlvbiIsIlN0cmluZyIsImJvYXJkRGVzY3JpcHRpb24iLCJBcnJheSIsIkludGVnZXIiLCJib2FyZExpc3RzIiwiZGVmYXVsdFZhbHVlIiwiT2JqZWN0IiwiYm9hcmRDcmVhdGVkQXQiLCJEYXRlIiwiYXV0b1ZhbHVlIiwiYXR0YWNoU2NoZW1hIiwiQ2FyZHMiLCJDYXJkU2NoZW1hIiwicmVnRXgiLCJSZWdFeCIsIklkIiwiY2FyZFRpdGxlIiwiY2FyZERlc2NyaXB0aW9uIiwiY2FyZFRhZyIsImNhcmRDb21tZW50IiwiY2FyZEF0dGFjaG1lbnQiLCJjYXJkQ2hlY2tsaXN0IiwibGlzdENyZWF0ZWRBdCIsIlRlYW1TY2hlbWEiLCJvcHRpb25hbCIsInRlYW1NZW1iZXJzIiwiVXNlclByb2ZpbGVTY2hlbWEiLCJlbm5hYmxlZE1haWxzIiwiQm9vbGVhbiIsIkVtYWlsIiwicmVnaXN0ZXJlZF9lbWFpbHMiLCJibGFja2JveCIsImNyZWF0ZWRBdCIsInNlcnZpY2VzIiwicm9sZXMiLCJoZWFydGJlYXQiLCJzdGFydHVwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxZQUFVLEVBQUMsTUFBSUE7QUFBaEIsQ0FBZDs7QUFBTyxNQUFNQSxVQUFOLENBQWlCO0FBRXBCLFNBQU9DLGdCQUFQLENBQXdCQyxNQUF4QixFQUFnQ0MsS0FBaEMsRUFBc0M7QUFDbEMsUUFBSUMsSUFBSSxHQUFHLEtBQVg7QUFDQUQsU0FBSyxDQUFDRSxVQUFOLENBQWlCQyxHQUFqQixDQUFzQkMsSUFBRCxJQUFVO0FBQzNCLFVBQUdBLElBQUksQ0FBQ0MsR0FBTCxJQUFZTixNQUFmLEVBQXNCO0FBQ2xCRSxZQUFJLEdBQUcsSUFBUDtBQUNIO0FBQ0osS0FKRDtBQU1BLFdBQU9BLElBQVA7QUFDSDs7QUFYbUIsQzs7Ozs7Ozs7Ozs7QUNBeEIsSUFBSUssTUFBSjtBQUFXWCxNQUFNLENBQUNZLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDRCxRQUFNLENBQUNFLENBQUQsRUFBRztBQUFDRixVQUFNLEdBQUNFLENBQVA7QUFBUzs7QUFBcEIsQ0FBL0IsRUFBcUQsQ0FBckQ7QUFBd0QsSUFBSUMsTUFBSjtBQUFXZCxNQUFNLENBQUNZLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNFLFFBQU0sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFVBQU0sR0FBQ0QsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJWCxV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QUFFLElBRko7QUFHTk8sWUFBUSxFQUFFO0FBSEosR0ExQzZCO0FBK0N2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FHLE9BQUssRUFBRTtBQUNIM0MsUUFBSSxFQUFFZSxNQURIO0FBRUhrQixZQUFRLEVBQUUsSUFGUDtBQUdITyxZQUFRLEVBQUU7QUFIUCxHQXZEZ0M7QUE0RHZDO0FBQ0E7QUFDQTtBQUNBRyxPQUFLLEVBQUU7QUFDSDNDLFFBQUksRUFBRVcsS0FESDtBQUVIc0IsWUFBUSxFQUFFO0FBRlAsR0EvRGdDO0FBbUV2QyxhQUFXO0FBQ1BqQyxRQUFJLEVBQUVTO0FBREMsR0FuRTRCO0FBc0V2QztBQUNBbUMsV0FBUyxFQUFFO0FBQ1A1QyxRQUFJLEVBQUVpQixJQURDO0FBRVBnQixZQUFRLEVBQUU7QUFGSDtBQXZFNEIsQ0FBakIsQ0FBbkI7QUE2RVA5SCxNQUFNLENBQUMwRCxLQUFQLENBQWFzRCxZQUFiLENBQTBCcEIsVUFBMUIsRTs7Ozs7Ozs7Ozs7QUNsR0EsSUFBSTVGLE1BQUo7QUFBV2QsTUFBTSxDQUFDWSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRSxRQUFNLENBQUNELENBQUQsRUFBRztBQUFDQyxVQUFNLEdBQUNELENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcURiLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGdCQUFaO0FBQThCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxjQUFaO0FBQTRCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxhQUFaO0FBQTJCWixNQUFNLENBQUNZLElBQVAsQ0FBWSxhQUFaO0FBT3JKRSxNQUFNLENBQUMwSSxPQUFQLENBQWUsTUFBTSxDQUVwQixDQUZELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBib2FyZFV0aWxzIHtcclxuXHJcbiAgICBzdGF0aWMgY2hlY2tJbkJvYXJkVXNlcihpZFVzZXIsIGJvYXJkKXtcclxuICAgICAgICBsZXQgaXNJbiA9IGZhbHNlXHJcbiAgICAgICAgYm9hcmQuYm9hcmRVc2Vycy5tYXAoKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgaWYodXNlci5faWQgPT0gaWRVc2VyKXtcclxuICAgICAgICAgICAgICAgIGlzSW4gPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gaXNJblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtCb2FyZHN9IGZyb20gXCIuLi9tb2RlbHMvQm9hcmRzXCI7XHJcbmltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xyXG5pbXBvcnQge2JvYXJkVXRpbHN9IGZyb20gXCIuL1V0aWxzL2JvYXJkVXRpbHNcIjtcclxuaW1wb3J0IHJ1c0Z1bmN0aW9uIGZyb20gJ3J1cy1kaWZmJ1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goJ2JvYXJkcycsIGZ1bmN0aW9uICgpIHtyZXR1cm4gQm9hcmRzLmZpbmQoKX0pO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG5cclxuICAgICdib2FyZHMuY3JlYXRlQm9hcmQnKGJvYXJkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0XCIpXHJcbiAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYm9hcmQpXHJcbiAgICAgICAgICAgIHJldHVybiBCb2FyZHMuaW5zZXJ0KGJvYXJkKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhyb3cgTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZHMuZ2V0Qm9hcmQnIChpZEJvYXJkKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkO1xyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcImJvYXJkSWRcIjogaWRCb2FyZH0pLmNvdW50KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY291bnREb2MpXHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBpZEJvYXJkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoYm9hcmQuYm9hcmRQcml2YWN5ID09IDEpe1xyXG4gICAgICAgICAgICAgIC8vICBpZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAgICAgLy8gICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgICAgICAgLy8gICAgICByZXR1cm4gYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IG9uIHRoaXMgYWxsb3cgdG8gc2VlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAgICAgLy8gICAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib2FyZFxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qJ2JvYXJkcy5nZXRCb2FyZEZyb21FeHQnIChpZEJvYXJkLHRva2VuKSB7XHJcbiAgICAgICAgbGV0IGRlY29kZWRUb2tlbiA9IFwieGRcIlxyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogaWRCb2FyZH0pLmNvdW50KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY291bnREb2MpXHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBpZEJvYXJkfSk7XHJcbiAgICAgICAgICAgIGlmKGJvYXJkLmJvYXJkUHJpdmFjeSA9PSAxKXtcclxuICAgICAgICAgICAgICAgIGlmKHRva2VuLnVzZXJJZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IG9uIHRoaXMgYWxsb3cgdG8gc2VlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJvYXJkO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LCovXHJcblxyXG4gICAgJ2JvYXJkcy5yZW1vdmVCb2FyZCcoYm9hcmRJZCkge1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb3VudERvYylcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgYm9hcmQgPSBCb2FyZHMuZmluZE9uZSh7XCJib2FyZElkXCI6IGJvYXJkSWR9KTtcclxuICAgICAgICAgICAgLy9pZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCb2FyZHMucmVtb3ZlKGJvYXJkSWQpO1xyXG4gICAgICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGFsbG93IHRvIGRlbGV0ZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmRzLmVkaXRCb2FyZCcgKG5ld0JvYXJkKSB7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiYm9hcmRJZFwiOiBuZXdCb2FyZC5ib2FyZElkfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJblwiKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuZXdCb2FyZC5ib2FyZExpc3RbMF0ubGlzdENhcmRbMF0pXHJcbiAgICAgICAgICAgIEJvYXJkcy51cGRhdGUoe2JvYXJkSWQ6IG5ld0JvYXJkLmJvYXJkSWR9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRUaXRsZTogbmV3Qm9hcmQuYm9hcmRUaXRsZSxcclxuICAgICAgICAgICAgICAgICAgICBib2FyZFByaXZhY3k6IG5ld0JvYXJkLnByaXZhY3ksXHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRVc2VyczogbmV3Qm9hcmQuYm9hcmRVc2Vyc1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgLypuZXdCb2FyZC5ib2FyZExpc3QuZm9yRWFjaCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIEJvYXJkcy51cGRhdGUoe2JvYXJkSWQ6IG5ld0JvYXJkLmJvYXJkSWQsICdib2FyZExpc3QubGlzdElkJzogbGlzdC5saXN0SWR9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9hcmRMaXN0Lmxpc3QubGlzdENhcmQuJFtdXCI6IGxpc3QubGlzdENhcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pKi9cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLypuZXdCb2FyZC5ib2FyZExpc3QuZm9yRWFjaCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgQm9hcmRzLnVwZGF0ZSh7Ym9hcmRJZDogbmV3Qm9hcmQuYm9hcmRJZCwgXCJib2FyZExpc3QubGlzdElkXCI6IGxpc3QubGlzdElkfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRUaXRsZTogbmV3Qm9hcmQuYm9hcmRUaXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRQcml2YWN5OiBuZXdCb2FyZC5wcml2YWN5LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pKi9cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZC5nZXRBbGxCb2FyZHMnICgpe1xyXG4gICAgICAgIHJldHVybiBCb2FyZHMuZmluZCgpLmZldGNoKCk7XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZC5nZXRVc2VyQWxsQm9hcmRzJyAodXNlcklkKXtcclxuICAgICAgICBsZXQgYWxsQm9hcmRzID0gQm9hcmRzLmZpbmQoKS5mZXRjaCgpXHJcbiAgICAgICAgbGV0IHVzZXJCb2FyZCA9IFtdXHJcbiAgICAgICAgYWxsQm9hcmRzLm1hcCgoYm9hcmQpID0+IHtcclxuICAgICAgICAgICAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKHVzZXJJZCkpe1xyXG4gICAgICAgICAgICAgICAgdXNlckJvYXJkLnB1c2goYm9hcmQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsQm9hcmRzXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmQuZ2V0VGVhbScgKGJvYXJkSWQpe1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgLy8gIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZC5ib2FyZFRlYW1zO1xyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYWxsb3cgdG8gZGVsZXRlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ2JvYXJkLmdldENhcmRzJyAoYm9hcmRJZCkge1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgLy8gIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgIGxldCBjYXJkcyA9IFtdXHJcbiAgICAgICAgICAgIGJvYXJkLmJvYXJkTGlzdC5tYXAoKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0Fubm90YXRvclxyXG4gICAgICAgICAgICAgICAgbGV0IHRoZUxpc3QgPSBNZXRlb3IuY2FsbCgnZ2V0TGlzdCcsbGlzdC5faWQpXHJcbiAgICAgICAgICAgICAgICB0aGVMaXN0Lmxpc3RDYXJkLm1hcCgoY2FyZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmRzLnB1c2goY2FyZClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY2FyZHNcclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGFsbG93IHRvIGRlbGV0ZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmRzLmdldFRhZ3MnIChib2FyZElkKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkXHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogYm9hcmRJZH0pO1xyXG4gICAgICAgICAgICAvL2lmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQuYm9hcmRUYWdzXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkcy5nZXRMaXN0cycgKGJvYXJkSWQpIHtcclxuICAgICAgICBsZXQgYm9hcmRcclxuICAgICAgICBsZXQgbGlzdHMgPSBbXVxyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcIl9pZFwiOiBib2FyZElkfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgYm9hcmQgPSBCb2FyZHMuZmluZE9uZSh7XCJib2FyZElkXCI6IGJvYXJkSWR9KTtcclxuICAgICAgICAgICAgLy9pZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAvLyAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgYm9hcmQuYm9hcmRMaXN0Lm1hcCgobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRoZUxpc3QgPSBNZXRlb3IuY2FsbCgnbGlzdC5nZXRMaXN0JyxsaXN0Ll9pZClcclxuICAgICAgICAgICAgICAgIGxpc3RzLnB1c2godGhlTGlzdClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3RzXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAnYm9hcmQuYXJjaGl2ZUxpc3QnIChib2FyZElkLGxpc3RJZCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkLmFyY2hpdmVDYXJkJyAoYm9hcmRJZCwgY2FyZElkKSB7XHJcblxyXG4gICAgfVxyXG5cclxufSlcclxuIiwiaW1wb3J0IHtMaXN0c30gZnJvbSBcIi4uL21vZGVscy9MaXN0XCI7XHJcbmltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xyXG5pbXBvcnQgeyBSYW5kb20gfSBmcm9tICdtZXRlb3IvcmFuZG9tJztcclxuaW1wb3J0IHsgSnNvblJvdXRlcyB9IGZyb20gJ21ldGVvci9zaW1wbGU6anNvbi1yb3V0ZXMnO1xyXG5cclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgICdsaXN0LmNyZWF0ZUxpc3QnKGxpc3ROYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIExpc3RzLmluc2VydCh7bGlzdFRpdGxlOiBsaXN0TmFtZX0pXHJcbiAgICB9LFxyXG5cclxuICAgICdsaXN0LmdldExpc3QnIChpZExpc3QpIHtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBMaXN0cy5maW5kKHtcIl9pZFwiOiBpZExpc3R9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IExpc3QuZmluZE9uZSh7XCJfaWRcIjogaWRMaXN0fSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnTGlzdCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgJ2xpc3QuZGVsZXRlTGlzdCcoaWRCb2FyZCwgaWRMaXN0KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnbGlzdC5lZGl0TGlzdCcgKGxpc3QpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgICdsaXN0LmdldEFsbExpc3QnICgpe1xyXG5cclxuICAgIH1cclxufSlcclxuXHJcbi8vIGNvZGUgdG8gcnVuIG9uIHNlcnZlciBhdCBzdGFydHVwXHJcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcclxuICAgIGlmKHJlcS5xdWVyeS5lcnJvcikge1xyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgICAgICAgICAgY29kZTogNDAxLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IFwiRVJST1JcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk7XHJcbn0pO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9zaWduVXAvJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcclxuICAgIGNvbnNvbGUubG9nKHJlcSlcclxuICAgIE1ldGVvci51c2Vycy5pbnNlcnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBmaXJzdG5hbWU6IHJlcS5ib2R5LnN0YXRlLmZpcnN0bmFtZSxcclxuICAgICAgICBsYXN0bmFtZTogcmVxLmJvZHkuc3RhdGUubGFzdG5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnN0YXRlLnBhc3N3b3JkLFxyXG4gICAgICAgIGVtYWlsOiByZXEuYm9keS5zdGF0ZS5lbWFpbFxyXG4gICAgfSlcclxuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHJlc3VsdDogTWV0ZW9yLnVzZXJzLmZpbmQoKS5mZXRjaCgpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuIiwiaW1wb3J0IHtNZXRlb3J9IGZyb20gXCJtZXRlb3IvbWV0ZW9yXCI7XHJcbmltcG9ydCB7VGVhbX0gIGZyb20gXCIuLi9tb2RlbHMvVGVhbVwiO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgXCJ0ZWFtcy5jcmVhdGVUZWFtXCIoe3RlYW1OYW1lLGRlc2NyaXB0aW9ufSl7XHJcbiAgICAgICAgaWYoIXRoaXMudXNlcklkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignTm90LUF1dGhvcml6ZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRlYW1EZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uID8gZGVzY3JpcHRpb24gOiBcIlwiXHJcbiAgICAgICAgLy9sZXQgb3duZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh0aGlzLnVzZXJJZClcclxuICAgICAgICAvKmNvbnNvbGUubG9nKFwiKioqKioqKioqXCIpXHJcbiAgICAgICAgY29uc29sZS5sb2codGVhbU5hbWUpXHJcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKipcIikqL1xyXG4gICAgICAgIHJldHVybiBUZWFtLmluc2VydCh7XHJcbiAgICAgICAgICAgIHRlYW1OYW1lOiB0ZWFtTmFtZSxcclxuICAgICAgICAgICAgdGVhbURlc2NyaXB0aW9uOiB0ZWFtRGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIHRlYW1Pd25lciA6IHRoaXMudXNlcklkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnZ2V0VGVhbXMnKCl7XHJcbiAgICAgICAgLy9jaGVjayh0ZWFtSWQsU3RyaW5nKVxyXG4gICAgICAgaWYoIXRoaXMudXNlcklkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcmlzZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZWFtcyA9IFRlYW0uZmluZCgpO1xyXG5cclxuICAgICAgICBpZih0ZWFtcylcclxuICAgICAgICAgICAgcmV0dXJuIHRlYW1zXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdUZWFtIG5vdCBmb3VuZCcpXHJcbiAgICB9XHJcblxyXG59KTsiLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XHJcblxyXG5NZXRlb3IucHVibGlzaCgndXNlcnMnLCBmdW5jdGlvbigpe1xyXG4gICAgaWYodGhpcy51c2VySWQpIHJldHVybiBNZXRlb3IudXNlcnMuZmluZCh7X2lkOiB7JG5lOiB0aGlzLnVzZXJJZH19LCB7ZmllbGRzOiB7IHByb2ZpbGU6IDEgfX0pO1xyXG59KTtcclxuXHJcbk1ldGVvci5wdWJsaXNoKCd1c2VyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKHtfaWQ6IHRoaXMudXNlcklkfSk7XHJcbn0pO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgXCJ1c2Vycy5zaWduVXBcIih7bGFzdG5hbWUsIGZpcnN0bmFtZSwgZW1haWwsIHBhc3N3b3JkfSl7XHJcbiAgICAgICAgaWYocGFzc3dvcmQubGVuZ3RoIDwgNikgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIlRvbyBzaG9ydCBwYXNzd29yZCwgYXQgbGVhc3QgNiBjaGFyYWN0ZXJzLlwiKVxyXG4gICAgICAgIGVsc2UgaWYoIWVtYWlsIHx8ICFsYXN0bmFtZSB8fCAhZmlyc3RuYW1lKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiU29tZSBmaWVsZCBhcmUgZW1wdHkuXCIpXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxyXG4gICAgICAgICAgICAgICAgcHJvZmlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RuYW1lOiBsYXN0bmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdG5hbWU6IGZpcnN0bmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBlbmFibGVkTWFpbHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIEFjY291bnRzLmNyZWF0ZVVzZXIob3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidXNlcnMudXBkYXRlUHJvZmlsZVwiKGVtYWlsLCBsYXN0bmFtZSwgZmlyc3RuYW1lKXtcclxuICAgICAgICBNZXRlb3IudXNlcnMudXBkYXRlKE1ldGVvci51c2VySWQoKSwgeyAkc2V0OiB7XHJcbiAgICAgICAgICAgIGVtYWlsczogW3thZGRyZXNzOiBlbWFpbCwgdmVyaWZpZWQ6IHRydWV9XSxcclxuICAgICAgICAgICAgJ3Byb2ZpbGUubGFzdG5hbWUnOiBsYXN0bmFtZSxcclxuICAgICAgICAgICAgJ3Byb2ZpbGUuZmlyc3RuYW1lJzogZmlyc3RuYW1lLFxyXG4gICAgICAgICAgICAncHJvZmlsZS5lbWFpbCc6IGVtYWlsXHJcbiAgICAgICAgfX0pO1xyXG4gICAgICAgIHJldHVybiBNZXRlb3IudXNlcigpO1xyXG4gICAgfSxcclxuICAgICd1c2Vycy5jaGFuZ2VQYXNzd29yZCcoYWN0dWFsUGFzc3dvcmQsIG5ld1Bhc3N3b3JkKXtcclxuICAgICAgICBsZXQgY2hlY2tQYXNzd29yZCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKE1ldGVvci51c2VyKCksIGFjdHVhbFBhc3N3b3JkKTtcclxuICAgICAgICBpZihjaGVja1Bhc3N3b3JkLmVycm9yKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGNoZWNrUGFzc3dvcmQuZXJyb3IucmVhc29uKVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKE1ldGVvci51c2VySWQoKSwgbmV3UGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgICd1c2Vycy5zZXRFbmFibGVkTWFpbHMnKGVuYWJsZWRNYWlscyl7XHJcbiAgICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZShNZXRlb3IudXNlcklkKCksIHsgJHNldDoge1xyXG4gICAgICAgICAgICAncHJvZmlsZS5lbmFibGVkTWFpbHMnOiBlbmFibGVkTWFpbHNcclxuICAgICAgICB9fSk7XHJcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2VyKCk7XHJcbiAgICB9LFxyXG4gICAgJ3VzZXJzLnJlbW92ZScoKXtcclxuICAgICAgICBNZXRlb3IudXNlcnMucmVtb3ZlKE1ldGVvci51c2VySWQoKSk7XHJcbiAgICB9LFxyXG4gICAgXCJ1c2Vycy5nZXRVc2VyXCIoZW1haWwpe1xyXG4gICAgICAgIHJldHVybiBNZXRlb3IudXNlcnMuZmluZE9uZSh7XCJwcm9maWxlLmVtYWlsXCI6IGVtYWlsfSk7XHJcbiAgICB9LFxyXG4gICAgXCJ1c2Vycy5nZXRVc2Vyc1wiKCl7XHJcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKCk7XHJcbiAgICB9XHJcbn0pIiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5pbXBvcnQgeyBVc2VyU2NoZW1hIH0gZnJvbSAnLi9Vc2Vycyc7XHJcblxyXG5leHBvcnQgY29uc3QgQm9hcmRVc2VyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgdXNlcjoge1xyXG4gICAgICB0eXBlOiBVc2VyU2NoZW1hLFxyXG4gICAgICBsYWJlbDogXCJVc2VyXCIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfSxcclxuICB1c2VyUm9sZToge1xyXG4gICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgIGxhYmVsOiBcIlJvbGVcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9XHJcbn0pOyIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJ1xyXG5cclxuZXhwb3J0IGNvbnN0IEJvYXJkcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdib2FyZHMnKVxyXG5cclxuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5pbXBvcnQge0xpc3RTY2hlbWF9IGZyb20gXCIuL0xpc3RcIjtcclxuaW1wb3J0IHsgQm9hcmRVc2VyU2NoZW1hIH0gZnJvbSAnLi9Cb2FyZFVzZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJvYXJkU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgYm9hcmRUaXRsZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGxhYmVsOiBcIlRpdGxlXCIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfSxcclxuICBib2FyZERlc2NyaXB0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIixcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgfSxcclxuICBib2FyZFVzZXJzOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJVc2Vyc1wiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgJ2JvYXJkVXNlcnMuJCc6IEJvYXJkVXNlclNjaGVtYSwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBib2FyZFByaXZhY3k6IHtcclxuICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXHJcbiAgICAgIGxhYmVsOiBcIlByaXZhY3lcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIGJvYXJkTGlzdHM6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIkxpc3RzXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdib2FyZExpc3RzLiQnOiBMaXN0U2NoZW1hLCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG5cclxuICAgIGJvYXJkVGFnczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiVGFnc1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnYm9hcmRUYWdzLiQnOiBPYmplY3QsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgYm9hcmRUZWFtczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiVGVhbXNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2JvYXJkVGVhbXMuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBib2FyZENyZWF0ZWRBdDp7XHJcbiAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IERhdGUoKTt9XHJcbiAgfVxyXG59KTtcclxuXHJcbkJvYXJkcy5hdHRhY2hTY2hlbWEoQm9hcmRTY2hlbWEpOyIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcclxuXHJcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJ1xyXG5cclxuZXhwb3J0IGNvbnN0IENhcmRzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2NhcmRzJylcclxuXHJcbmV4cG9ydCBjb25zdCBDYXJkU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgY2FyZElkOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiSWRcIixcclxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxyXG4gIH0sXHJcbiAgY2FyZFRpdGxlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiVGl0bGVcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIGNhcmREZXNjcmlwdGlvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGxhYmVsOiBcIkRlc2NyaXB0aW9uXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gIGNhcmRUYWc6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIlRhZ3NcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2NhcmRUYWcuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBjYXJkQ29tbWVudDoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiQ29tbWVudHNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2NhcmRDb21tZW50LiQnOiBPYmplY3QsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgY2FyZEF0dGFjaG1lbnQ6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIkF0dGFjaG1lbnRzXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdjYXJkQXR0YWNobWVudC4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGNhcmRDaGVja2xpc3Q6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIkNoZWNrTGlzdHNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2NhcmRDaGVja2xpc3QuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBsaXN0Q3JlYXRlZEF0OntcclxuICAgIHR5cGU6IERhdGUsXHJcbiAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBEYXRlKCk7fVxyXG59XHJcbn0pO1xyXG5cclxuQ2FyZHMuYXR0YWNoU2NoZW1hKENhcmRTY2hlbWEpOyIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcclxuXHJcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJ1xyXG5pbXBvcnQge0NhcmRTY2hlbWF9IGZyb20gXCIuL0NhcmRcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBMaXN0cyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdsaXN0cycpXHJcblxyXG5leHBvcnQgY29uc3QgTGlzdFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gIGxpc3RJZDoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgbGFiZWw6IFwiSWRcIixcclxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcclxuICB9LFxyXG4gIGxpc3RUaXRsZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgbGFiZWw6IFwiVGl0bGVcIixcclxuICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfSxcclxuICBsaXN0Q2FyZDp7XHJcbiAgICB0eXBlOiBBcnJheSxcclxuICAgIGxhYmVsOiBcIkNhcmRzXCIsXHJcbiAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnbGlzdENhcmQuJCc6IENhcmRTY2hlbWEsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgbGlzdENyZWF0ZWRBdDp7XHJcbiAgICB0eXBlOiBEYXRlLFxyXG4gICAgYXV0b1ZhbHVlOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRGF0ZSgpO31cclxufVxyXG59KTtcclxuXHJcbkxpc3RzLmF0dGFjaFNjaGVtYShMaXN0U2NoZW1hKTsiLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbydcclxuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5pbXBvcnQge1VzZXJTY2hlbWF9IGZyb20gJy4vVXNlcnMuanMnXHJcblxyXG5leHBvcnQgY29uc3QgVGVhbSA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCd0ZWFtcycpO1xyXG5cclxuY29uc3QgVGVhbVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gICAgdGVhbU5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgbGFiZWw6IFwiTmFtZVwiLFxyXG4gICAgfSxcclxuICAgIHRlYW1EZXNjcmlwdGlvbjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBsYWJlbDogXCJEZXNjcmlwdGlvblwiLFxyXG4gICAgICAgIG9wdGlvbmFsOnRydWUsXHJcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiXHJcbiAgICB9LFxyXG4gICAgdGVhbU93bmVyIDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBsYWJlbDogXCJPd25lclwiXHJcbiAgICB9LFxyXG4gICAgdGVhbU1lbWJlcnM6e1xyXG4gICAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICAgIGxhYmVsIDogXCJNZW1iZXJzXCIsXHJcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gICAgfSxcclxuICAgICd0ZWFtTWVtYmVycy4kJzogVXNlclNjaGVtYVxyXG59KTtcclxuXHJcblxyXG5UZWFtLmF0dGFjaFNjaGVtYShUZWFtU2NoZW1hKTsiLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcblxyXG5jb25zdCBVc2VyUHJvZmlsZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgbGFzdG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBlbWFpbCA6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBlbm5hYmxlZE1haWxzOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBVc2VyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgICB1c2VybmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICAvLyBGb3IgYWNjb3VudHMtcGFzc3dvcmQsIGVpdGhlciBlbWFpbHMgb3IgdXNlcm5hbWUgaXMgcmVxdWlyZWQsIGJ1dCBub3QgYm90aC4gSXQgaXMgT0sgdG8gbWFrZSB0aGlzXHJcbiAgICAgICAgLy8gb3B0aW9uYWwgaGVyZSBiZWNhdXNlIHRoZSBhY2NvdW50cy1wYXNzd29yZCBwYWNrYWdlIGRvZXMgaXRzIG93biB2YWxpZGF0aW9uLlxyXG4gICAgICAgIC8vIFRoaXJkLXBhcnR5IGxvZ2luIHBhY2thZ2VzIG1heSBub3QgcmVxdWlyZSBlaXRoZXIuIEFkanVzdCB0aGlzIHNjaGVtYSBhcyBuZWNlc3NhcnkgZm9yIHlvdXIgdXNhZ2UuXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBlbWFpbHM6IHtcclxuICAgICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgICAvLyBGb3IgYWNjb3VudHMtcGFzc3dvcmQsIGVpdGhlciBlbWFpbHMgb3IgdXNlcm5hbWUgaXMgcmVxdWlyZWQsIGJ1dCBub3QgYm90aC4gSXQgaXMgT0sgdG8gbWFrZSB0aGlzXHJcbiAgICAgICAgLy8gb3B0aW9uYWwgaGVyZSBiZWNhdXNlIHRoZSBhY2NvdW50cy1wYXNzd29yZCBwYWNrYWdlIGRvZXMgaXRzIG93biB2YWxpZGF0aW9uLlxyXG4gICAgICAgIC8vIFRoaXJkLXBhcnR5IGxvZ2luIHBhY2thZ2VzIG1heSBub3QgcmVxdWlyZSBlaXRoZXIuIEFkanVzdCB0aGlzIHNjaGVtYSBhcyBuZWNlc3NhcnkgZm9yIHlvdXIgdXNhZ2UuXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBcImVtYWlscy4kXCI6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3RcclxuICAgIH0sXHJcbiAgICBcImVtYWlscy4kLmFkZHJlc3NcIjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXHJcbiAgICB9LFxyXG4gICAgXCJlbWFpbHMuJC52ZXJpZmllZFwiOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhblxyXG4gICAgfSxcclxuICAgIC8vIFVzZSB0aGlzIHJlZ2lzdGVyZWRfZW1haWxzIGZpZWxkIGlmIHlvdSBhcmUgdXNpbmcgc3BsZW5kaWRvOm1ldGVvci1hY2NvdW50cy1lbWFpbHMtZmllbGQgLyBzcGxlbmRpZG86bWV0ZW9yLWFjY291bnRzLW1lbGRcclxuICAgIHJlZ2lzdGVyZWRfZW1haWxzOiB7XHJcbiAgICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICAncmVnaXN0ZXJlZF9lbWFpbHMuJCc6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3QsXHJcbiAgICAgICAgYmxhY2tib3g6IHRydWVcclxuICAgIH0sXHJcbiAgICBjcmVhdGVkQXQ6IHtcclxuICAgICAgICB0eXBlOiBEYXRlXHJcbiAgICB9LFxyXG4gICAgcHJvZmlsZToge1xyXG4gICAgICAgIHR5cGU6IFVzZXJQcm9maWxlU2NoZW1hLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLy8gTWFrZSBzdXJlIHRoaXMgc2VydmljZXMgZmllbGQgaXMgaW4geW91ciBzY2hlbWEgaWYgeW91J3JlIHVzaW5nIGFueSBvZiB0aGUgYWNjb3VudHMgcGFja2FnZXNcclxuICAgIHNlcnZpY2VzOiB7XHJcbiAgICAgICAgdHlwZTogT2JqZWN0LFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gICAgICAgIGJsYWNrYm94OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLy8gQWRkIGByb2xlc2AgdG8geW91ciBzY2hlbWEgaWYgeW91IHVzZSB0aGUgbWV0ZW9yLXJvbGVzIHBhY2thZ2UuXHJcbiAgICAvLyBPcHRpb24gMTogT2JqZWN0IHR5cGVcclxuICAgIC8vIElmIHlvdSBzcGVjaWZ5IHRoYXQgdHlwZSBhcyBPYmplY3QsIHlvdSBtdXN0IGFsc28gc3BlY2lmeSB0aGVcclxuICAgIC8vIGBSb2xlcy5HTE9CQUxfR1JPVVBgIGdyb3VwIHdoZW5ldmVyIHlvdSBhZGQgYSB1c2VyIHRvIGEgcm9sZS5cclxuICAgIC8vIEV4YW1wbGU6XHJcbiAgICAvLyBSb2xlcy5hZGRVc2Vyc1RvUm9sZXModXNlcklkLCBbXCJhZG1pblwiXSwgUm9sZXMuR0xPQkFMX0dST1VQKTtcclxuICAgIC8vIFlvdSBjYW4ndCBtaXggYW5kIG1hdGNoIGFkZGluZyB3aXRoIGFuZCB3aXRob3V0IGEgZ3JvdXAgc2luY2VcclxuICAgIC8vIHlvdSB3aWxsIGZhaWwgdmFsaWRhdGlvbiBpbiBzb21lIGNhc2VzLlxyXG4gICAgcm9sZXM6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3QsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgICAgICAgYmxhY2tib3g6IHRydWVcclxuICAgIH0sXHJcbiAgICAvLyBPcHRpb24gMjogW1N0cmluZ10gdHlwZVxyXG4gICAgLy8gSWYgeW91IGFyZSBzdXJlIHlvdSB3aWxsIG5ldmVyIG5lZWQgdG8gdXNlIHJvbGUgZ3JvdXBzLCB0aGVuXHJcbiAgICAvLyB5b3UgY2FuIHNwZWNpZnkgW1N0cmluZ10gYXMgdGhlIHR5cGVcclxuICAgIHJvbGVzOiB7XHJcbiAgICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICAncm9sZXMuJCc6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgIH0sXHJcbiAgICAvLyBJbiBvcmRlciB0byBhdm9pZCBhbiAnRXhjZXB0aW9uIGluIHNldEludGVydmFsIGNhbGxiYWNrJyBmcm9tIE1ldGVvclxyXG4gICAgaGVhcnRiZWF0OiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfVxyXG59KTtcclxuXHJcbk1ldGVvci51c2Vycy5hdHRhY2hTY2hlbWEoVXNlclNjaGVtYSk7IiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XHJcblxyXG5pbXBvcnQgJy4vYXBpL3VzZXJzLmpzJztcclxuaW1wb3J0ICcuL2FwaS9ib2FyZHMnO1xyXG5pbXBvcnQgJy4vYXBpL2xpc3RzJztcclxuaW1wb3J0ICcuL2FwaS90ZWFtcycgXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XHJcblxyXG59KTsiXX0=
