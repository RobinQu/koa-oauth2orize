/*global Proxy */

var handler = require("node-proxy-defaults");

module.exports = function(ctx, done) {
  var mock = {
  
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
  
  return Proxy.create(handler(ctx.response, {
    get: function(receiver, name) {
      return mock[name] || ctx.response[name] || ctx[name];
    }
  }), Object.getPrototypeOf(ctx.response));
};