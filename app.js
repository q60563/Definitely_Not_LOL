var koa = require('koa');
var Router = require('koa-router');
var json = require('koa-json');
var bodyParser = require('koa-bodyparser');
var views = require('koa-views');
var serve = require('koa-static');
var websockify = require('koa-websocket');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var app = koa();
var socket = websockify(app);
var router = new Router();

app.use(serve(__dirname + '/public'));
app.use(views(__dirname + '/views', {
  map: {
    html: 'ejs'
  }
}));

app.use(json());
app.use(bodyParser());

// app.use(router.middleware());
app.use(require('./http/router').middleware());
app.ws
  .use(require('./http/router').routes())
  .use(require('./http/router').allowedMethods());
app.listen(8000,function(){
  console.log('Already connected server');
});