/*global Proxy */

var handler = require("node-proxy-defaults");

module.exports = function(ctx, done) {
  var getter = {
  
    redirect: function() {
      ctx.redirect.apply(ctx, arguments);
      done(null, false);
    },
    
    setHeader: function(k, v) {
      ctx.set(k, v);
    },
    
    end: function(c) {
      if(c) {
        ctx.body = c;
      }
      done(null, false);
    },
    
    status: function(status) {
      ctx.status = status;
      return this;
    }
    
    //TODO jsonp, json, sned, sendfile, download
  };
  
  var setter = {
    statusCode: function(val) {
      ctx.status = val;
    }
  };
  
  return Proxy.create(handler(ctx.response, {
    get: function(receiver, name) {
      return getter[name] || ctx.response[name] || ctx.res[name] || ctx[name];
    },
    set: function(receiver, name, val) {
      if(setter[name]) {
        setter[name](val);
      } else {//proxy setter to original node resp
        ctx.res[name] = val;
      }
    }
  }), Object.getPrototypeOf(ctx.response));
};