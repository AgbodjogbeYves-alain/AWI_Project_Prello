(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"johanbrook:publication-collector":{"publication-collector.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/johanbrook_publication-collector/publication-collector.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  PublicationCollector: () => PublicationCollector
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Match, check;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  },

  check(v) {
    check = v;
  }

}, 1);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 2);
let MongoID;
module.link("meteor/mongo-id", {
  MongoID(v) {
    MongoID = v;
  }

}, 3);
let EventEmitter;
module.link("events", {
  EventEmitter(v) {
    EventEmitter = v;
  }

}, 4);
const validMongoId = Match.OneOf(String, Mongo.ObjectID);
/*
  This class describes something like Subscription in
  meteor/meteor/packages/ddp/livedata_server.js, but instead of sending
  over a socket it just collects data.
*/

class PublicationCollector extends EventEmitter {
  constructor(opts = {}) {
    super();
    check(opts.userId, Match.Optional(String));
    check(opts.delayInMs, Match.Optional(Match.Integer)); // Object where the keys are collection names, and then the keys are _ids

    this._documents = {};

    this.unblock = () => {};

    this.userId = opts.userId;
    this._idFilter = {
      idStringify: MongoID.idStringify,
      idParse: MongoID.idParse
    };

    this._isDeactivated = () => {};

    this.delayInMs = opts.delayInMs;
  }

  collect(name, ...args) {
    let callback; // extracts optional callback from latest argument

    if (_.isFunction(args[args.length - 1])) {
      callback = args.pop();
    }

    const handler = Meteor.server.publish_handlers[name];

    if (!handler) {
      throw new Error(`PublicationCollector: Couldn't find publication "${name}"! Did you misspell it?`);
    }

    return new Promise((resolve, reject) => {
      const done = (...res) => {
        callback && callback(...res);
        resolve(...res);
      };

      const completeCollecting = collections => {
        try {
          done(collections);
        } finally {
          // stop the subscription
          this.stop();
        }
      }; // adds a one time listener function for the "ready" event


      this.once('ready', collections => {
        if (this.delayInMs) {
          Meteor.setTimeout(() => {
            // collections is out of date, so we need to regenerate
            collections = this._generateResponse();
            completeCollecting(collections);
          }, this.delayInMs);
        } else {
          // immediately complete
          completeCollecting(collections);
        }
      });
      const result = handler.call(this, ...args);

      this._publishHandlerResult(result);
    });
  }
  /**
   * Reproduces "_publishHandlerResult" processing
   * @see {@link https://github.com/meteor/meteor/blob/master/packages/ddp-server/livedata_server.js#L1045}
   */


  _publishHandlerResult(res) {
    const cursors = []; // publication handlers can return a collection cursor, an array of cursors or nothing.

    if (this._isCursor(res)) {
      cursors.push(res);
    } else if (Array.isArray(res)) {
      // check all the elements are cursors
      const areCursors = res.reduce((valid, cur) => valid && this._isCursor(cur), true);

      if (!areCursors) {
        this.error(new Error('PublicationCollector: Publish function returned an array of non-Cursors'));
        return;
      } // find duplicate collection names


      const collectionNames = {};

      for (let i = 0; i < res.length; ++i) {
        const collectionName = res[i]._getCollectionName();

        if ({}.hasOwnProperty.call(collectionNames, collectionName)) {
          this.error(new Error(`PublicationCollector: Publish function returned multiple cursors for collection ${collectionName}`));
          return;
        }

        collectionNames[collectionName] = true;
        cursors.push(res[i]);
      }
    } else if (res) {
      // truthy values other than cursors or arrays are probably a
      // user mistake (possible returning a Mongo document via, say,
      // `coll.findOne()`).
      this.error(new Error('PublicationCollector: Publish function can only return a Cursor or an array of Cursors'));
    }

    if (cursors.length > 0) {
      try {
        // for each cursor we call _publishCursor method which starts observing the cursor and
        // publishes the results.
        cursors.forEach(cur => {
          this._ensureCollectionInRes(cur._getCollectionName());

          cur._publishCursor(this);
        });
      } catch (e) {
        this.error(e);
        return;
      } // mark subscription as ready (_publishCursor does NOT call ready())


      this.ready();
    }
  }

