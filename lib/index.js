var Wrapper = require("./wrapper"),
    handler = require("node-proxy-defaults"),
    oauth2orize = require("oauth2orize"),
    _ = require("lodash");


var createServer = function() {
  var server = oauth2orize.createServer(),
      wrapper = new Wrapper(server);
  var proxy = Proxy.create(handler(server1, {
    get: function(receiver, name) {
      return wrapper[name] || server[name];
    }
  }));
  
};

exports = module.exports = createServer;

exports.createServer = createServer;

_.extend(exports, oauth2orize);