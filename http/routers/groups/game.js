const Router = require('koa-router');
const game = require('../../controller/GameController');
const router = new Router({prefix: '/game'});
const mysql = require('koa-mysql');
const config = require('../../../config/db.json');
const db = mysql.createPool(config);
const jwt = require('koa-jwt');
const JWT_CONFIG = require('../../../config/jwt.json');
const events = require('events');
const eventEmitter = new events.EventEmitter();

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

router.get('/mainBlue',function *(){
  var rebirthTimestamp="";
  var refreshMapMysql = require('mysql');
  const gameID = "game001";
  const camp = "Blue";
  const enemyCamp = "Red";

  var result = {
    status:"",
    data:"",
    location:"",
    deadTower:[],
    vision:[],
    enemyLocation:""
  }

  var self = this;
  function pushMessage(message) {
    self.websocket.send("Blue test success");
  }
  
  const rebirthPlayer = function(res){
    var refreshMapDB = refreshMapMysql.createConnection(config);
    refreshMapDB.connect();
    var playerData = JSON.parse(res[0].player);
    playerData.status="alive";
    playerData.blood=600+(playerData.rank-1)*50;
    refreshMapDB.query("update player set player='"+JSON.stringify(playerData)+"' where camp='"+camp+"'",function(err){
      if(err) throw err;
      refreshMapDB.end();
    });
  }

  const rebirthPlayerRound = function(res){
    var refreshMapDB = refreshMapMysql.createConnection(config);
    refreshMapDB.connect();
    var playerData = JSON.parse(res[0].player);
    playerData.round="0";
    refreshMapDB.query("update player set player='"+JSON.stringify(playerData)+"' where camp='"+camp+"'",function(err){
      if(err) throw err;
      refreshMapDB.end();
    });
  }

  const rebirthWilder = function(res,set,camp){
    var refreshMapDB = refreshMapMysql.createConnection(config);
    refreshMapDB.connect();
    var wilderData = JSON.parse(res[0].wilder);
    wilderData[set].status="alive";
    wilderData[set].blood=250;
    refreshMapDB.query("update privateWilder set wilder='"+JSON.stringify(wilderData)+"' where camp='"+camp+"'",function(err){
      if(err) throw err;
      refreshMapDB.end();
    });
  }

  const rebirthWilderRound = function(res,set,camp){
    var refreshMapDB = refreshMapMysql.createConnection(config);
    refreshMapDB.connect();
    var wilderData = JSON.parse(res[0].wilder);
    wilderData[set].round="0";
    refreshMapDB.query("update privateWilder set wilder='"+JSON.stringify(wilderData)+"' where camp='"+camp+"'",function(err){
      if(err) throw err;
      refreshMapDB.end();
    });
  }

  const rebirthPublicWilder = function(res,set){
    var refreshMapDB = refreshMapMysql.createConnection(config);
    refreshMapDB.connect();
    var wilderData = JSON.parse(res[0][set]);
    wilderData.status="alive";
    if(set=="baron") wilderData.blood=1200;
    else if(set=="fireDragon") wilderData.blood=800;
    refreshMapDB.query("update publicWilder set "+set+"='"+JSON.stringify(wilderData)+"' where gameID='"+gameID+"'",function(err){
      if(err) throw err;
      refreshMapDB.end();
    });
  }

  const rebirthPublicWilderRound = function(res,set,camp){
    var refreshMapDB = refreshMapMysql.createConnection(config);
    refreshMapDB.connect();
    var wilderData = JSON.parse(res[0][set]);
    wilderData.round="0";
    refreshMapDB.query("update publicWilder set "+set+"='"+JSON.stringify(wilderData)+"' where gameID='"+gameID+"'",function(err){
      if(err) throw err;
      refreshMapDB.end();
    });
  }

  const changePlayerData = function(res,callback){
    if(JSON.parse(res[0].player)["status"]=="dead"){
      if(JSON.parse(res[0].player)["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthPlayerRound(res);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthPlayer(res);
      }
    }
    result.status = "changePlayerStatus";
    result.data = JSON.parse(res[0].player);
    result.location = JSON.parse(res[0].player).location;
    result.vision = JSON.parse(res[0].player).vision;
    return callback();
  }

  const changeEnemyPlayerData = function(res,callback){
    result.status = "changeEnemyPlayerStatus";
    result.data = JSON.parse(res[0].player);
    result.enemyLocation = JSON.parse(res[0].player).location;
    return callback();
  }

  const changePrivateWilderData = function(res,callback){
    if(JSON.parse(res[0].wilder)["fFrog"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fFrog"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fFrog",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fFrog",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["fBlueB"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fBlueB"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fBlueB",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fBlueB",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["fWolf"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fWolf"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fWolf",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fWolf",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["fBird"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fBird"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fBird",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fBird",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["fRedB"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fRedB"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fRedB",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fRedB",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["fRock"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fRock"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fRock",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fRock",camp);
      }
    }
    result.status = "changeWilderStatus";
    result.data = JSON.parse(res[0].wilder);
    return callback();
  }

  const changeEnemyPrivateWilderData = function(res,callback){
        if(JSON.parse(res[0].wilder)["eFrog"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eFrog"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eFrog",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eFrog",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["eBlueB"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eBlueB"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eBlueB",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eBlueB",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["eWolf"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eWolf"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eWolf",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eWolf",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["eBird"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eBird"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eBird",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eBird",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["eRedB"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eRedB"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eRedB",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eRedB",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["eRock"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eRock"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eRock",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eRock",enemyCamp);
      }
    }
    result.status = "changeEnemyWilderStatus";
    result.data = JSON.parse(res[0].wilder);
    return callback();
  }

  const changePublicWilderData = function(res,callback){
    if(JSON.parse(res[0].baron)["status"]=="dead"){
      if(JSON.parse(res[0].baron)["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthPublicWilderRound(res,"baron");
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=25){
        rebirthPublicWilder(res,"baron");
      }
    }
    if(JSON.parse(res[0].fireDragon)["status"]=="dead"){
      if(JSON.parse(res[0].fireDragon)["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthPublicWilderRound(res,"fireDragon");
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=25){
        rebirthPublicWilder(res,"fireDragon");
      }
    }
    result.status = "changePublicWilderStatus";
    result.data = res[0];
    return callback();
  }

  const changeMemberData = function(res,callback){
    result.status = "changeMemberStatus";
    result.data = JSON.parse(res[0].member);
    return callback();
  }

  const changeEnemyMemberData = function(res,callback){
    result.status = "changeEnemyMemberStatus";
    result.data = JSON.parse(res[0].member);
    return callback();
  }

  const changeTowerData = function(res,callback){
    result.status = "changeTowerStatus";
    result.data = JSON.parse(res[0].tower);
    result.deadTower["length"]=0;
    if(JSON.parse(res[0].tower)["fTower-top3"]["status"]=="dead") result.deadTower.push("fTower-top3");
    if(JSON.parse(res[0].tower)["fTower-mid3"]["status"]=="dead") result.deadTower.push("fTower-mid3");
    if(JSON.parse(res[0].tower)["fTower-bot3"]["status"]=="dead") result.deadTower.push("fTower-bot3");
    if(JSON.parse(res[0].tower)["fTower-top2"]["status"]=="dead") result.deadTower.push("fTower-top2");
    if(JSON.parse(res[0].tower)["fTower-mid2"]["status"]=="dead") result.deadTower.push("fTower-mid2");
    if(JSON.parse(res[0].tower)["fTower-bot2"]["status"]=="dead") result.deadTower.push("fTower-bot2");
    if(JSON.parse(res[0].tower)["fTower-top1"]["status"]=="dead") result.deadTower.push("fTower-top1");
    if(JSON.parse(res[0].tower)["fTower-mid1"]["status"]=="dead") result.deadTower.push("fTower-mid1");
    if(JSON.parse(res[0].tower)["fTower-bot1"]["status"]=="dead") result.deadTower.push("fTower-bot1");
    if(JSON.parse(res[0].tower)["fNexus"]["status"]=="dead")  result.deadTower.push("fNexus");
    return callback();
  }

  const changeEnemyTowerData = function(res,callback){
    result.status = "changeEnemyTowerStatus";
    result.data = JSON.parse(res[0].tower);
    result.deadTower["length"]=0;
    if(JSON.parse(res[0].tower)["eTower-top3"]["status"]=="dead") result.deadTower.push("eTower-top3");
    if(JSON.parse(res[0].tower)["eTower-mid3"]["status"]=="dead") result.deadTower.push("eTower-mid3");
    if(JSON.parse(res[0].tower)["eTower-bot3"]["status"]=="dead") result.deadTower.push("eTower-bot3");
    if(JSON.parse(res[0].tower)["eTower-top2"]["status"]=="dead") result.deadTower.push("eTower-top2");
    if(JSON.parse(res[0].tower)["eTower-mid2"]["status"]=="dead") result.deadTower.push("eTower-mid2");
    if(JSON.parse(res[0].tower)["eTower-bot2"]["status"]=="dead") result.deadTower.push("eTower-bot2");
    if(JSON.parse(res[0].tower)["eTower-top1"]["status"]=="dead") result.deadTower.push("eTower-top1");
    if(JSON.parse(res[0].tower)["eTower-mid1"]["status"]=="dead") result.deadTower.push("eTower-mid1");
    if(JSON.parse(res[0].tower)["eTower-bot1"]["status"]=="dead") result.deadTower.push("eTower-bot1");
    if(JSON.parse(res[0].tower)["eNexus"]["status"]=="dead") result.deadTower.push("eNexus");
    return callback();
  }

  var refreshMapDB = refreshMapMysql.createConnection(config);
  refreshMapDB.connect();
  var refresh = setInterval(function(){
    if(result.deadTower.indexOf("fNexus")!=-1 || result.deadTower.indexOf("eNexus")!=-1){
      clearInterval(refresh);
      
      // throw new Error('test');
    }else{
      // var refreshMapDB = refreshMapMysql.createConnection(config);
      // refreshMapDB.connect();
      refreshMapDB.query("select player from player where camp='"+camp+"'", function(err, playerData, fields){
        if (err)  throw err;
        changePlayerData(playerData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshMapDB.query("select player from player where camp='"+enemyCamp+"'", function(err, enemyPlayerData, fields){
        if (err)  throw err;
        changeEnemyPlayerData(enemyPlayerData,function(){
          self.websocket.send(JSON.stringify(result));
        });
        // result.enemyLocation = JSON.parse(enemyPlayerData.player).location;
      });

      refreshMapDB.query("select wilder from privateWilder where gameID='"+gameID+"' and camp='"+camp+"'", function(err, wilderData, fields){
        if (err)  throw err;
        changePrivateWilderData(wilderData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshMapDB.query("select wilder from privateWilder where gameID='"+gameID+"' and camp='"+enemyCamp+"'", function(err, enemyWilderData, fields){
        if (err)  throw err;
        changeEnemyPrivateWilderData(enemyWilderData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshMapDB.query("select baron,fireDragon from publicWilder where gameID='"+gameID+"'", function(err, publicWilderData, fields){
        if (err)  throw err;
        changePublicWilderData(publicWilderData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });
      
      refreshMapDB.query("select member from member where gameID='"+gameID+"'and camp='"+camp+"'", function(err, memberData, fields){
        if (err)  throw err;
        changeMemberData(memberData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshMapDB.query("select member from member where gameID='"+gameID+"'and camp='"+enemyCamp+"'", function(err, enemyMemberData, fields){
        if (err)  throw err;
        changeEnemyMemberData(enemyMemberData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshMapDB.query("select tower from tower where gameID='"+gameID+"'and camp='"+camp+"'", function(err, toewrData, fields){
        if (err)  throw err;
        changeTowerData(toewrData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshMapDB.query("select tower from tower where gameID='"+gameID+"'and camp='"+enemyCamp+"'", function(err, enemyToewrData, fields){
        if (err)  throw err;
        changeEnemyTowerData(enemyToewrData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });
      // refreshMapDB.end();
    }
  }, 100);

  this.websocket.on('message', function(msg) {
    eventEmitter.emit('update', msg);
  });

  this.websocket.on('close', function() {
    console.log('disconnect');
    eventEmitter.removeListener('update', pushMessage);
  });

  eventEmitter.on('update', pushMessage);
});

router.get('/mainRed',function *(){
  var rebirthTimestamp="";
  var refreshRedMapMysql = require('mysql');
  const gameID = "game001";
  const camp = "Red";
  const enemyCamp = "Blue";

  var result = {
    status:"",
    data:"",
    location:"",
    deadTower:[],
    vision:[],
    enemyLocation:""
  }

  var self = this;
  function pushMessage(message) {
    self.websocket.send("Blue test success");
  }
  
  const rebirthPlayer = function(res){
    var refreshRedMapDB = refreshRedMapMysql.createConnection(config);
    refreshRedMapDB.connect();
    var playerData = JSON.parse(res[0].player);
    playerData.status="alive";
    playerData.blood=600+(playerData.rank-1)*50;
    refreshRedMapDB.query("update player set player='"+JSON.stringify(playerData)+"' where camp='"+camp+"'",function(err){
      if(err) throw err;
      refreshRedMapDB.end();
    });
  }

  const rebirthPlayerRound = function(res){
    var refreshRedMapDB = refreshRedMapMysql.createConnection(config);
    refreshRedMapDB.connect();
    var playerData = JSON.parse(res[0].player);
    playerData.round="0";
    refreshRedMapDB.query("update player set player='"+JSON.stringify(playerData)+"' where camp='"+camp+"'",function(err){
      if(err) throw err;
      refreshRedMapDB.end();
    });
  }

  const rebirthWilder = function(res,set,camp){
    var refreshRedMapDB = refreshRedMapMysql.createConnection(config);
    refreshRedMapDB.connect();
    var wilderData = JSON.parse(res[0].wilder);
    wilderData[set].status="alive";
    wilderData[set].blood=250;
    refreshRedMapDB.query("update privateWilder set wilder='"+JSON.stringify(wilderData)+"' where camp='"+camp+"'",function(err){
      if(err) throw err;
      refreshRedMapDB.end();
    });
  }

  const rebirthWilderRound = function(res,set,camp){
    var refreshRedMapDB = refreshRedMapMysql.createConnection(config);
    refreshRedMapDB.connect();
    var wilderData = JSON.parse(res[0].wilder);
    wilderData[set].round="0";
    refreshRedMapDB.query("update privateWilder set wilder='"+JSON.stringify(wilderData)+"' where camp='"+camp+"'",function(err){
      if(err) throw err;
      refreshRedMapDB.end();
    });
  }

  const rebirthPublicWilder = function(res,set){
    var refreshRedMapDB = refreshRedMapMysql.createConnection(config);
    refreshRedMapDB.connect();
    var wilderData = JSON.parse(res[0][set]);
    wilderData.status="alive";
    if(set=="baron") wilderData.blood=1200;
    else if(set=="fireDragon") wilderData.blood=800;
    refreshRedMapDB.query("update publicWilder set "+set+"='"+JSON.stringify(wilderData)+"' where gameID='"+gameID+"'",function(err){
      if(err) throw err;
      refreshRedMapDB.end();
    });
  }

  const rebirthPublicWilderRound = function(res,set,camp){
    var refreshRedMapDB = refreshRedMapMysql.createConnection(config);
    refreshRedMapDB.connect();
    var wilderData = JSON.parse(res[0][set]);
    wilderData.round="0";
    refreshRedMapDB.query("update publicWilder set "+set+"='"+JSON.stringify(wilderData)+"' where gameID='"+gameID+"'",function(err){
      if(err) throw err;
      refreshRedMapDB.end();
    });
  }

  const changePlayerData = function(res,callback){
    if(JSON.parse(res[0].player)["status"]=="dead"){
      if(JSON.parse(res[0].player)["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthPlayerRound(res);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthPlayer(res);
      }
    }
    result.status = "changePlayerStatus";
    result.data = JSON.parse(res[0].player);
    result.location = JSON.parse(res[0].player).location;
    result.vision = JSON.parse(res[0].player).vision;
    return callback();
  }

  const changeEnemyPlayerData = function(res,callback){
    result.status = "changeEnemyPlayerStatus";
    result.data = JSON.parse(res[0].player);
    result.enemyLocation = JSON.parse(res[0].player).location;
    return callback();
  }

  const changeEnemyPrivateWilderData = function(res,callback){
    if(JSON.parse(res[0].wilder)["fFrog"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fFrog"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fFrog",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fFrog",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["fBlueB"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fBlueB"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fBlueB",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fBlueB",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["fWolf"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fWolf"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fWolf",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fWolf",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["fBird"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fBird"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fBird",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fBird",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["fRedB"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fRedB"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fRedB",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fRedB",enemyCamp);
      }
    }
    if(JSON.parse(res[0].wilder)["fRock"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["fRock"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"fRock",enemyCamp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"fRock",enemyCamp);
      }
    }
    result.status = "changeEnemyWilderStatus";
    result.data = JSON.parse(res[0].wilder);
    return callback();
  }

  const changePrivateWilderData = function(res,callback){
    if(JSON.parse(res[0].wilder)["eFrog"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eFrog"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eFrog",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eFrog",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["eBlueB"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eBlueB"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eBlueB",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eBlueB",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["eWolf"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eWolf"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eWolf",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eWolf",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["eBird"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eBird"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eBird",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eBird",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["eRedB"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eRedB"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eRedB",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eRedB",camp);
      }
    }
    if(JSON.parse(res[0].wilder)["eRock"]["status"]=="dead"){
      if(JSON.parse(res[0].wilder)["eRock"]["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthWilderRound(res,"eRock",camp);
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=8){
        rebirthWilder(res,"eRock",camp);
      }
    }
    result.status = "changeWilderStatus";
    result.data = JSON.parse(res[0].wilder);
    return callback();
  }

  const changePublicWilderData = function(res,callback){
    if(JSON.parse(res[0].baron)["status"]=="dead"){
      if(JSON.parse(res[0].baron)["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthPublicWilderRound(res,"baron");
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=25){
        rebirthPublicWilder(res,"baron");
      }
    }
    if(JSON.parse(res[0].fireDragon)["status"]=="dead"){
      if(JSON.parse(res[0].fireDragon)["round"]!="0"){
        rebirthTimestamp = Math.floor(new Date() / 1000);
        rebirthPublicWilderRound(res,"fireDragon");
      }else if(Math.floor(new Date() / 1000)-rebirthTimestamp>=25){
        rebirthPublicWilder(res,"fireDragon");
      }
    }
    result.status = "changePublicWilderStatus";
    result.data = res[0];
    return callback();
  }

  const changeEnemyMemberData = function(res,callback){
    result.status = "changeEnemyMemberStatus";
    result.data = JSON.parse(res[0].member);
    return callback();
  }

  const changeMemberData = function(res,callback){
    result.status = "changeMemberStatus";
    result.data = JSON.parse(res[0].member);
    return callback();
  }

  const changeEnemyTowerData = function(res,callback){
    result.status = "changeEnemyTowerStatus";
    result.data = JSON.parse(res[0].tower);
    result.deadTower["length"]=0;
    if(JSON.parse(res[0].tower)["fTower-top3"]["status"]=="dead") result.deadTower.push("fTower-top3");
    if(JSON.parse(res[0].tower)["fTower-mid3"]["status"]=="dead") result.deadTower.push("fTower-mid3");
    if(JSON.parse(res[0].tower)["fTower-bot3"]["status"]=="dead") result.deadTower.push("fTower-bot3");
    if(JSON.parse(res[0].tower)["fTower-top2"]["status"]=="dead") result.deadTower.push("fTower-top2");
    if(JSON.parse(res[0].tower)["fTower-mid2"]["status"]=="dead") result.deadTower.push("fTower-mid2");
    if(JSON.parse(res[0].tower)["fTower-bot2"]["status"]=="dead") result.deadTower.push("fTower-bot2");
    if(JSON.parse(res[0].tower)["fTower-top1"]["status"]=="dead") result.deadTower.push("fTower-top1");
    if(JSON.parse(res[0].tower)["fTower-mid1"]["status"]=="dead") result.deadTower.push("fTower-mid1");
    if(JSON.parse(res[0].tower)["fTower-bot1"]["status"]=="dead") result.deadTower.push("fTower-bot1");
    if(JSON.parse(res[0].tower)["fNexus"]["status"]=="dead")  result.deadTower.push("fNexus");
    return callback();
  }

  const changeTowerData = function(res,callback){
    result.status = "changeTowerStatus";
    result.data = JSON.parse(res[0].tower);
    result.deadTower["length"]=0;
    if(JSON.parse(res[0].tower)["eTower-top3"]["status"]=="dead") result.deadTower.push("eTower-top3");
    if(JSON.parse(res[0].tower)["eTower-mid3"]["status"]=="dead") result.deadTower.push("eTower-mid3");
    if(JSON.parse(res[0].tower)["eTower-bot3"]["status"]=="dead") result.deadTower.push("eTower-bot3");
    if(JSON.parse(res[0].tower)["eTower-top2"]["status"]=="dead") result.deadTower.push("eTower-top2");
    if(JSON.parse(res[0].tower)["eTower-mid2"]["status"]=="dead") result.deadTower.push("eTower-mid2");
    if(JSON.parse(res[0].tower)["eTower-bot2"]["status"]=="dead") result.deadTower.push("eTower-bot2");
    if(JSON.parse(res[0].tower)["eTower-top1"]["status"]=="dead") result.deadTower.push("eTower-top1");
    if(JSON.parse(res[0].tower)["eTower-mid1"]["status"]=="dead") result.deadTower.push("eTower-mid1");
    if(JSON.parse(res[0].tower)["eTower-bot1"]["status"]=="dead") result.deadTower.push("eTower-bot1");
    if(JSON.parse(res[0].tower)["eNexus"]["status"]=="dead") result.deadTower.push("eNexus");
    return callback();
  }

  var refresh = setInterval(function(){
    if(result.deadTower.indexOf("fNexus")!=-1 || result.deadTower.indexOf("eNexus")!=-1){
      clearInterval(refresh);
    }else{
      var refreshRedMapDB = refreshRedMapMysql.createConnection(config);
      refreshRedMapDB.connect();
      refreshRedMapDB.query("select player from player where camp='"+camp+"'", function(err, playerData, fields){
        if (err)  throw err;
        changePlayerData(playerData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshRedMapDB.query("select player from player where camp='"+enemyCamp+"'", function(err, enemyPlayerData, fields){
        if (err)  throw err;
        changeEnemyPlayerData(enemyPlayerData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshRedMapDB.query("select wilder from privateWilder where gameID='"+gameID+"' and camp='"+camp+"'", function(err, wilderData, fields){
        if (err)  throw err;
        changePrivateWilderData(wilderData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshRedMapDB.query("select wilder from privateWilder where gameID='"+gameID+"' and camp='"+enemyCamp+"'", function(err, enemyWilderData, fields){
        if (err)  throw err;
        changeEnemyPrivateWilderData(enemyWilderData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshRedMapDB.query("select baron,fireDragon from publicWilder where gameID='"+gameID+"'", function(err, publicWilderData, fields){
        if (err)  throw err;
        changePublicWilderData(publicWilderData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });
      
      refreshRedMapDB.query("select member from member where gameID='"+gameID+"'and camp='"+camp+"'", function(err, memberData, fields){
        if (err)  throw err;
        changeMemberData(memberData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshRedMapDB.query("select member from member where gameID='"+gameID+"'and camp='"+enemyCamp+"'", function(err, enemyMemberData, fields){
        if (err)  throw err;
        changeEnemyMemberData(enemyMemberData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshRedMapDB.query("select tower from tower where gameID='"+gameID+"'and camp='"+camp+"'", function(err, toewrData, fields){
        if (err)  throw err;
        changeTowerData(toewrData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });

      refreshRedMapDB.query("select tower from tower where gameID='"+gameID+"'and camp='"+enemyCamp+"'", function(err, enemyToewrData, fields){
        if (err)  throw err;
        changeEnemyTowerData(enemyToewrData,function(){
          self.websocket.send(JSON.stringify(result));
        });
      });
      refreshRedMapDB.end();
    }
  }, 100);

  this.websocket.on('message', function(msg) {
    eventEmitter.emit('update', msg);
  });

  this.websocket.on('close', function() {
    console.log('disconnect');
    eventEmitter.removeListener('update', pushMessage);
  });

  eventEmitter.on('update', pushMessage);
});

router.get('/', function *() {
  const token = this.request.headers.cookie.slice(4);
  const tokenContent = yield decodeLoginToken(token);
  const email = tokenContent.email;
  const inputTokenTimestamp = tokenContent.timestamp;
  const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
  const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);

  if(checkTokenTimestampStatus){
    const username = (yield db.query("select username from user where email='"+email+"'"))[0].username;
    const campData = JSON.parse((yield db.query("select camp from game"))[0].camp);
    var camp = "";
    if (campData["Blue"]===username) camp="Blue";
    if (campData["Red"]===username) camp="Red";

    if(camp=="Blue") {
      yield this.render('mainBlue');
    }else if(camp=="Red"){
      yield this.render('mainRed');
    }
  }
});

router.post('/selectButton',game.selectButton);
router.post('/checkButton',game.checkButton);
router.post('/selectCombat',game.selectCombat);
router.post('/checkCombat',game.checkCombat);
router.get('/surrender',game.surrender);

router.get('/overGameDeleteData',game.overGameDeleteData);

module.exports = router;