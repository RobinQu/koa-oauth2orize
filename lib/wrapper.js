var Bridge = require("./bridge"),
    debug = require("debug")("koa-oauth2orize:wrapper");

var Wrapper = function(server) {
  this.server = server;
  this.bridge = new Bridge();
  
  //methods that return middleware
  "authroize authorization decision token errorHandler".split(/\s+/).forEach(function(name) {
    debug("convert method %s", name);
    this[name] = function() {
      debug("run wrapped method %s", name);
      var mw = this.server[name].apply(this.server, arguments);
      return this.bridge.convert(mw);
    };
  }, this);
};

module.exports = Wrapper;