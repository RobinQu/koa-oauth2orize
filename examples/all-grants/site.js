/**
 * Module dependencies.
 */
var passport = require("koa-passport")
  , compose = require("koa-compose")
  , login = require("koa-ensure-login");


exports.index = function*() {
  this.body = "OAuth 2.0 Server";
};

exports.loginForm = function*() {
  yield this.render("login");
};

exports.login = passport.authenticate("local", { successReturnToOrRedirect: "/", failureRedirect: "/login" });

exports.logout = function*() {
  this.req.logout();
  this.redirect("/");
};

exports.account = compose([
  login.ensureLoggedIn(),
  function(req, res) {
    res.render("account", { user: req.user });
  }
]);