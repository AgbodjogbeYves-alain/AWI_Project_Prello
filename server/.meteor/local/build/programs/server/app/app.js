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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvYXBpL1V0aWxzL2JvYXJkVXRpbHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9ib2FyZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2FwaS9saXN0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvYXBpL3VzZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvQm9hcmRVc2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvQm9hcmRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvQ2FyZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL0xpc3QuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9Vc2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJib2FyZFV0aWxzIiwiY2hlY2tJbkJvYXJkVXNlciIsImlkVXNlciIsImJvYXJkIiwiaXNJbiIsImJvYXJkVXNlcnMiLCJtYXAiLCJ1c2VyIiwiX2lkIiwiQm9hcmRzIiwibGluayIsInYiLCJNZXRlb3IiLCJydXNGdW5jdGlvbiIsImRlZmF1bHQiLCJwdWJsaXNoIiwiZmluZCIsIm1ldGhvZHMiLCJjb25zb2xlIiwibG9nIiwidXNlcklkIiwiaW5zZXJ0IiwiRXJyb3IiLCJpZEJvYXJkIiwiY291bnREb2MiLCJjb3VudCIsImZpbmRPbmUiLCJib2FyZElkIiwicmVtb3ZlIiwibmV3Qm9hcmQiLCJib2FyZExpc3QiLCJsaXN0Q2FyZCIsInVwZGF0ZSIsIiRzZXQiLCJib2FyZFRpdGxlIiwiYm9hcmRQcml2YWN5IiwicHJpdmFjeSIsImZldGNoIiwiYWxsQm9hcmRzIiwidXNlckJvYXJkIiwicHVzaCIsImJvYXJkVGVhbXMiLCJjYXJkcyIsImxpc3QiLCJ0aGVMaXN0IiwiY2FsbCIsImNhcmQiLCJib2FyZFRhZ3MiLCJsaXN0cyIsImxpc3RJZCIsImNhcmRJZCIsIkxpc3RzIiwiUmFuZG9tIiwiSnNvblJvdXRlcyIsImxpc3ROYW1lIiwibGlzdFRpdGxlIiwiaWRMaXN0IiwiTGlzdCIsIk1pZGRsZXdhcmUiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJlcnJvciIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInJlc3VsdCIsImFkZCIsInVzZXJzIiwidXNlcm5hbWUiLCJib2R5Iiwic3RhdGUiLCJmaXJzdG5hbWUiLCJsYXN0bmFtZSIsInBhc3N3b3JkIiwiZW1haWwiLCJBY2NvdW50cyIsIiRuZSIsImZpZWxkcyIsInByb2ZpbGUiLCJsZW5ndGgiLCJvcHRpb25zIiwiZW5hYmxlZE1haWxzIiwiY3JlYXRlVXNlciIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsImFjdHVhbFBhc3N3b3JkIiwibmV3UGFzc3dvcmQiLCJjaGVja1Bhc3N3b3JkIiwiX2NoZWNrUGFzc3dvcmQiLCJyZWFzb24iLCJzZXRQYXNzd29yZCIsImxvZ291dCIsIkJvYXJkVXNlclNjaGVtYSIsIlNpbXBsZVNjaGVtYSIsIlVzZXJTY2hlbWEiLCJ0eXBlIiwibGFiZWwiLCJyZXF1aXJlZCIsInVzZXJSb2xlIiwiTnVtYmVyIiwiQm9hcmRTY2hlbWEiLCJNb25nbyIsIkxpc3RTY2hlbWEiLCJDb2xsZWN0aW9uIiwiU3RyaW5nIiwiYm9hcmREZXNjcmlwdGlvbiIsIkFycmF5IiwiSW50ZWdlciIsImJvYXJkTGlzdHMiLCJkZWZhdWx0VmFsdWUiLCJPYmplY3QiLCJib2FyZENyZWF0ZWRBdCIsIkRhdGUiLCJhdXRvVmFsdWUiLCJhdHRhY2hTY2hlbWEiLCJDYXJkcyIsIkNhcmRTY2hlbWEiLCJyZWdFeCIsIlJlZ0V4IiwiSWQiLCJjYXJkVGl0bGUiLCJjYXJkRGVzY3JpcHRpb24iLCJjYXJkVGFnIiwiY2FyZENvbW1lbnQiLCJjYXJkQXR0YWNobWVudCIsImNhcmRDaGVja2xpc3QiLCJsaXN0Q3JlYXRlZEF0IiwiVXNlclByb2ZpbGVTY2hlbWEiLCJvcHRpb25hbCIsImVubmFibGVkTWFpbHMiLCJCb29sZWFuIiwiRW1haWwiLCJyZWdpc3RlcmVkX2VtYWlscyIsImJsYWNrYm94IiwiY3JlYXRlZEF0Iiwic2VydmljZXMiLCJyb2xlcyIsImhlYXJ0YmVhdCIsInN0YXJ0dXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLFlBQVUsRUFBQyxNQUFJQTtBQUFoQixDQUFkOztBQUFPLE1BQU1BLFVBQU4sQ0FBaUI7QUFFcEIsU0FBT0MsZ0JBQVAsQ0FBd0JDLE1BQXhCLEVBQWdDQyxLQUFoQyxFQUFzQztBQUNsQyxRQUFJQyxJQUFJLEdBQUcsS0FBWDtBQUNBRCxTQUFLLENBQUNFLFVBQU4sQ0FBaUJDLEdBQWpCLENBQXNCQyxJQUFELElBQVU7QUFDM0IsVUFBR0EsSUFBSSxDQUFDQyxHQUFMLElBQVlOLE1BQWYsRUFBc0I7QUFDbEJFLFlBQUksR0FBRyxJQUFQO0FBQ0g7QUFDSixLQUpEO0FBTUEsV0FBT0EsSUFBUDtBQUNIOztBQVhtQixDOzs7Ozs7Ozs7OztBQ0F4QixJQUFJSyxNQUFKO0FBQVdYLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUNELFFBQU0sQ0FBQ0UsQ0FBRCxFQUFHO0FBQUNGLFVBQU0sR0FBQ0UsQ0FBUDtBQUFTOztBQUFwQixDQUEvQixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJQyxNQUFKO0FBQVdkLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0UsUUFBTSxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsVUFBTSxHQUFDRCxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlYLFVBQUo7QUFBZUYsTUFBTSxDQUFDWSxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ1YsWUFBVSxDQUFDVyxDQUFELEVBQUc7QUFBQ1gsY0FBVSxHQUFDVyxDQUFYO0FBQWE7O0FBQTVCLENBQWpDLEVBQStELENBQS9EO0FBQWtFLElBQUlFLFdBQUo7QUFBZ0JmLE1BQU0sQ0FBQ1ksSUFBUCxD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QjtBQXNFdkM7QUFDQWlDLFdBQVMsRUFBRTtBQUNQMUMsUUFBSSxFQUFFaUIsSUFEQztBQUVQZ0IsWUFBUSxFQUFFO0FBRkg7QUF2RTRCLENBQWpCLENBQW5CO0FBNkVQeEgsTUFBTSxDQUFDMEQsS0FBUCxDQUFhZ0QsWUFBYixDQUEwQnBCLFVBQTFCLEU7Ozs7Ozs7Ozs7O0FDbEdBLElBQUl0RixNQUFKO0FBQVdkLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0UsUUFBTSxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsVUFBTSxHQUFDRCxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFEYixNQUFNLENBQUNZLElBQVAsQ0FBWSxnQkFBWjtBQUE4QlosTUFBTSxDQUFDWSxJQUFQLENBQVksY0FBWjtBQUE0QlosTUFBTSxDQUFDWSxJQUFQLENBQVksYUFBWjtBQU0xSEUsTUFBTSxDQUFDa0ksT0FBUCxDQUFlLE1BQU0sQ0FFcEIsQ0FGRCxFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgYm9hcmRVdGlscyB7XHJcblxyXG4gICAgc3RhdGljIGNoZWNrSW5Cb2FyZFVzZXIoaWRVc2VyLCBib2FyZCl7XHJcbiAgICAgICAgbGV0IGlzSW4gPSBmYWxzZVxyXG4gICAgICAgIGJvYXJkLmJvYXJkVXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHVzZXIuX2lkID09IGlkVXNlcil7XHJcbiAgICAgICAgICAgICAgICBpc0luID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGlzSW5cclxuICAgIH1cclxufSIsImltcG9ydCB7Qm9hcmRzfSBmcm9tIFwiLi4vbW9kZWxzL0JvYXJkc1wiO1xyXG5pbXBvcnQge01ldGVvcn0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcclxuaW1wb3J0IHtib2FyZFV0aWxzfSBmcm9tIFwiLi9VdGlscy9ib2FyZFV0aWxzXCI7XHJcbmltcG9ydCBydXNGdW5jdGlvbiBmcm9tICdydXMtZGlmZidcclxuXHJcbk1ldGVvci5wdWJsaXNoKCdib2FyZHMnLCBmdW5jdGlvbiAoKSB7cmV0dXJuIEJvYXJkcy5maW5kKCl9KTtcclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuXHJcbiAgICAnYm9hcmRzLmNyZWF0ZUJvYXJkJyhib2FyZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGVzdFwiKVxyXG4gICAgICAgIGlmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGJvYXJkKVxyXG4gICAgICAgICAgICByZXR1cm4gQm9hcmRzLmluc2VydChib2FyZCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmRzLmdldEJvYXJkJyAoaWRCb2FyZCkge1xyXG4gICAgICAgIGxldCBib2FyZDtcclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJib2FyZElkXCI6IGlkQm9hcmR9KS5jb3VudCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvdW50RG9jKVxyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogaWRCb2FyZH0pO1xyXG4gICAgICAgICAgICAvL2lmKGJvYXJkLmJvYXJkUHJpdmFjeSA9PSAxKXtcclxuICAgICAgICAgICAgICAvLyAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgICAgICAgIC8vICAgICAgcmV0dXJuIGJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBvbiB0aGlzIGFsbG93IHRvIHNlZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAgIC8vICAgIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9hcmRcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKidib2FyZHMuZ2V0Qm9hcmRGcm9tRXh0JyAoaWRCb2FyZCx0b2tlbikge1xyXG4gICAgICAgIGxldCBkZWNvZGVkVG9rZW4gPSBcInhkXCJcclxuICAgICAgICBsZXQgYm9hcmQ7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGlkQm9hcmR9KS5jb3VudCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvdW50RG9jKVxyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogaWRCb2FyZH0pO1xyXG4gICAgICAgICAgICBpZihib2FyZC5ib2FyZFByaXZhY3kgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICBpZih0b2tlbi51c2VySWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBvbiB0aGlzIGFsbG93IHRvIHNlZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSwqL1xyXG5cclxuICAgICdib2FyZHMucmVtb3ZlQm9hcmQnKGJvYXJkSWQpIHtcclxuICAgICAgICBsZXQgYm9hcmQ7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY291bnREb2MpXHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgICAvLyAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQm9hcmRzLnJlbW92ZShib2FyZElkKTtcclxuICAgICAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkcy5lZGl0Qm9hcmQnIChuZXdCb2FyZCkge1xyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcImJvYXJkSWRcIjogbmV3Qm9hcmQuYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5cIilcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobmV3Qm9hcmQuYm9hcmRMaXN0WzBdLmxpc3RDYXJkWzBdKVxyXG4gICAgICAgICAgICBCb2FyZHMudXBkYXRlKHtib2FyZElkOiBuZXdCb2FyZC5ib2FyZElkfSwge1xyXG4gICAgICAgICAgICAgICAgJHNldDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkVGl0bGU6IG5ld0JvYXJkLmJvYXJkVGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRQcml2YWN5OiBuZXdCb2FyZC5wcml2YWN5LFxyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkVXNlcnM6IG5ld0JvYXJkLmJvYXJkVXNlcnNcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgIC8qbmV3Qm9hcmQuYm9hcmRMaXN0LmZvckVhY2goKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBCb2FyZHMudXBkYXRlKHtib2FyZElkOiBuZXdCb2FyZC5ib2FyZElkLCAnYm9hcmRMaXN0Lmxpc3RJZCc6IGxpc3QubGlzdElkfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvYXJkTGlzdC5saXN0Lmxpc3RDYXJkLiRbXVwiOiBsaXN0Lmxpc3RDYXJkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KSovXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8qbmV3Qm9hcmQuYm9hcmRMaXN0LmZvckVhY2goKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIEJvYXJkcy51cGRhdGUoe2JvYXJkSWQ6IG5ld0JvYXJkLmJvYXJkSWQsIFwiYm9hcmRMaXN0Lmxpc3RJZFwiOiBsaXN0Lmxpc3RJZH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkVGl0bGU6IG5ld0JvYXJkLmJvYXJkVGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkUHJpdmFjeTogbmV3Qm9hcmQucHJpdmFjeSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KSovXHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmQuZ2V0QWxsQm9hcmRzJyAoKXtcclxuICAgICAgICByZXR1cm4gQm9hcmRzLmZpbmQoKS5mZXRjaCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAnYm9hcmQuZ2V0VXNlckFsbEJvYXJkcycgKHVzZXJJZCl7XHJcbiAgICAgICAgbGV0IGFsbEJvYXJkcyA9IEJvYXJkcy5maW5kKCkuZmV0Y2goKVxyXG4gICAgICAgIGxldCB1c2VyQm9hcmQgPSBbXVxyXG4gICAgICAgIGFsbEJvYXJkcy5tYXAoKGJvYXJkKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcih1c2VySWQpKXtcclxuICAgICAgICAgICAgICAgIHVzZXJCb2FyZC5wdXNoKGJvYXJkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbEJvYXJkc1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkLmdldFRlYW0nIChib2FyZElkKXtcclxuICAgICAgICBsZXQgYm9hcmQ7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogYm9hcmRJZH0pO1xyXG4gICAgICAgICAgICAvL2lmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQuYm9hcmRUZWFtcztcclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGFsbG93IHRvIGRlbGV0ZSB0aGlzIGJvYXJkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgLy8gIHJldHVybiBNZXRlb3IuRXJyb3IoNDAxLCBcIllvdSBhcmUgbm90IGF1dGhlbnRpZmljYXRlZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0JvYXJkIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgICdib2FyZC5nZXRDYXJkcycgKGJvYXJkSWQpIHtcclxuICAgICAgICBsZXQgYm9hcmQ7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gQm9hcmRzLmZpbmQoe1wiX2lkXCI6IGJvYXJkSWR9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjb3VudERvYyA9PT0gMSkge1xyXG4gICAgICAgICAgICBib2FyZCA9IEJvYXJkcy5maW5kT25lKHtcImJvYXJkSWRcIjogYm9hcmRJZH0pO1xyXG4gICAgICAgICAgICAvL2lmKE1ldGVvci51c2VySWQoKSl7XHJcbiAgICAgICAgICAgIC8vICBpZihib2FyZFV0aWxzLmNoZWNrSW5Cb2FyZFVzZXIoTWV0ZW9yLnVzZXJJZCgpLCBib2FyZCkpe1xyXG4gICAgICAgICAgICBsZXQgY2FyZHMgPSBbXVxyXG4gICAgICAgICAgICBib2FyZC5ib2FyZExpc3QubWFwKChsaXN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNBbm5vdGF0b3JcclxuICAgICAgICAgICAgICAgIGxldCB0aGVMaXN0ID0gTWV0ZW9yLmNhbGwoJ2dldExpc3QnLGxpc3QuX2lkKVxyXG4gICAgICAgICAgICAgICAgdGhlTGlzdC5saXN0Q2FyZC5tYXAoKGNhcmQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkcy5wdXNoKGNhcmQpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNhcmRzXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhbGxvdyB0byBkZWxldGUgdGhpcyBib2FyZFwiKVxyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8vfWVsc2V7XHJcbiAgICAgICAgICAgIC8vICByZXR1cm4gTWV0ZW9yLkVycm9yKDQwMSwgXCJZb3UgYXJlIG5vdCBhdXRoZW50aWZpY2F0ZWRcIilcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdCb2FyZCBub3QgZm91bmQnKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgJ2JvYXJkcy5nZXRUYWdzJyAoYm9hcmRJZCkge1xyXG4gICAgICAgIGxldCBib2FyZFxyXG4gICAgICAgIGxldCBjb3VudERvYyA9IEJvYXJkcy5maW5kKHtcIl9pZFwiOiBib2FyZElkfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgYm9hcmQgPSBCb2FyZHMuZmluZE9uZSh7XCJib2FyZElkXCI6IGJvYXJkSWR9KTtcclxuICAgICAgICAgICAgLy9pZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgICAvLyAgaWYoYm9hcmRVdGlscy5jaGVja0luQm9hcmRVc2VyKE1ldGVvci51c2VySWQoKSwgYm9hcmQpKXtcclxuICAgICAgICAgICAgcmV0dXJuIGJvYXJkLmJvYXJkVGFnc1xyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYWxsb3cgdG8gZGVsZXRlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZHMuZ2V0TGlzdHMnIChib2FyZElkKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkXHJcbiAgICAgICAgbGV0IGxpc3RzID0gW11cclxuICAgICAgICBsZXQgY291bnREb2MgPSBCb2FyZHMuZmluZCh7XCJfaWRcIjogYm9hcmRJZH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGNvdW50RG9jID09PSAxKSB7XHJcbiAgICAgICAgICAgIGJvYXJkID0gQm9hcmRzLmZpbmRPbmUoe1wiYm9hcmRJZFwiOiBib2FyZElkfSk7XHJcbiAgICAgICAgICAgIC8vaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgICAgLy8gIGlmKGJvYXJkVXRpbHMuY2hlY2tJbkJvYXJkVXNlcihNZXRlb3IudXNlcklkKCksIGJvYXJkKSl7XHJcbiAgICAgICAgICAgIGJvYXJkLmJvYXJkTGlzdC5tYXAoKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0aGVMaXN0ID0gTWV0ZW9yLmNhbGwoJ2xpc3QuZ2V0TGlzdCcsbGlzdC5faWQpXHJcbiAgICAgICAgICAgICAgICBsaXN0cy5wdXNoKHRoZUxpc3QpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0c1xyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYWxsb3cgdG8gZGVsZXRlIHRoaXMgYm9hcmRcIilcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAvL31lbHNle1xyXG4gICAgICAgICAgICAvLyAgcmV0dXJuIE1ldGVvci5FcnJvcig0MDEsIFwiWW91IGFyZSBub3QgYXV0aGVudGlmaWNhdGVkXCIpXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnQm9hcmQgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ2JvYXJkLmFyY2hpdmVMaXN0JyAoYm9hcmRJZCxsaXN0SWQpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgICdib2FyZC5hcmNoaXZlQ2FyZCcgKGJvYXJkSWQsIGNhcmRJZCkge1xyXG5cclxuICAgIH1cclxuXHJcbn0pXHJcbiIsImltcG9ydCB7TGlzdHN9IGZyb20gXCIuLi9tb2RlbHMvTGlzdFwiO1xyXG5pbXBvcnQge01ldGVvcn0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcclxuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnbWV0ZW9yL3JhbmRvbSc7XHJcbmltcG9ydCB7IEpzb25Sb3V0ZXMgfSBmcm9tICdtZXRlb3Ivc2ltcGxlOmpzb24tcm91dGVzJztcclxuXHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgICAnbGlzdC5jcmVhdGVMaXN0JyhsaXN0TmFtZSkge1xyXG4gICAgICAgIHJldHVybiBMaXN0cy5pbnNlcnQoe2xpc3RUaXRsZTogbGlzdE5hbWV9KVxyXG4gICAgfSxcclxuXHJcbiAgICAnbGlzdC5nZXRMaXN0JyAoaWRMaXN0KSB7XHJcbiAgICAgICAgbGV0IGNvdW50RG9jID0gTGlzdHMuZmluZCh7XCJfaWRcIjogaWRMaXN0fSkuY291bnQoKTtcclxuICAgICAgICBpZiAoY291bnREb2MgPT09IDEpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBMaXN0LmZpbmRPbmUoe1wiX2lkXCI6IGlkTGlzdH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ0xpc3Qgbm90IGZvdW5kJylcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgICdsaXN0LmRlbGV0ZUxpc3QnKGlkQm9hcmQsIGlkTGlzdCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgJ2xpc3QuZWRpdExpc3QnIChsaXN0KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAnbGlzdC5nZXRBbGxMaXN0JyAoKXtcclxuXHJcbiAgICB9XHJcbn0pXHJcblxyXG4vLyBjb2RlIHRvIHJ1biBvbiBzZXJ2ZXIgYXQgc3RhcnR1cFxyXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XHJcbiAgICBpZihyZXEucXVlcnkuZXJyb3IpIHtcclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XHJcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiBcIkVSUk9SXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpO1xyXG59KTtcclxuXHJcblxyXG5Kc29uUm91dGVzLmFkZCgncG9zdCcsICcvc2lnblVwLycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XHJcbiAgICBjb25zb2xlLmxvZyhyZXEpXHJcbiAgICBNZXRlb3IudXNlcnMuaW5zZXJ0KHtcclxuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkuc3RhdGUudXNlcm5hbWUsXHJcbiAgICAgICAgZmlyc3RuYW1lOiByZXEuYm9keS5zdGF0ZS5maXJzdG5hbWUsXHJcbiAgICAgICAgbGFzdG5hbWU6IHJlcS5ib2R5LnN0YXRlLmxhc3RuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5zdGF0ZS5wYXNzd29yZCxcclxuICAgICAgICBlbWFpbDogcmVxLmJvZHkuc3RhdGUuZW1haWxcclxuICAgIH0pXHJcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICByZXN1bHQ6IE1ldGVvci51c2Vycy5maW5kKCkuZmV0Y2goKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTtcclxuXHJcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xyXG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcclxuXHJcbk1ldGVvci5wdWJsaXNoKCd1c2VycycsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZih0aGlzLnVzZXJJZCkgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKHtfaWQ6IHskbmU6IHRoaXMudXNlcklkfX0sIHtmaWVsZHM6IHsgcHJvZmlsZTogMSB9fSk7XHJcbn0pO1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goJ3VzZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoe19pZDogdGhpcy51c2VySWR9KTtcclxufSk7XHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgICBcInVzZXJzLnNpZ25VcFwiKHtsYXN0bmFtZSwgZmlyc3RuYW1lLCBlbWFpbCwgcGFzc3dvcmR9KXtcclxuICAgICAgICBpZihwYXNzd29yZC5sZW5ndGggPCA2KSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiVG9vIHNob3J0IHBhc3N3b3JkLCBhdCBsZWFzdCA2IGNoYXJhY3RlcnMuXCIpXHJcbiAgICAgICAgZWxzZSBpZighZW1haWwgfHwgIWxhc3RuYW1lIHx8ICFmaXJzdG5hbWUpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJTb21lIGZpZWxkIGFyZSBlbXB0eS5cIilcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdG5hbWU6IGxhc3RuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0bmFtZTogZmlyc3RuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWRNYWlsczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgQWNjb3VudHMuY3JlYXRlVXNlcihvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ1c2Vycy51cGRhdGVQcm9maWxlXCIoZW1haWwsIGxhc3RuYW1lLCBmaXJzdG5hbWUpe1xyXG4gICAgICAgIE1ldGVvci51c2Vycy51cGRhdGUoTWV0ZW9yLnVzZXJJZCgpLCB7ICRzZXQ6IHtcclxuICAgICAgICAgICAgZW1haWxzOiBbe2FkZHJlc3M6IGVtYWlsLCB2ZXJpZmllZDogdHJ1ZX1dLFxyXG4gICAgICAgICAgICAncHJvZmlsZS5sYXN0bmFtZSc6IGxhc3RuYW1lLFxyXG4gICAgICAgICAgICAncHJvZmlsZS5maXJzdG5hbWUnOiBmaXJzdG5hbWUsXHJcbiAgICAgICAgICAgICdwcm9maWxlLmVtYWlsJzogZW1haWxcclxuICAgICAgICB9fSk7XHJcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2VyKCk7XHJcbiAgICB9LFxyXG4gICAgJ3VzZXJzLmNoYW5nZVBhc3N3b3JkJyhhY3R1YWxQYXNzd29yZCwgbmV3UGFzc3dvcmQpe1xyXG4gICAgICAgIGxldCBjaGVja1Bhc3N3b3JkID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoTWV0ZW9yLnVzZXIoKSwgYWN0dWFsUGFzc3dvcmQpO1xyXG4gICAgICAgIGlmKGNoZWNrUGFzc3dvcmQuZXJyb3IpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoY2hlY2tQYXNzd29yZC5lcnJvci5yZWFzb24pXHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgQWNjb3VudHMuc2V0UGFzc3dvcmQoTWV0ZW9yLnVzZXJJZCgpLCBuZXdQYXNzd29yZCwge2xvZ291dDogZmFsc2V9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ3VzZXJzLnNldEVuYWJsZWRNYWlscycoZW5hYmxlZE1haWxzKXtcclxuICAgICAgICBNZXRlb3IudXNlcnMudXBkYXRlKE1ldGVvci51c2VySWQoKSwgeyAkc2V0OiB7XHJcbiAgICAgICAgICAgICdwcm9maWxlLmVuYWJsZWRNYWlscyc6IGVuYWJsZWRNYWlsc1xyXG4gICAgICAgIH19KTtcclxuICAgICAgICByZXR1cm4gTWV0ZW9yLnVzZXIoKTtcclxuICAgIH0sXHJcbiAgICAndXNlcnMucmVtb3ZlJygpe1xyXG4gICAgICAgIE1ldGVvci51c2Vycy5yZW1vdmUoTWV0ZW9yLnVzZXJJZCgpKTtcclxuICAgIH0sXHJcbiAgICBcInVzZXJzLmdldFVzZXJcIihlbWFpbCl7XHJcbiAgICAgICAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kT25lKHtcInByb2ZpbGUuZW1haWxcIjogZW1haWx9KTtcclxuICAgIH0sXHJcbiAgICBcInVzZXJzLmdldFVzZXJzXCIoKXtcclxuICAgICAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoKTtcclxuICAgIH1cclxufSkiLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcbmltcG9ydCB7IFVzZXJTY2hlbWEgfSBmcm9tICcuL1VzZXJzJztcclxuXHJcbmV4cG9ydCBjb25zdCBCb2FyZFVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICB1c2VyOiB7XHJcbiAgICAgIHR5cGU6IFVzZXJTY2hlbWEsXHJcbiAgICAgIGxhYmVsOiBcIlVzZXJcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIHVzZXJSb2xlOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgbGFiZWw6IFwiUm9sZVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH1cclxufSk7IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcblxyXG5leHBvcnQgY29uc3QgQm9hcmRzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2JvYXJkcycpXHJcblxyXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XHJcbmltcG9ydCB7TGlzdFNjaGVtYX0gZnJvbSBcIi4vTGlzdFwiO1xyXG5pbXBvcnQgeyBCb2FyZFVzZXJTY2hlbWEgfSBmcm9tICcuL0JvYXJkVXNlcic7XHJcblxyXG5leHBvcnQgY29uc3QgQm9hcmRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBib2FyZFRpdGxlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiVGl0bGVcIixcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIGJvYXJkRGVzY3JpcHRpb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJEZXNjcmlwdGlvblwiLFxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICB9LFxyXG4gIGJvYXJkVXNlcnM6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGxhYmVsOiBcIlVzZXJzXCIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgfSxcclxuICAnYm9hcmRVc2Vycy4kJzogQm9hcmRVc2VyU2NoZW1hLCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGJvYXJkUHJpdmFjeToge1xyXG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcclxuICAgICAgbGFiZWw6IFwiUHJpdmFjeVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgYm9hcmRMaXN0czoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiTGlzdHNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2JvYXJkTGlzdHMuJCc6IExpc3RTY2hlbWEsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcblxyXG4gICAgYm9hcmRUYWdzOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJUYWdzXCIsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdib2FyZFRhZ3MuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBib2FyZFRlYW1zOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJUZWFtc1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnYm9hcmRUZWFtcy4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGJvYXJkQ3JlYXRlZEF0OntcclxuICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgYXV0b1ZhbHVlOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRGF0ZSgpO31cclxuICB9XHJcbn0pO1xyXG5cclxuQm9hcmRzLmF0dGFjaFNjaGVtYShCb2FyZFNjaGVtYSk7IiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5cclxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcblxyXG5leHBvcnQgY29uc3QgQ2FyZHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignY2FyZHMnKVxyXG5cclxuZXhwb3J0IGNvbnN0IENhcmRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBjYXJkSWQ6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJJZFwiLFxyXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXHJcbiAgfSxcclxuICBjYXJkVGl0bGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDogXCJUaXRsZVwiLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgY2FyZERlc2NyaXB0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgY2FyZFRhZzoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiVGFnc1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZFRhZy4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGNhcmRDb21tZW50OiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBsYWJlbDogXCJDb21tZW50c1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZENvbW1lbnQuJCc6IE9iamVjdCwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBjYXJkQXR0YWNobWVudDoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiQXR0YWNobWVudHNcIixcclxuICAgICAgZGVmYXVsdFZhbHVlOiBbXVxyXG4gIH0sXHJcbiAgJ2NhcmRBdHRhY2htZW50LiQnOiBPYmplY3QsIC8vc2UgaWYgbmVlZCB0byByZXBsYWNlIE9iamVjdCB3aXRoIGEgc2NoZW1hXHJcbiAgY2FyZENoZWNrbGlzdDoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgbGFiZWw6IFwiQ2hlY2tMaXN0c1wiLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFtdXHJcbiAgfSxcclxuICAnY2FyZENoZWNrbGlzdC4kJzogT2JqZWN0LCAvL3NlIGlmIG5lZWQgdG8gcmVwbGFjZSBPYmplY3Qgd2l0aCBhIHNjaGVtYVxyXG4gIGxpc3RDcmVhdGVkQXQ6e1xyXG4gICAgdHlwZTogRGF0ZSxcclxuICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IERhdGUoKTt9XHJcbn1cclxufSk7XHJcblxyXG5DYXJkcy5hdHRhY2hTY2hlbWEoQ2FyZFNjaGVtYSk7IiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xyXG5cclxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcbmltcG9ydCB7Q2FyZFNjaGVtYX0gZnJvbSBcIi4vQ2FyZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IExpc3RzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2xpc3RzJylcclxuXHJcbmV4cG9ydCBjb25zdCBMaXN0U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgbGlzdElkOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBsYWJlbDogXCJJZFwiLFxyXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxyXG4gIH0sXHJcbiAgbGlzdFRpdGxlOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBsYWJlbDogXCJUaXRsZVwiLFxyXG4gICAgcmVxdWlyZWQ6IHRydWVcclxuICB9LFxyXG4gIGxpc3RDYXJkOntcclxuICAgIHR5cGU6IEFycmF5LFxyXG4gICAgbGFiZWw6IFwiQ2FyZHNcIixcclxuICAgIGRlZmF1bHRWYWx1ZTogW11cclxuICB9LFxyXG4gICdsaXN0Q2FyZC4kJzogQ2FyZFNjaGVtYSwgLy9zZSBpZiBuZWVkIHRvIHJlcGxhY2UgT2JqZWN0IHdpdGggYSBzY2hlbWFcclxuICBsaXN0Q3JlYXRlZEF0OntcclxuICAgIHR5cGU6IERhdGUsXHJcbiAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBEYXRlKCk7fVxyXG59XHJcbn0pO1xyXG5cclxuTGlzdHMuYXR0YWNoU2NoZW1hKExpc3RTY2hlbWEpOyIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcclxuXHJcbmNvbnN0IFVzZXJQcm9maWxlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICBsYXN0bmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGVtYWlsIDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGVubmFibGVkTWFpbHM6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IFVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICAgIHVzZXJuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIC8vIEZvciBhY2NvdW50cy1wYXNzd29yZCwgZWl0aGVyIGVtYWlscyBvciB1c2VybmFtZSBpcyByZXF1aXJlZCwgYnV0IG5vdCBib3RoLiBJdCBpcyBPSyB0byBtYWtlIHRoaXNcclxuICAgICAgICAvLyBvcHRpb25hbCBoZXJlIGJlY2F1c2UgdGhlIGFjY291bnRzLXBhc3N3b3JkIHBhY2thZ2UgZG9lcyBpdHMgb3duIHZhbGlkYXRpb24uXHJcbiAgICAgICAgLy8gVGhpcmQtcGFydHkgbG9naW4gcGFja2FnZXMgbWF5IG5vdCByZXF1aXJlIGVpdGhlci4gQWRqdXN0IHRoaXMgc2NoZW1hIGFzIG5lY2Vzc2FyeSBmb3IgeW91ciB1c2FnZS5cclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGVtYWlsczoge1xyXG4gICAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICAgIC8vIEZvciBhY2NvdW50cy1wYXNzd29yZCwgZWl0aGVyIGVtYWlscyBvciB1c2VybmFtZSBpcyByZXF1aXJlZCwgYnV0IG5vdCBib3RoLiBJdCBpcyBPSyB0byBtYWtlIHRoaXNcclxuICAgICAgICAvLyBvcHRpb25hbCBoZXJlIGJlY2F1c2UgdGhlIGFjY291bnRzLXBhc3N3b3JkIHBhY2thZ2UgZG9lcyBpdHMgb3duIHZhbGlkYXRpb24uXHJcbiAgICAgICAgLy8gVGhpcmQtcGFydHkgbG9naW4gcGFja2FnZXMgbWF5IG5vdCByZXF1aXJlIGVpdGhlci4gQWRqdXN0IHRoaXMgc2NoZW1hIGFzIG5lY2Vzc2FyeSBmb3IgeW91ciB1c2FnZS5cclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIFwiZW1haWxzLiRcIjoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdFxyXG4gICAgfSxcclxuICAgIFwiZW1haWxzLiQuYWRkcmVzc1wiOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcclxuICAgIH0sXHJcbiAgICBcImVtYWlscy4kLnZlcmlmaWVkXCI6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuXHJcbiAgICB9LFxyXG4gICAgLy8gVXNlIHRoaXMgcmVnaXN0ZXJlZF9lbWFpbHMgZmllbGQgaWYgeW91IGFyZSB1c2luZyBzcGxlbmRpZG86bWV0ZW9yLWFjY291bnRzLWVtYWlscy1maWVsZCAvIHNwbGVuZGlkbzptZXRlb3ItYWNjb3VudHMtbWVsZFxyXG4gICAgcmVnaXN0ZXJlZF9lbWFpbHM6IHtcclxuICAgICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgICdyZWdpc3RlcmVkX2VtYWlscy4kJzoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdCxcclxuICAgICAgICBibGFja2JveDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGNyZWF0ZWRBdDoge1xyXG4gICAgICAgIHR5cGU6IERhdGVcclxuICAgIH0sXHJcbiAgICBwcm9maWxlOiB7XHJcbiAgICAgICAgdHlwZTogVXNlclByb2ZpbGVTY2hlbWEsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0sXHJcbiAgICAvLyBNYWtlIHN1cmUgdGhpcyBzZXJ2aWNlcyBmaWVsZCBpcyBpbiB5b3VyIHNjaGVtYSBpZiB5b3UncmUgdXNpbmcgYW55IG9mIHRoZSBhY2NvdW50cyBwYWNrYWdlc1xyXG4gICAgc2VydmljZXM6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3QsXHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgICAgICAgYmxhY2tib3g6IHRydWVcclxuICAgIH0sXHJcbiAgICAvLyBBZGQgYHJvbGVzYCB0byB5b3VyIHNjaGVtYSBpZiB5b3UgdXNlIHRoZSBtZXRlb3Itcm9sZXMgcGFja2FnZS5cclxuICAgIC8vIE9wdGlvbiAxOiBPYmplY3QgdHlwZVxyXG4gICAgLy8gSWYgeW91IHNwZWNpZnkgdGhhdCB0eXBlIGFzIE9iamVjdCwgeW91IG11c3QgYWxzbyBzcGVjaWZ5IHRoZVxyXG4gICAgLy8gYFJvbGVzLkdMT0JBTF9HUk9VUGAgZ3JvdXAgd2hlbmV2ZXIgeW91IGFkZCBhIHVzZXIgdG8gYSByb2xlLlxyXG4gICAgLy8gRXhhbXBsZTpcclxuICAgIC8vIFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyh1c2VySWQsIFtcImFkbWluXCJdLCBSb2xlcy5HTE9CQUxfR1JPVVApO1xyXG4gICAgLy8gWW91IGNhbid0IG1peCBhbmQgbWF0Y2ggYWRkaW5nIHdpdGggYW5kIHdpdGhvdXQgYSBncm91cCBzaW5jZVxyXG4gICAgLy8geW91IHdpbGwgZmFpbCB2YWxpZGF0aW9uIGluIHNvbWUgY2FzZXMuXHJcbiAgICByb2xlczoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdCxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcclxuICAgICAgICBibGFja2JveDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIC8vIE9wdGlvbiAyOiBbU3RyaW5nXSB0eXBlXHJcbiAgICAvLyBJZiB5b3UgYXJlIHN1cmUgeW91IHdpbGwgbmV2ZXIgbmVlZCB0byB1c2Ugcm9sZSBncm91cHMsIHRoZW5cclxuICAgIC8vIHlvdSBjYW4gc3BlY2lmeSBbU3RyaW5nXSBhcyB0aGUgdHlwZVxyXG4gICAgcm9sZXM6IHtcclxuICAgICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSxcclxuICAgICdyb2xlcy4kJzoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgfSxcclxuICAgIC8vIEluIG9yZGVyIHRvIGF2b2lkIGFuICdFeGNlcHRpb24gaW4gc2V0SW50ZXJ2YWwgY2FsbGJhY2snIGZyb20gTWV0ZW9yXHJcbiAgICBoZWFydGJlYXQ6IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuTWV0ZW9yLnVzZXJzLmF0dGFjaFNjaGVtYShVc2VyU2NoZW1hKTsiLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuXHJcbmltcG9ydCAnLi9hcGkvdXNlcnMuanMnO1xyXG5pbXBvcnQgJy4vYXBpL2JvYXJkcyc7XHJcbmltcG9ydCAnLi9hcGkvbGlzdHMnXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XHJcblxyXG59KTsiXX0=
