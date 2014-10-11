var Bridge = require("./bridge"),
    debug = require("debug")("koa-oauth2orize:wrapper");

var Wrapper = function(server) {
  this.server = server;
  this.bridge = new Bridge();
  
  //methods that return middleware
  "authorize authorization decision token".split(/\s+/).forEach(function(name) {
    debug("convert method %s", name);
    this[name] = function() {
      debug("run wrapped method %s", name);
      var mw = this.server[name].apply(this.server, arguments);
      return this.bridge.convert(mw);
    };
  }, this);
  
  
  //error handler should try/catch
  this.errorHandler = function() {
    debug("run wrapped error handler middleware");
    var mw = this.server.errorHandler.apply(this.server, arguments);
    return this.bridge.convertAsErrorHandler(mw);
  };
};

module.exports = Wrapper;
