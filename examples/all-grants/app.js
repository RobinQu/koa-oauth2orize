/**
 * Module dependencies.
 */
var koa = require("koa")
  , passport = require("koa-passport")
  , site = require("./site")
  , oauth2 = require("./oauth2")
  , user = require("./user")
  , client = require("./client")
  , render = require("koa-ejs")
  , path = require("path")
  , router = require("koa-router")
  , util = require("util");
  
  
// app configuration
  
var app = koa();
app.use(require("koa-bodyparser")());
app.keys = ["i'm a secret"];
render(app, {
  root: path.join(__dirname, "views"),
  layout: "layout",
  viewExt: ".ejs"
});

app.use(passport.initialize());
app.use(passport.session());
app.use(router(app));


// Passport configuration

require("./auth");


app.get("/", site.index);
app.get("/login", site.loginForm);
app.post("/login", site.login);
app.get("/logout", site.logout);
app.get("/account", site.account);

app.get("/dialog/authorize", oauth2.authorization);
app.post("/dialog/authorize/decision", oauth2.decision);
app.post("/oauth/token", oauth2.token);

app.get("/api/userinfo", user.info);
app.get("/api/clientinfo", client.info);

app.listen(3000);
