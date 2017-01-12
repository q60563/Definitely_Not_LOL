const mysql = require('koa-mysql');
const config = require('../../config/db.json');
const db = mysql.createPool(config);
const uuid = require('node-uuid');
const jwt = require('koa-jwt');
const JWT_CONFIG = require('../../config/jwt.json');
const game_CONFIG = require('../../config/game.json');

const createLoginToken = function(email){
  return new Promise(function(resolve, reject) {
    const timestamp = Math.floor(new Date() / 1000);
    const loginToken = jwt.sign({email:email, timestamp:timestamp},JWT_CONFIG.secret);
    const result = {
      loginToken:loginToken,
      timestamp:timestamp
    }
    resolve(result);
  });
};

const decodeLoginToken = function(loginToken){
  return new Promise(function(resolve, reject) {
    const result = jwt.verify(loginToken, JWT_CONFIG.secret);
    resolve(result);
  });
};

const checkToken = function(tokenTimestamp, inputTokenTimestamp){
  return new Promise(function(resolve, reject) {
    if(tokenTimestamp==inputTokenTimestamp){
      const nowTimestamp = Math.floor(new Date() / 1000);
      if((nowTimestamp-tokenTimestamp)<86400){
        resolve(true);
      }
    }
    resolve(false);
  });
}

const mergeJson = function(game_CONFIG){
  return new Promise(function(resolve, reject) {
    var data = new Array();
    data.push(game_CONFIG,game_CONFIG);
    var result = JSON.parse(JSON.stringify(data));
    resolve(result);
  });
}

exports.enter = function *(){
  if(this.request.headers.cookie){
    // const roomNumber = yield db.query("select * from room");
    // const roomID = "room_00"+(roomNumber.length+1);
    const roomID = "room_002";
    const token = this.request.headers.cookie.slice(4);
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);

    if(checkTokenTimestampStatus){
      const username = yield db.query("select username from user where email='"+email+"'");
      const checkRoom = yield db.query("select owner,player from room where roomid='"+roomID+"'");
      const roomOwner = checkRoom[0].owner;
      const roomPlayer = checkRoom[0].player;

      if(roomOwner.length===0 && roomPlayer.length===0){
        yield db.query("update room \
                  set owner='"+username[0].username+"'\
                  where roomid='"+roomID+"'");
        return this.body = {
          statusCode:200,
          message:"Success enter room.",
        };
      }else if(roomOwner.length!=0 && roomPlayer.length===0){
        yield db.query("update room \
                  set player='"+username[0].username+"'\
                  where roomid='"+roomID+"'");
        return this.body = {
          statusCode:200,
          message:"Success enter room.",
        };
      }
      return this.body = {
        statusCode:404,
        message:"Room already full.",
        work:"enter"
      };
    }
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken is expired.",
    work:"enter"
  };
}

