var Router = require('koa-router');
var router = new Router();

router.get('/', function *() {
  yield this.render('index');
});

// router.get('/room/enter', function *() {
//   var self = this;
//   function pushMessage(message) {
//     self.websocket.send(message);
//   }

//   this.websocket.send('Welcome');
//   this.websocket.on('message', function(msg) {
//     eventEmitter.emit('update', msg);
//   });

//   this.websocket.on('close', function() {
//     console.log('disconnect');
//     eventEmitter.removeListener('update', pushMessage);
//   });

//   eventEmitter.on('update', pushMessage);
// });

router.use(require('./routers/groups/auth').middleware());
router.use(require('./routers/groups/game').middleware());
router.use(require('./routers/groups/record').middleware());
router.use(require('./routers/groups/room').middleware());
router.use(require('./routers/groups/token').middleware());

module.exports = router;