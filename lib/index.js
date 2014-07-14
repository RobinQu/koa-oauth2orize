/*global Proxy */

var Wrapper = require("./wrapper"),
    handler = require("node-proxy-defaults"),
    oauth2orize = require("oauth2orize"),
    debug = require("debug")("koa-oauth2orize"),
    _ = require("lodash");


var createServer = function() {
  debug("create");
  var server = oauth2orize.createServer(),
      wrapper = new Wrapper(server);
  return Proxy.create(handler(server, {
    get: function(receiver, name) {
      return wrapper[name] || server[name];
    }
  }));
  
};

exports = module.exports = createServer;

_.extend(exports, oauth2orize);

exports.createServer = createServer;

