/*global Proxy */

var handler = require("node-proxy-defaults");

module.exports = function(ctx) {
  
  //delegate all read to `ctx.req`, `ctx.request or `ctx` itself
  //delegate all write to `ctx` itself
  return Proxy.create(handler(ctx, {
    get: function(receiver, key) {
      return ctx.req[key] || ctx.request[key] || ctx[key];
    }
  }));
  
};