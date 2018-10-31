var require = meteorInstall({"imports":{"api":{"links":{"server":{"publications.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/api/links/server/publications.js                                         //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Links;
module.link("../links.js", {
  Links(v) {
    Links = v;
  }

}, 1);
Meteor.publish('links.all', function () {
  return Links.find();
});
//////////////////////////////////////////////////////////////////////////////////////

}},"links.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/api/links/links.js                                                       //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
module.export({
  Links: () => Links
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const Links = new Mongo.Collection('links');
//////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/api/links/methods.js                                                     //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 1);
let Links;
module.link("./links.js", {
  Links(v) {
    Links = v;
  }

}, 2);
Meteor.methods({
  'links.insert'(title, url) {
    check(url, String);
    check(title, String);
    return Links.insert({
      url,
      title,
      createdAt: new Date()
    });
  }

});
//////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"both":{"index.js":function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/startup/both/index.js                                                    //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.
//////////////////////////////////////////////////////////////////////////////////////

}},"server":{"fixtures.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/startup/server/fixtures.js                                               //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Links;
module.link("../../api/links/links.js", {
  Links(v) {
    Links = v;
  }

}, 1);
Meteor.startup(() => {
  // if the Links collection is empty
  if (Links.find().count() === 0) {
    const data = [{
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/try',
      createdAt: new Date()
    }, {
      title: 'Follow the Guide',
      url: 'http://guide.meteor.com',
      createdAt: new Date()
    }, {
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
      createdAt: new Date()
    }, {
      title: 'Discussions',
      url: 'https://forums.meteor.com',
      createdAt: new Date()
    }];
    data.forEach(link => Links.insert(link));
  }
});
//////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/startup/server/index.js                                                  //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
module.link("./fixtures.js");
module.link("./register-api.js");
//////////////////////////////////////////////////////////////////////////////////////

},"register-api.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/startup/server/register-api.js                                           //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
module.link("../../api/links/methods.js");
module.link("../../api/links/server/publications.js");
//////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// server/main.js                                                                   //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
module.link("/imports/startup/server");
module.link("/imports/startup/both");
//////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});

require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvbGlua3Mvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvbGlua3MvbGlua3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xpbmtzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9ib3RoL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2ZpeHR1cmVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3JlZ2lzdGVyLWFwaS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21haW4uanMiXSwibmFtZXMiOlsiTWV0ZW9yIiwibW9kdWxlIiwibGluayIsInYiLCJMaW5rcyIsInB1Ymxpc2giLCJmaW5kIiwiZXhwb3J0IiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiY2hlY2siLCJtZXRob2RzIiwidGl0bGUiLCJ1cmwiLCJTdHJpbmciLCJpbnNlcnQiLCJjcmVhdGVkQXQiLCJEYXRlIiwic3RhcnR1cCIsImNvdW50IiwiZGF0YSIsImZvckVhY2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJQyxLQUFKO0FBQVVILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGFBQVosRUFBMEI7QUFBQ0UsT0FBSyxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsU0FBSyxHQUFDRCxDQUFOO0FBQVE7O0FBQWxCLENBQTFCLEVB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Q0FBYjtBQXVCQUcsUUFBSSxDQUFDQyxPQUFMLENBQWFuQixJQUFJLElBQUlFLEtBQUssQ0FBQ1csTUFBTixDQUFhYixJQUFiLENBQXJCO0FBQ0Q7QUFDRixDQTVCRCxFOzs7Ozs7Ozs7OztBQ0xBRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaO0FBQTZCRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxtQkFBWixFOzs7Ozs7Ozs7OztBQ0E3QkQsTUFBTSxDQUFDQyxJQUFQLENBQVksNEJBQVo7QUFBMENELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHdDQUFaLEU7Ozs7Ozs7Ozs7O0FDQTFDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWjtBQUF1Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksdUJBQVosRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQWxsIGxpbmtzLXJlbGF0ZWQgcHVibGljYXRpb25zXHJcblxyXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgTGlua3MgfSBmcm9tICcuLi9saW5rcy5qcyc7XHJcblxyXG5NZXRlb3IucHVibGlzaCgnbGlua3MuYWxsJywgZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBMaW5rcy5maW5kKCk7XHJcbn0pO1xyXG4iLCIvLyBEZWZpbml0aW9uIG9mIHRoZSBsaW5rcyBjb2xsZWN0aW9uXHJcblxyXG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XHJcblxyXG5leHBvcnQgY29uc3QgTGlua3MgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignbGlua3MnKTtcclxuIiwiLy8gTWV0aG9kcyByZWxhdGVkIHRvIGxpbmtzXHJcblxyXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xyXG5pbXBvcnQgeyBMaW5rcyB9IGZyb20gJy4vbGlua3MuanMnO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICdsaW5rcy5pbnNlcnQnKHRpdGxlLCB1cmwpIHtcclxuICAgIGNoZWNrKHVybCwgU3RyaW5nKTtcclxuICAgIGNoZWNrKHRpdGxlLCBTdHJpbmcpO1xyXG5cclxuICAgIHJldHVybiBMaW5rcy5pbnNlcnQoe1xyXG4gICAgICB1cmwsXHJcbiAgICAgIHRpdGxlLFxyXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXHJcbiAgICB9KTtcclxuICB9LFxyXG59KTtcclxuIiwiLy8gSW1wb3J0IG1vZHVsZXMgdXNlZCBieSBib3RoIGNsaWVudCBhbmQgc2VydmVyIHRocm91Z2ggYSBzaW5nbGUgaW5kZXggZW50cnkgcG9pbnRcclxuLy8gZS5nLiB1c2VyYWNjb3VudHMgY29uZmlndXJhdGlvbiBmaWxlLlxyXG4iLCIvLyBGaWxsIHRoZSBEQiB3aXRoIGV4YW1wbGUgZGF0YSBvbiBzdGFydHVwXHJcblxyXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgTGlua3MgfSBmcm9tICcuLi8uLi9hcGkvbGlua3MvbGlua3MuanMnO1xyXG5cclxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xyXG4gIC8vIGlmIHRoZSBMaW5rcyBjb2xsZWN0aW9uIGlzIGVtcHR5XHJcbiAgaWYgKExpbmtzLmZpbmQoKS5jb3VudCgpID09PSAwKSB7XHJcbiAgICBjb25zdCBkYXRhID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgdGl0bGU6ICdEbyB0aGUgVHV0b3JpYWwnLFxyXG4gICAgICAgIHVybDogJ2h0dHBzOi8vd3d3Lm1ldGVvci5jb20vdHJ5JyxcclxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0aXRsZTogJ0ZvbGxvdyB0aGUgR3VpZGUnLFxyXG4gICAgICAgIHVybDogJ2h0dHA6Ly9ndWlkZS5tZXRlb3IuY29tJyxcclxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0aXRsZTogJ1JlYWQgdGhlIERvY3MnLFxyXG4gICAgICAgIHVybDogJ2h0dHBzOi8vZG9jcy5tZXRlb3IuY29tJyxcclxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0aXRsZTogJ0Rpc2N1c3Npb25zJyxcclxuICAgICAgICB1cmw6ICdodHRwczovL2ZvcnVtcy5tZXRlb3IuY29tJyxcclxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGRhdGEuZm9yRWFjaChsaW5rID0+IExpbmtzLmluc2VydChsaW5rKSk7XHJcbiAgfVxyXG59KTtcclxuIiwiLy8gSW1wb3J0IHNlcnZlciBzdGFydHVwIHRocm91Z2ggYSBzaW5nbGUgaW5kZXggZW50cnkgcG9pbnRcclxuXHJcbmltcG9ydCAnLi9maXh0dXJlcy5qcyc7XHJcbmltcG9ydCAnLi9yZWdpc3Rlci1hcGkuanMnO1xyXG4iLCIvLyBSZWdpc3RlciB5b3VyIGFwaXMgaGVyZVxyXG5cclxuaW1wb3J0ICcuLi8uLi9hcGkvbGlua3MvbWV0aG9kcy5qcyc7XHJcbmltcG9ydCAnLi4vLi4vYXBpL2xpbmtzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xyXG4iLCIvLyBTZXJ2ZXIgZW50cnkgcG9pbnQsIGltcG9ydHMgYWxsIHNlcnZlciBjb2RlXHJcblxyXG5pbXBvcnQgJy9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyJztcclxuaW1wb3J0ICcvaW1wb3J0cy9zdGFydHVwL2JvdGgnO1xyXG4iXX0=
