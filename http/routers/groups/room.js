const Router = require('koa-router');
const room = require('../../controller/RoomController');
const router = new Router({prefix: '/room'});
const mysql = require('mysql');
const config = require('../../../config/db.json');
// const db = mysql.createConnection(config).connect();
const events = require('events');
const eventEmitter = new events.EventEmitter();

router.get('/',function *(){
  yield this.render('hall');
});

router.get('/enter',function *(){
  const roomID = "room_002";
  var user="";
  var self = this;

  const checkUser = function(res,callback){
    user = {owner:res[0].owner,player:res[0].player};
    return callback();
  }
  
  function pushMessage(message) {
    if(message!=""){
      return self.websocket.send(JSON.stringify({owner:"",player:"",pathname:message}));
    }
    var db = mysql.createConnection(config);
    db.connect();
    db.query("select owner,player from room where roomid='"+roomID+"'", function(err, username, fields,cb){
      if (err)  console.log("err");
      checkUser(username,function(){
        console.log("sendData");
        self.websocket.send(JSON.stringify(user));
      });
    });
    db.end();
  }

  // this.websocket.send('Welcome');
  this.websocket.on('message', function(msg) {
    eventEmitter.emit('update', msg);
  });

  this.websocket.on('close', function() {
    console.log('disconnect');
    eventEmitter.removeListener('update', pushMessage);
  });

  eventEmitter.on('update', pushMessage);
});

router.post('/enter',room.enter);
router.post('/start',room.start);
router.post('/leave',room.leave);

module.exports = router;