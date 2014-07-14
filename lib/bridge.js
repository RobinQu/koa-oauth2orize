var debug = require("debug")("bridge"),
    util = require("util");

var Bridge = function() {
  this.req = require("./request");
  this.res = require("./response");
};

Bridge.prototype.invoke = function(mws) {
  var i = 0, self = this;
  return function(done) {
    var ctx = this,
        req = self.req(ctx),
        res = self.res(ctx, done),
        next;
    
    next = function(e) {
      if(e) {
        debug(e);
        return done(e);
      }
      if(i === mws.length) {
        done();
      } else {
        mws[i].call(null, req, res, next);
        i++;
      }
    };
    next();
  };
  
};

Bridge.prototype.convert = function(mws) {
  if(!util.isArray(mws)) {
    mws = [mws];
  }
  var self = this;
  return function*(next) {
    var cont = self.invoke(mws);
    if(cont !== false) {
      yield next;
    }
  };
};

module.exports = Bridge;