  added(collection, id, fields) {
    check(collection, String);
    check(id, validMongoId);

    this._ensureCollectionInRes(collection); // Make sure to ignore the _id in fields


    const addedDocument = _.extend({
      _id: id
    }, _.omit(fields, '_id'));

    this._documents[collection][id] = addedDocument;
  }

  changed(collection, id, fields) {
    check(collection, String);
    check(id, validMongoId);

    this._ensureCollectionInRes(collection);

    const existingDocument = this._documents[collection][id];

    const fieldsNoId = _.omit(fields, '_id');

    if (existingDocument) {
      _.extend(existingDocument, fieldsNoId); // Delete all keys that were undefined in fields (except _id)


      _.forEach(fields, (value, key) => {
        if (value === undefined) {
          delete existingDocument[key];
        }
      });
    }
  }

  removed(collection, id) {
    check(collection, String);
    check(id, validMongoId);

    this._ensureCollectionInRes(collection);

    delete this._documents[collection][id];

    if (_.isEmpty(this._documents[collection])) {
      delete this._documents[collection];
    }
  }

  ready() {
    // Synchronously calls each of the listeners registered for the "ready" event
    this.emit('ready', this._generateResponse());
  }

  onStop(callback) {
    // Adds a one time listener function for the "stop" event
    this.once('stop', callback);
  }

  stop() {
    // Synchronously calls each of the listeners registered for the "stop" event
    this.emit('stop');
  }

  error(error) {
    throw error;
  }

  _isCursor(c) {
    return c && c._publishCursor;
  }

  _ensureCollectionInRes(collection) {
    this._documents[collection] = this._documents[collection] || {};
  }

  _generateResponse() {
    const output = {};

    _.forEach(this._documents, (documents, collectionName) => {
      output[collectionName] = _.values(documents);
    });

    return output;
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/johanbrook:publication-collector/publication-collector.js");

/* Exports */
Package._define("johanbrook:publication-collector", exports);

})();

