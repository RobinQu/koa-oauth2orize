var debug = require("debug")("bridge"),
    util = require("util");

var Bridge = function() {
  this.req = require("./request");
  this.res = require("./response");
};

Bridge.prototype.invoke = function(mws) {
  var i = 0, self = this;
  return function(done) {
    debug("invoke connect middlewares %s", mws.length);
    var ctx = this,
        req = self.req(ctx),
        res = self.res(ctx, done);
    
    function next(e) {
      if(e) {
        return done(e);
      }
      if(i === mws.length) {
        done();
      } else {
        try {
          mws[i++].call(null, req, res, next);
        } catch(e) {
          next(e);
        }
      }
    }
    next();
  };
  
};

Bridge.prototype.convert = function(mws) {
  if(!util.isArray(mws)) {
    mws = [mws];
  }
  var self = this;
  return function*(next) {
    var cont = yield self.invoke(mws);
    if(cont !== false) {
      yield next;
    }
  };
};

module.exports = Bridge;