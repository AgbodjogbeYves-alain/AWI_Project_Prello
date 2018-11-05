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

},"oauth2.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// api/oauth2.js                                                                                          //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
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
  "users.signUp"(_ref) {
    let {
      lastname,
      firstname,
      email,
      password
    } = _ref;
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

require("/api/Utils/boardUtils.js");
require("/api/boards.js");
require("/api/lists.js");
require("/api/oauth2.js");
require("/api/teams.js");
require("/api/users.js");
require("/models/BoardUser.js");
require("/models/Boards.js");
require("/models/Card.js");
require("/models/List.js");
require("/models/Team.js");
require("/models/TeamMembers.js");
require("/models/Users.js");
require("/main.js");