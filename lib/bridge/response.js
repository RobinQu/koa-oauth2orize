/*global Proxy */

var handler = require("node-proxy-defaults");

module.exports = function(ctx, done) {
  var proto = {
  
    redirect: function() {
      ctx.redirect.apply(ctx, arguments);
      done(null, false);
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
  
  return Proxy.create(handler(ctx.response), proto);
};