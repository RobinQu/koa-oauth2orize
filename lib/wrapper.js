var Bridge = require("./bridge"),
    debug = require("debug")("wrapper");

var Wrapper = function(server) {
  this.server = server;
  this.bridge = new Bridge();
  
  //methods that return middleware
  "authroize authorization decision token errorHandler".split(/\s*/).forEach(function(name) {
    this[name] = function() {
      debug(name);
      var mw = this.server.apply(this.server, arguments);
      return this.bridge.convert(mw);
    };
  }, this);
};

module.exports = Wrapper;