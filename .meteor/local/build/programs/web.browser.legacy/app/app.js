var require = meteorInstall({"imports":{"ui":{"pages":{"App.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// imports/ui/pages/App.js                                                                                 //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return App;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var ReactDOM;
module.link("react-dom", {
  "default": function (v) {
    ReactDOM = v;
  }
}, 1);

var App =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(App, _Component);

  function App() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = App.prototype;

  _proto.render = function () {
    function render() {
      return React.createElement("main", null, React.createElement("section", {
        className: "section section-shaped section-lg"
      }, React.createElement("div", {
        className: "shape shape-style-1 bg-gradient-default"
      }, React.createElement("span", null), React.createElement("span", null), React.createElement("span", null), React.createElement("span", null), React.createElement("span", null), React.createElement("span", null), React.createElement("span", null), React.createElement("span", null)), React.createElement("div", {
        className: "container pt-lg-md"
      }, React.createElement("div", {
        className: "row justify-content-center"
      }, React.createElement("div", {
        className: "col-lg-5"
      }, React.createElement("div", {
        className: "card bg-secondary shadow border-0"
      }, React.createElement("div", {
        className: "card-header bg-white pb-5"
      }, React.createElement("div", {
        className: "text-muted text-center mb-3"
      }, React.createElement("small", null, "Sign in with")), React.createElement("div", {
        className: "btn-wrapper text-center"
      }, React.createElement("a", {
        href: "#",
        className: "btn btn-neutral btn-icon"
      }, React.createElement("span", {
        className: "btn-inner--icon"
      }, React.createElement("img", {
        src: "../assets/img/icons/common/google.svg"
      })), React.createElement("span", {
        className: "btn-inner--text"
      }, "Google")))), React.createElement("div", {
        className: "card-body px-lg-5 py-lg-5"
      }, React.createElement("div", {
        className: "text-center text-muted mb-4"
      }, React.createElement("small", null, "Or sign in with credentials")), React.createElement("form", {
        role: "form"
      }, React.createElement("div", {
        className: "form-group mb-3"
      }, React.createElement("div", {
        className: "input-group input-group-alternative"
      }, React.createElement("div", {
        className: "input-group-prepend"
      }, React.createElement("span", {
        className: "input-group-text"
      }, React.createElement("i", {
        className: "ni ni-email-83"
      }))), React.createElement("input", {
        className: "form-control",
        placeholder: "Email",
        type: "email"
      }))), React.createElement("div", {
        className: "form-group"
      }, React.createElement("div", {
        className: "input-group input-group-alternative"
      }, React.createElement("div", {
        className: "input-group-prepend"
      }, React.createElement("span", {
        className: "input-group-text"
      }, React.createElement("i", {
        className: "ni ni-lock-circle-open"
      }))), React.createElement("input", {
        className: "form-control",
        placeholder: "Password",
        type: "password"
      }))), React.createElement("div", {
        className: "custom-control custom-control-alternative custom-checkbox"
      }, React.createElement("input", {
        className: "custom-control-input",
        id: " customCheckLogin",
        type: "checkbox"
      }), React.createElement("label", {
        className: "custom-control-label",
        htmlFor: " customCheckLogin"
      }, React.createElement("span", null, "Remember me"))), React.createElement("div", {
        className: "text-center"
      }, React.createElement("button", {
        type: "button",
        className: "btn btn-primary my-4"
      }, "Sign in"))))), React.createElement("div", {
        className: "row mt-3"
      }, React.createElement("div", {
        className: "col-6"
      }, React.createElement("a", {
        href: "#",
        className: "text-light"
      }, React.createElement("small", null, "Forgot password?"))), React.createElement("div", {
        className: "col-6 text-right"
      }, React.createElement("a", {
        href: "#",
        className: "text-light"
      }, React.createElement("small", null, "Create new account")))))))));
    }

    return render;
  }();

  return App;
}(Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"client":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// client/main.js                                                                                          //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var render;
module.link("react-dom", {
  render: function (v) {
    render = v;
  }
}, 2);
var App;
module.link("../imports/ui/pages/App.js", {
  "default": function (v) {
    App = v;
  }
}, 3);
Meteor.startup(function () {
  render(React.createElement(App, null), document.getElementById('render-target'));
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".jsx",
    ".css",
    ".less"
  ]
});

require("/client/main.js");