exports.start = function *(){
  if(this.request.headers.cookie){
    const token = this.request.headers.cookie.slice(4);
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);

    if(checkTokenTimestampStatus){
      const redUid = uuid.v1();
      const blueUid = uuid.v4();
      const roomID = "room_002";
      const username = yield db.query("select username from user where email='"+email+"'");
      const checkRoom = yield db.query("select owner,player from room where roomid='"+roomID+"'");
      const roomOwner = checkRoom[0].owner;
      const roomPlayer = checkRoom[0].player;

      if(username[0].username===roomOwner){
        if(roomPlayer.length!=0){
          const gameID = game_CONFIG.gameID;
          const camp = game_CONFIG.camp;
          camp["Blue"] = roomOwner;
          camp["Red"] = roomPlayer;
          const player = yield mergeJson(game_CONFIG.player);
          player[0].username = roomOwner;
          player[1].username = roomPlayer;
          const tower = yield mergeJson(game_CONFIG.tower);
          const privateWilder = (game_CONFIG.wilder).private;
          const publicWilder = (game_CONFIG.wilder).public;
          const member = yield mergeJson(game_CONFIG.member);
          const soldier = yield mergeJson(game_CONFIG.soldier);
          const ability = yield mergeJson(game_CONFIG.ability);

          yield db.query("insert into game (gameID, camp)\
                  values ('"+gameID+"',\
                          '"+JSON.stringify(camp)+"'\
                          )");

          yield db.query("insert into player (uid, gameID, camp, player, ability)\
                  values ('"+blueUid+"',\
                          '"+gameID+"',\
                          'Blue',\
                          '"+JSON.stringify(player[0])+"',\
                          '"+JSON.stringify(ability[0])+"'\
                          )");
          yield db.query("insert into player (uid, gameID, camp, player, ability)\
                  values ('"+redUid+"',\
                          '"+gameID+"',\
                          'Red',\
                          '"+JSON.stringify(player[1])+"',\
                          '"+JSON.stringify(ability[1])+"'\
                          )");

          yield db.query("insert into tower (uid, gameID, camp, tower)\
                  values ('"+blueUid+"',\
                          '"+gameID+"',\
                          'Blue',\
                          '"+JSON.stringify(game_CONFIG.tower)+"'\
                          )");
          yield db.query("insert into tower (uid, gameID, camp, tower)\
                  values ('"+redUid+"',\
                          '"+gameID+"',\
                          'Red',\
                          '"+JSON.stringify(game_CONFIG.etower)+"'\
                          )");

          yield db.query("insert into privateWilder (uid, gameID, camp, wilder)\
                  values ('"+blueUid+"',\
                          '"+gameID+"',\
                          'Blue',\
                          '"+JSON.stringify((game_CONFIG.wilder).private)+"'\
                          )");
          yield db.query("insert into privateWilder (uid, gameID, camp, wilder)\
                  values ('"+redUid+"',\
                          '"+gameID+"',\
                          'Red',\
                          '"+JSON.stringify((game_CONFIG.wilder).eprivate)+"'\
                          )");

          yield db.query("insert into publicWilder (uid, gameID, baron, fireDragon, waterDragon, earthDragon)\
                  values ('"+blueUid+"',\
                          '"+gameID+"',\
                          '"+JSON.stringify(publicWilder["Baron"])+"',\
                          '"+JSON.stringify(publicWilder["fireDragon"])+"',\
                          '"+JSON.stringify(publicWilder["waterDragon"])+"',\
                          '"+JSON.stringify(publicWilder["earthDragon"])+"'\
                          )");

          yield db.query("insert into member (uid, gameID, camp, member)\
                  values ('"+blueUid+"',\
                          '"+gameID+"',\
                          'Blue',\
                          '"+JSON.stringify(member[0])+"'\
                          )");
          yield db.query("insert into member (uid, gameID, camp, member)\
                  values ('"+redUid+"',\
                          '"+gameID+"',\
                          'Red',\
                          '"+JSON.stringify(member[1])+"'\
                          )");

          yield db.query("insert into soldier (uid, gameID, camp, soldier)\
                  values ('"+blueUid+"',\
                          '"+gameID+"',\
                          'Blue',\
                          '"+JSON.stringify(soldier[0])+"'\
                          )");
          yield db.query("insert into soldier (uid, gameID, camp, soldier)\
                  values ('"+redUid+"',\
                          '"+gameID+"',\
                          'Red',\
                          '"+JSON.stringify(soldier[1])+"'\
                          )");
          yield db.query("update room \
                    set owner='', player=''\
                    where roomid='"+roomID+"'");
          return this.body = {
            statusCode:200,
            message:"Success start game",
            work:"start"
          };
        }
        return this.body = {
          statusCode:404,
          message:"Player number inadequate.",
          work:"start"
        };
      }
      return this.body = {
        statusCode:404,
        message:"Only owner can start game.",
        work:"start"
      };
    }
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken is expired.",
    work:"start"
  };
}

exports.leave = function *(){
  if(this.request.headers.cookie){
    const roomID = "room_002";
    const token = this.request.headers.cookie.slice(4);
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);

    if(checkTokenTimestampStatus){
      const username = yield db.query("select username from user where email='"+email+"'");
      const checkRoom = yield db.query("select owner,player from room where roomid='"+roomID+"'");
      const roomOwner = checkRoom[0].owner;
      const roomPlayer = checkRoom[0].player;

      if(username[0].username===roomOwner){
        if(roomPlayer.length!=0){
          yield db.query("update room \
                  set owner='"+roomPlayer+"', player=''\
                  where roomid='"+roomID+"'");
          return this.body = {
            statusCode:200,
            message:"Success Leave room & "+roomPlayer+" trun into the room owner.",
            work:"leave"
          };
        }
        yield db.query("update room \
                set owner=''\
                where roomid='"+roomID+"'");
        return this.body = {
          statusCode:200,
          message:"Success Leave room.",
          work:"leave"
        };
      }else if(username[0].username===roomPlayer){
        yield db.query("update room \
                  set player=''\
                  where roomid='"+roomID+"'");
        return this.body = {
          statusCode:200,
          message:"Success Leave room.",
          work:"leave"
        };
      }
      return this.body = {
          statusCode:404,
          message:"Error operation.",
          work:"leave"
        };
    }
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken is expired.",
    work:"leave"
  };
}