//# sourceURL=meteor://💻app/packages/johanbrook_publication-collector.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvam9oYW5icm9vazpwdWJsaWNhdGlvbi1jb2xsZWN0b3IvcHVibGljYXRpb24tY29sbGVjdG9yLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIlB1YmxpY2F0aW9uQ29sbGVjdG9yIiwiTWV0ZW9yIiwibGluayIsInYiLCJNYXRjaCIsImNoZWNrIiwiTW9uZ28iLCJNb25nb0lEIiwiRXZlbnRFbWl0dGVyIiwidmFsaWRNb25nb0lkIiwiT25lT2YiLCJTdHJpbmciLCJPYmplY3RJRCIsImNvbnN0cnVjdG9yIiwib3B0cyIsInVzZXJJZCIsIk9wdGlvbmFsIiwiZGVsYXlJbk1zIiwiSW50ZWdlciIsIl9kb2N1bWVudHMiLCJ1bmJsb2NrIiwiX2lkRmlsdGVyIiwiaWRTdHJpbmdpZnkiLCJpZFBhcnNlIiwiX2lzRGVhY3RpdmF0ZWQiLCJjb2xsZWN0IiwibmFtZSIsImFyZ3MiLCJjYWxsYmFjayIsIl8iLCJpc0Z1bmN0aW9uIiwibGVuZ3RoIiwicG9wIiwiaGFuZGxlciIsInNlcnZlciIsInB1Ymxpc2hfaGFuZGxlcnMiLCJFcnJvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZG9uZSIsInJlcyIsImNvbXBsZXRlQ29sbGVjdGluZyIsImNvbGxlY3Rpb25zIiwic3RvcCIsIm9uY2UiLCJzZXRUaW1lb3V0IiwiX2dlbmVyYXRlUmVzcG9uc2UiLCJyZXN1bHQiLCJjYWxsIiwiX3B1Ymxpc2hIYW5kbGVyUmVzdWx0IiwiY3Vyc29ycyIsIl9pc0N1cnNvciIsInB1c2giLCJBcnJheSIsImlzQXJyYXkiLCJhcmVDdXJzb3JzIiwicmVkdWNlIiwidmFsaWQiLCJjdXIiLCJlcnJvciIsImNvbGxlY3Rpb25OYW1lcyIsImkiLCJjb2xsZWN0aW9uTmFtZSIsIl9nZXRDb2xsZWN0aW9uTmFtZSIsImhhc093blByb3BlcnR5IiwiZm9yRWFjaCIsIl9lbnN1cmVDb2xsZWN0aW9uSW5SZXMiLCJfcHVibGlzaEN1cnNvciIsImUiLCJyZWFkeSIsImFkZGVkIiwiY29sbGVjdGlvbiIsImlkIiwiZmllbGRzIiwiYWRkZWREb2N1bWVudCIsImV4dGVuZCIsIl9pZCIsIm9taXQiLCJjaGFuZ2VkIiwiZXhpc3RpbmdEb2N1bWVudCIsImZpZWxkc05vSWQiLCJ2YWx1ZSIsImtleSIsInVuZGVmaW5lZCIsInJlbW92ZWQiLCJpc0VtcHR5IiwiZW1pdCIsIm9uU3RvcCIsImMiLCJvdXRwdXQiLCJkb2N1bWVudHMiLCJ2YWx1ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxzQkFBb0IsRUFBQyxNQUFJQTtBQUExQixDQUFkO0FBQStELElBQUlDLE1BQUo7QUFBV0gsTUFBTSxDQUFDSSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRCxRQUFNLENBQUNFLENBQUQsRUFBRztBQUFDRixVQUFNLEdBQUNFLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSixFQUFVQyxLQUFWO0FBQWdCUCxNQUFNLENBQUNJLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLE9BQUssQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFNBQUssR0FBQ0QsQ0FBTjtBQUFRLEdBQWxCOztBQUFtQkUsT0FBSyxDQUFDRixDQUFELEVBQUc7QUFBQ0UsU0FBSyxHQUFDRixDQUFOO0FBQVE7O0FBQXBDLENBQTNCLEVBQWlFLENBQWpFO0FBQW9FLElBQUlHLEtBQUo7QUFBVVIsTUFBTSxDQUFDSSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDSSxPQUFLLENBQUNILENBQUQsRUFBRztBQUFDRyxTQUFLLEdBQUNILENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSUksT0FBSjtBQUFZVCxNQUFNLENBQUNJLElBQVAsQ0FBWSxpQkFBWixFQUE4QjtBQUFDSyxTQUFPLENBQUNKLENBQUQsRUFBRztBQUFDSSxXQUFP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QUFMLENBQVUsT0FBVixFQUFtQixLQUFLeEMsaUJBQUwsRUFBbkI7QUFDRDs7QUFFRHlDLFFBQU0sQ0FBQzVELFFBQUQsRUFBVztBQUNmO0FBQ0EsU0FBS2lCLElBQUwsQ0FBVSxNQUFWLEVBQWtCakIsUUFBbEI7QUFDRDs7QUFFRGdCLE1BQUksR0FBRztBQUNMO0FBQ0EsU0FBSzJDLElBQUwsQ0FBVSxNQUFWO0FBQ0Q7O0FBRUQzQixPQUFLLENBQUNBLEtBQUQsRUFBUTtBQUNYLFVBQU1BLEtBQU47QUFDRDs7QUFFRFIsV0FBUyxDQUFDcUMsQ0FBRCxFQUFJO0FBQ1gsV0FBT0EsQ0FBQyxJQUFJQSxDQUFDLENBQUNyQixjQUFkO0FBQ0Q7O0FBRURELHdCQUFzQixDQUFDSyxVQUFELEVBQWE7QUFDakMsU0FBS3JELFVBQUwsQ0FBZ0JxRCxVQUFoQixJQUE4QixLQUFLckQsVUFBTCxDQUFnQnFELFVBQWhCLEtBQStCLEVBQTdEO0FBQ0Q7O0FBRUR6QixtQkFBaUIsR0FBRztBQUNsQixVQUFNMkMsTUFBTSxHQUFHLEVBQWY7O0FBRUE3RCxLQUFDLENBQUNxQyxPQUFGLENBQVUsS0FBSy9DLFVBQWYsRUFBMkIsQ0FBQ3dFLFNBQUQsRUFBWTVCLGNBQVosS0FBK0I7QUFDeEQyQixZQUFNLENBQUMzQixjQUFELENBQU4sR0FBeUJsQyxDQUFDLENBQUMrRCxNQUFGLENBQVNELFNBQVQsQ0FBekI7QUFDRCxLQUZEOztBQUlBLFdBQU9ELE1BQVA7QUFDRDs7QUE1TW9ELEMiLCJmaWxlIjoiL3BhY2thZ2VzL2pvaGFuYnJvb2tfcHVibGljYXRpb24tY29sbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNYXRjaCwgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgTW9uZ29JRCB9IGZyb20gJ21ldGVvci9tb25nby1pZCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5jb25zdCB2YWxpZE1vbmdvSWQgPSBNYXRjaC5PbmVPZihTdHJpbmcsIE1vbmdvLk9iamVjdElEKTtcblxuLypcbiAgVGhpcyBjbGFzcyBkZXNjcmliZXMgc29tZXRoaW5nIGxpa2UgU3Vic2NyaXB0aW9uIGluXG4gIG1ldGVvci9tZXRlb3IvcGFja2FnZXMvZGRwL2xpdmVkYXRhX3NlcnZlci5qcywgYnV0IGluc3RlYWQgb2Ygc2VuZGluZ1xuICBvdmVyIGEgc29ja2V0IGl0IGp1c3QgY29sbGVjdHMgZGF0YS5cbiovXG5leHBvcnQgY2xhc3MgUHVibGljYXRpb25Db2xsZWN0b3IgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgY2hlY2sob3B0cy51c2VySWQsIE1hdGNoLk9wdGlvbmFsKFN0cmluZykpO1xuICAgIGNoZWNrKG9wdHMuZGVsYXlJbk1zLCBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSk7XG5cbiAgICAvLyBPYmplY3Qgd2hlcmUgdGhlIGtleXMgYXJlIGNvbGxlY3Rpb24gbmFtZXMsIGFuZCB0aGVuIHRoZSBrZXlzIGFyZSBfaWRzXG4gICAgdGhpcy5fZG9jdW1lbnRzID0ge307XG4gICAgdGhpcy51bmJsb2NrID0gKCkgPT4ge307XG4gICAgdGhpcy51c2VySWQgPSBvcHRzLnVzZXJJZDtcbiAgICB0aGlzLl9pZEZpbHRlciA9IHtcbiAgICAgIGlkU3RyaW5naWZ5OiBNb25nb0lELmlkU3RyaW5naWZ5LFxuICAgICAgaWRQYXJzZTogTW9uZ29JRC5pZFBhcnNlXG4gICAgfTtcbiAgICB0aGlzLl9pc0RlYWN0aXZhdGVkID0gKCkgPT4ge307XG5cbiAgICB0aGlzLmRlbGF5SW5NcyA9IG9wdHMuZGVsYXlJbk1zO1xuICB9XG5cbiAgY29sbGVjdChuYW1lLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNhbGxiYWNrO1xuICAgIC8vIGV4dHJhY3RzIG9wdGlvbmFsIGNhbGxiYWNrIGZyb20gbGF0ZXN0IGFyZ3VtZW50XG4gICAgaWYgKF8uaXNGdW5jdGlvbihhcmdzW2FyZ3MubGVuZ3RoIC0gMV0pKSB7XG4gICAgICBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlciA9IE1ldGVvci5zZXJ2ZXIucHVibGlzaF9oYW5kbGVyc1tuYW1lXTtcblxuICAgIGlmICghaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQdWJsaWNhdGlvbkNvbGxlY3RvcjogQ291bGRuJ3QgZmluZCBwdWJsaWNhdGlvbiBcIiR7bmFtZX1cIiEgRGlkIHlvdSBtaXNzcGVsbCBpdD9gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBjb25zdCBkb25lID0gKC4uLnJlcykgPT4ge1xuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayguLi5yZXMpO1xuICAgICAgICByZXNvbHZlKC4uLnJlcyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBjb21wbGV0ZUNvbGxlY3RpbmcgPSAoY29sbGVjdGlvbnMpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkb25lKGNvbGxlY3Rpb25zKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAvLyBzdG9wIHRoZSBzdWJzY3JpcHRpb25cbiAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gYWRkcyBhIG9uZSB0aW1lIGxpc3RlbmVyIGZ1bmN0aW9uIGZvciB0aGUgXCJyZWFkeVwiIGV2ZW50XG4gICAgICB0aGlzLm9uY2UoJ3JlYWR5JywgKGNvbGxlY3Rpb25zKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmRlbGF5SW5Ncykge1xuICAgICAgICAgIE1ldGVvci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbGxlY3Rpb25zIGlzIG91dCBvZiBkYXRlLCBzbyB3ZSBuZWVkIHRvIHJlZ2VuZXJhdGVcbiAgICAgICAgICAgIGNvbGxlY3Rpb25zID0gdGhpcy5fZ2VuZXJhdGVSZXNwb25zZSgpO1xuICAgICAgICAgICAgY29tcGxldGVDb2xsZWN0aW5nKGNvbGxlY3Rpb25zKTtcbiAgICAgICAgICB9LCB0aGlzLmRlbGF5SW5Ncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gaW1tZWRpYXRlbHkgY29tcGxldGVcbiAgICAgICAgICBjb21wbGV0ZUNvbGxlY3RpbmcoY29sbGVjdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gaGFuZGxlci5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xuXG4gICAgICB0aGlzLl9wdWJsaXNoSGFuZGxlclJlc3VsdChyZXN1bHQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJvZHVjZXMgXCJfcHVibGlzaEhhbmRsZXJSZXN1bHRcIiBwcm9jZXNzaW5nXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL2RkcC1zZXJ2ZXIvbGl2ZWRhdGFfc2VydmVyLmpzI0wxMDQ1fVxuICAgKi9cbiAgX3B1Ymxpc2hIYW5kbGVyUmVzdWx0KHJlcykge1xuICAgIGNvbnN0IGN1cnNvcnMgPSBbXTtcblxuICAgIC8vIHB1YmxpY2F0aW9uIGhhbmRsZXJzIGNhbiByZXR1cm4gYSBjb2xsZWN0aW9uIGN1cnNvciwgYW4gYXJyYXkgb2YgY3Vyc29ycyBvciBub3RoaW5nLlxuICAgIGlmICh0aGlzLl9pc0N1cnNvcihyZXMpKSB7XG4gICAgICBjdXJzb3JzLnB1c2gocmVzKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmVzKSkge1xuICAgICAgLy8gY2hlY2sgYWxsIHRoZSBlbGVtZW50cyBhcmUgY3Vyc29yc1xuICAgICAgY29uc3QgYXJlQ3Vyc29ycyA9IHJlcy5yZWR1Y2UoKHZhbGlkLCBjdXIpID0+IHZhbGlkICYmIHRoaXMuX2lzQ3Vyc29yKGN1ciksIHRydWUpO1xuICAgICAgaWYgKCFhcmVDdXJzb3JzKSB7XG4gICAgICAgIHRoaXMuZXJyb3IobmV3IEVycm9yKCdQdWJsaWNhdGlvbkNvbGxlY3RvcjogUHVibGlzaCBmdW5jdGlvbiByZXR1cm5lZCBhbiBhcnJheSBvZiBub24tQ3Vyc29ycycpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gZmluZCBkdXBsaWNhdGUgY29sbGVjdGlvbiBuYW1lc1xuICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWVzID0ge307XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IHJlc1tpXS5fZ2V0Q29sbGVjdGlvbk5hbWUoKTtcbiAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoY29sbGVjdGlvbk5hbWVzLCBjb2xsZWN0aW9uTmFtZSkpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBQdWJsaWNhdGlvbkNvbGxlY3RvcjogUHVibGlzaCBmdW5jdGlvbiByZXR1cm5lZCBtdWx0aXBsZSBjdXJzb3JzIGZvciBjb2xsZWN0aW9uICR7Y29sbGVjdGlvbk5hbWV9YFxuICAgICAgICAgICkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb2xsZWN0aW9uTmFtZXNbY29sbGVjdGlvbk5hbWVdID0gdHJ1ZTtcbiAgICAgICAgY3Vyc29ycy5wdXNoKHJlc1tpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZXMpIHtcbiAgICAgIC8vIHRydXRoeSB2YWx1ZXMgb3RoZXIgdGhhbiBjdXJzb3JzIG9yIGFycmF5cyBhcmUgcHJvYmFibHkgYVxuICAgICAgLy8gdXNlciBtaXN0YWtlIChwb3NzaWJsZSByZXR1cm5pbmcgYSBNb25nbyBkb2N1bWVudCB2aWEsIHNheSxcbiAgICAgIC8vIGBjb2xsLmZpbmRPbmUoKWApLlxuICAgICAgdGhpcy5lcnJvcihuZXcgRXJyb3IoJ1B1YmxpY2F0aW9uQ29sbGVjdG9yOiBQdWJsaXNoIGZ1bmN0aW9uIGNhbiBvbmx5IHJldHVybiBhIEN1cnNvciBvciBhbiBhcnJheSBvZiBDdXJzb3JzJykpO1xuICAgIH1cblxuICAgIGlmIChjdXJzb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGZvciBlYWNoIGN1cnNvciB3ZSBjYWxsIF9wdWJsaXNoQ3Vyc29yIG1ldGhvZCB3aGljaCBzdGFydHMgb2JzZXJ2aW5nIHRoZSBjdXJzb3IgYW5kXG4gICAgICAgIC8vIHB1Ymxpc2hlcyB0aGUgcmVzdWx0cy5cbiAgICAgICAgY3Vyc29ycy5mb3JFYWNoKChjdXIpID0+IHtcbiAgICAgICAgICB0aGlzLl9lbnN1cmVDb2xsZWN0aW9uSW5SZXMoY3VyLl9nZXRDb2xsZWN0aW9uTmFtZSgpKTtcbiAgICAgICAgICBjdXIuX3B1Ymxpc2hDdXJzb3IodGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLmVycm9yKGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIG1hcmsgc3Vic2NyaXB0aW9uIGFzIHJlYWR5IChfcHVibGlzaEN1cnNvciBkb2VzIE5PVCBjYWxsIHJlYWR5KCkpXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICB9XG5cbiAgYWRkZWQoY29sbGVjdGlvbiwgaWQsIGZpZWxkcykge1xuICAgIGNoZWNrKGNvbGxlY3Rpb24sIFN0cmluZyk7XG4gICAgY2hlY2soaWQsIHZhbGlkTW9uZ29JZCk7XG5cbiAgICB0aGlzLl9lbnN1cmVDb2xsZWN0aW9uSW5SZXMoY29sbGVjdGlvbik7XG5cbiAgICAvLyBNYWtlIHN1cmUgdG8gaWdub3JlIHRoZSBfaWQgaW4gZmllbGRzXG4gICAgY29uc3QgYWRkZWREb2N1bWVudCA9IF8uZXh0ZW5kKHtfaWQ6IGlkfSwgXy5vbWl0KGZpZWxkcywgJ19pZCcpKTtcbiAgICB0aGlzLl9kb2N1bWVudHNbY29sbGVjdGlvbl1baWRdID0gYWRkZWREb2N1bWVudDtcbiAgfVxuXG4gIGNoYW5nZWQoY29sbGVjdGlvbiwgaWQsIGZpZWxkcykge1xuICAgIGNoZWNrKGNvbGxlY3Rpb24sIFN0cmluZyk7XG4gICAgY2hlY2soaWQsIHZhbGlkTW9uZ29JZCk7XG5cbiAgICB0aGlzLl9lbnN1cmVDb2xsZWN0aW9uSW5SZXMoY29sbGVjdGlvbik7XG5cbiAgICBjb25zdCBleGlzdGluZ0RvY3VtZW50ID0gdGhpcy5fZG9jdW1lbnRzW2NvbGxlY3Rpb25dW2lkXTtcbiAgICBjb25zdCBmaWVsZHNOb0lkID0gXy5vbWl0KGZpZWxkcywgJ19pZCcpO1xuXG4gICAgaWYgKGV4aXN0aW5nRG9jdW1lbnQpIHtcbiAgICAgIF8uZXh0ZW5kKGV4aXN0aW5nRG9jdW1lbnQsIGZpZWxkc05vSWQpO1xuXG4gICAgICAvLyBEZWxldGUgYWxsIGtleXMgdGhhdCB3ZXJlIHVuZGVmaW5lZCBpbiBmaWVsZHMgKGV4Y2VwdCBfaWQpXG4gICAgICBfLmZvckVhY2goZmllbGRzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRlbGV0ZSBleGlzdGluZ0RvY3VtZW50W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZWQoY29sbGVjdGlvbiwgaWQpIHtcbiAgICBjaGVjayhjb2xsZWN0aW9uLCBTdHJpbmcpO1xuICAgIGNoZWNrKGlkLCB2YWxpZE1vbmdvSWQpO1xuXG4gICAgdGhpcy5fZW5zdXJlQ29sbGVjdGlvbkluUmVzKGNvbGxlY3Rpb24pO1xuXG4gICAgZGVsZXRlIHRoaXMuX2RvY3VtZW50c1tjb2xsZWN0aW9uXVtpZF07XG5cbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMuX2RvY3VtZW50c1tjb2xsZWN0aW9uXSkpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9kb2N1bWVudHNbY29sbGVjdGlvbl07XG4gICAgfVxuICB9XG5cbiAgcmVhZHkoKSB7XG4gICAgLy8gU3luY2hyb25vdXNseSBjYWxscyBlYWNoIG9mIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgdGhlIFwicmVhZHlcIiBldmVudFxuICAgIHRoaXMuZW1pdCgncmVhZHknLCB0aGlzLl9nZW5lcmF0ZVJlc3BvbnNlKCkpO1xuICB9XG5cbiAgb25TdG9wKGNhbGxiYWNrKSB7XG4gICAgLy8gQWRkcyBhIG9uZSB0aW1lIGxpc3RlbmVyIGZ1bmN0aW9uIGZvciB0aGUgXCJzdG9wXCIgZXZlbnRcbiAgICB0aGlzLm9uY2UoJ3N0b3AnLCBjYWxsYmFjayk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIC8vIFN5bmNocm9ub3VzbHkgY2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIHRoZSBcInN0b3BcIiBldmVudFxuICAgIHRoaXMuZW1pdCgnc3RvcCcpO1xuICB9XG5cbiAgZXJyb3IoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuXG4gIF9pc0N1cnNvcihjKSB7XG4gICAgcmV0dXJuIGMgJiYgYy5fcHVibGlzaEN1cnNvcjtcbiAgfVxuXG4gIF9lbnN1cmVDb2xsZWN0aW9uSW5SZXMoY29sbGVjdGlvbikge1xuICAgIHRoaXMuX2RvY3VtZW50c1tjb2xsZWN0aW9uXSA9IHRoaXMuX2RvY3VtZW50c1tjb2xsZWN0aW9uXSB8fCB7fTtcbiAgfVxuXG4gIF9nZW5lcmF0ZVJlc3BvbnNlKCkge1xuICAgIGNvbnN0IG91dHB1dCA9IHt9O1xuXG4gICAgXy5mb3JFYWNoKHRoaXMuX2RvY3VtZW50cywgKGRvY3VtZW50cywgY29sbGVjdGlvbk5hbWUpID0+IHtcbiAgICAgIG91dHB1dFtjb2xsZWN0aW9uTmFtZV0gPSBfLnZhbHVlcyhkb2N1bWVudHMpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxufVxuIl19
