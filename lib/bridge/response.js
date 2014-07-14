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
    }
  
  };
  
  return Proxy.create(handler(ctx.response), proto);
};