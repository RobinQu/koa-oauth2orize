var debug = require("debug")("bridge"),
    util = require("util");

var Bridge = function() {
  this.req = require("./request");
  this.res = require("./response");
};

Bridge.prototype.invoke = function(mws) {
  var i = 0, self = this;
  return function(done) {
    debug("invoke connect %s middleware(s)", mws.length);
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
    debug("invoke finished, should yield next? %s", cont);
    if(cont !== false) {
      yield next;
    }
  };
};

Bridge.prototype.convertAsErrorHandler = function(mw) {
  var self = this,
      _errorHandler;
      
  _errorHandler = function(e) {
    return function(done) {
      debug("invoke middleware as errorHandler");
      var ctx = this,
          req = self.req(ctx),
          res = self.res(ctx, done);
      mw.call(null, e, req, res, done);
    };
  };
  
  return function*(next) {
    try {
      yield next;
    } catch(e) {
      yield _errorHandler(e);
    }
  };
};

module.exports = Bridge;