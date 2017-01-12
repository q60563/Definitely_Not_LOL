const mysql = require('koa-mysql');
const config = require('../../config/db.json');
const db = mysql.createPool(config);
const jwt = require('koa-jwt');
const JWT_CONFIG = require('../../config/jwt.json');
const SelectButtonService = require('../services/ButtonService').SelectButtonService;
const selectCombatService = require('../services/ButtonService').selectCombatService;
const checkCombatService = require('../services/ButtonService').checkCombatService;

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

exports.selectButton = function *(){
  // if(this.request.headers.cookie){
    // const token = this.request.headers.cookie.slice(4);
    const token = this.request.headers.authorization.slice(7);
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);
  
    if(checkTokenTimestampStatus){
      const gameID = "game001";
      const username = (yield db.query("select username from user where email='"+email+"'"))[0].username;
      const campData = JSON.parse((yield db.query("select camp from game"))[0].camp);
      var camp = "";
      if (campData["Blue"]===username) camp="Blue";
      if (campData["Red"]===username) camp="Red";
      const playerData = yield db.query("select player from player where camp='"+camp+"'");
      const nowLocation = JSON.parse(playerData[0].player).location;

      const unlockItem = yield SelectButtonService(camp,nowLocation);

      return this.body = {
        statusCode:200,
        message:"Success",
        work:"selectButton",
        location:unlockItem
      };
    }
  // }
  return this.body = {
    statusCode:404,
    message:"The loginToken already expiration.",
    work:"selectButton"
  };
};

exports.checkButton = function *(){
  if(this.request.headers.cookie){
    const token = this.request.headers.cookie.slice(4);
  // const token = this.request.headers.authorization.slice(7);
  const tokenContent = yield decodeLoginToken(token);
  const email = tokenContent.email;
  const inputTokenTimestamp = tokenContent.timestamp;
  const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
  const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);

  if(checkTokenTimestampStatus){      
    const gameID = "game001";
    const username = (yield db.query("select username from user where email='"+email+"'"))[0].username;
    const campData = JSON.parse((yield db.query("select camp from game"))[0].camp);
    var camp = "";
    if (campData["Blue"]===username) camp="Blue";
    if (campData["Red"]===username) camp="Red";
    // const goalLocation = this.request.body.goalLocation;
    const visionLocation = this.request.body.vision;
    const goalLocation = this.request.body.area;
    console.log(goalLocation);
    const playerData = yield db.query("select player from player where camp='"+camp+"'");
    var changePlayerData = JSON.parse(playerData[0].player);
    changePlayerData.location = goalLocation;
    changePlayerData.vision = visionLocation;
    if(changePlayerData.location=="fBase" || changePlayerData.location=="eBase"){
      changePlayerData.blood = 600+(changePlayerData.rank-1)*50;
    }
    
    yield db.query("update player \
                    set player='"+JSON.stringify(changePlayerData)+"'\
                    where gameID='"+gameID+"' and camp='"+camp+"'");
    return this.body = {
      statusCode:200,
      message:"Success move to "+goalLocation+".",
      work:"checkButton"
    };
  }
}
  return this.body = {
    statusCode:404,
    message:"The loginToken already expiration.",
    work:"checkButton"
  };
};

exports.selectCombat = function *(){
  const token = this.request.headers.authorization.slice(7);
  const tokenContent = yield decodeLoginToken(token);
  const email = tokenContent.email;
  const inputTokenTimestamp = tokenContent.timestamp;
  const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
  const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);

  if(checkTokenTimestampStatus){
    const gameID = "game001";
    const username = (yield db.query("select username from user where email='"+email+"'"))[0].username;
    const campData = JSON.parse((yield db.query("select camp from game"))[0].camp);
    var camp = "";
    if (campData["Blue"]===username) camp="Blue";
    if (campData["Red"]===username) camp="Red";
    const playerData = yield db.query("select player from player where gameID='"+gameID+"' and camp='"+camp+"'");
    const nowLocation = JSON.parse(playerData[0].player).location;
    var enemyCamp = "";
    if(camp==="Blue") enemyCamp = "Red";
    if(camp==="Red") enemyCamp = "Blue";
    const enemyPlayerData = yield db.query("select player from player where gameID='"+gameID+"' and camp='"+enemyCamp+"'");
    const enemyLocation = JSON.parse(enemyPlayerData[0].player).location;
    const privateWilderData = yield db.query("select wilder from privateWilder where gameID='"+gameID+"' and camp='"+camp+"'");
    const privateWilder = JSON.parse(privateWilderData[0].wilder);
    const publicWilderData = yield db.query("select * from publicWilder where gameID='"+gameID+"'");
    const publicWilder = publicWilderData[0];
    const ability = JSON.parse(playerData[0].player).ability;

    const enableItem = yield selectCombatService(camp,nowLocation,enemyLocation,privateWilder,publicWilder,ability);
    
    return this.body = {
      statusCode:200,
      message:"Success",
      work:"selectCombat",
      result:enableItem
    };
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken already expiration.",
    work:"selectCombat"
  };
};

exports.checkCombat = function *(){
  if(this.request.headers.cookie){
    const token = this.request.headers.cookie.slice(4);
  // const token = this.request.headers.authorization.slice(7);
  const tokenContent = yield decodeLoginToken(token);
  const email = tokenContent.email;
  const inputTokenTimestamp = tokenContent.timestamp;
  const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
  const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);
  console.log(this.request.body);
  if(checkTokenTimestampStatus){
    const gameID = "game001";
    const username = (yield db.query("select username from user where email='"+email+"'"))[0].username;
    const campData = JSON.parse((yield db.query("select camp from game"))[0].camp);
    var camp = "";
    if (campData["Blue"]===username) camp="Blue";
    if (campData["Red"]===username) camp="Red";
    // const goalLocation = this.request.body.goalLocation;
    // const combat = this.request.body.combat;
    const goalLocation = this.request.body.area;
    const combat = this.request.body.skills;
    const target = this.request.body.target;
    const privateWilderData = yield db.query("select wilder from privateWilder where gameID='"+gameID+"' and camp='"+camp+"'");
    const privateWilder = JSON.parse(privateWilderData[0].wilder);
    const publicWilderData = yield db.query("select * from publicWilder where gameID='"+gameID+"'");
    const publicWilder = publicWilderData[0];
    const playerData = yield db.query("select player from player where gameID='"+gameID+"' and camp='"+camp+"'");
    const ability = yield db.query("select ability from player where gameID='"+gameID+"' and camp='"+camp+"'");
    var enemyCamp = "";
    if(camp==="Blue") enemyCamp = "Red";
    if(camp==="Red") enemyCamp = "Blue";
    const enemyPlayerData = yield db.query("select player from player where gameID='"+gameID+"' and camp='"+enemyCamp+"'");
    const enemyTowerData = yield db.query("select tower from tower where gameID='"+gameID+"' and camp='"+enemyCamp+"'");
    const enemyMemberData = yield db.query("select member from member where gameID='"+gameID+"' and camp='"+enemyCamp+"'");
    const enemySoldierData = yield db.query("select soldier from soldier where gameID='"+gameID+"' and camp='"+enemyCamp+"'");

    const combatResult = yield checkCombatService(camp,target,goalLocation,combat,privateWilder,publicWilder,JSON.parse(playerData[0].player),JSON.parse(ability[0].ability),JSON.parse(enemyPlayerData[0].player),JSON.parse(enemyTowerData[0].tower),JSON.parse(enemyMemberData[0].member),JSON.parse(enemySoldierData[0].soldier));

    yield db.query("update privateWilder \
                set wilder='"+JSON.stringify(combatResult.privateWilder)+"'\
                where camp='"+camp+"'"); 

    yield db.query("update publicWilder \
                set baron='"+combatResult.publicWilder["baron"]+"',\
                    fireDragon='"+combatResult.publicWilder["fireDragon"]+"'\
                where gameID='"+gameID+"'"); 

    yield db.query("update player \
                set player='"+JSON.stringify(combatResult.playerData)+"',\
                ability='"+JSON.stringify(combatResult.ability)+"'\
                where camp='"+camp+"'"); 

    yield db.query("update player \
                set player='"+JSON.stringify(combatResult.enemyPlayerData)+"'\
                where camp='"+enemyCamp+"'"); 

    yield db.query("update member \
                set member='"+JSON.stringify(combatResult.enemyMemberData)+"'\
                where camp='"+enemyCamp+"'"); 

    yield db.query("update tower \
                set tower='"+JSON.stringify(combatResult.enemyTowerData)+"'\
                where camp='"+enemyCamp+"'"); 

    return this.body = {
      statusCode:200,
      message:"Success",
      work:"checkCombat",
      // result:combatResult
    };
  }
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken already expiration.",
    work:"checkCombat"
  };
};

exports.surrender = function *(){
  const token = this.request.headers.cookie.slice(4);
  const tokenContent = yield decodeLoginToken(token);
  const email = tokenContent.email;
  const inputTokenTimestamp = tokenContent.timestamp;
  const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
  const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);
  console.log(checkTokenTimestampStatus);
  if(checkTokenTimestampStatus){
    const username = (yield db.query("select username from user where email='"+email+"'"))[0].username;
    const campData = JSON.parse((yield db.query("select camp from game"))[0].camp);
    var camp = "";
    if (campData["Blue"]===username) camp="Blue";
    if (campData["Red"]===username) camp="Red";
    var changeTower = JSON.parse((yield db.query("select tower from tower where camp='"+camp+"'"))[0].tower);
    if(camp=="Blue") {
      changeTower["fNexus"]["blood"]="0";
      changeTower["fNexus"]["status"]="dead";
      yield db.query("update tower set tower='"+JSON.stringify(changeTower)+"' where camp='"+camp+"'");
    }else if(camp=="Red"){
      changeTower["eNexus"]["blood"]="0";
      changeTower["eNexus"]["status"]="dead";
      yield db.query("update tower set tower='"+JSON.stringify(changeTower)+"' where camp='"+camp+"'");
    }
    return this.body = {
      statusCode:200,
      message:"Success",
      work:"surrender"
    };
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken already expiration.",
    work:"surrender"
  };
};

exports.overGameDeleteData = function *(){
  const gameID = "game001";  
  yield db.query("delete from game where gameID='"+gameID+"'");
  yield db.query("delete from player where gameID='"+gameID+"'");
  yield db.query("delete from tower where gameID='"+gameID+"'");
  yield db.query("delete from privateWilder where gameID='"+gameID+"'");
  yield db.query("delete from publicWilder where gameID='"+gameID+"'");
  yield db.query("delete from member where gameID='"+gameID+"'");
  yield db.query("delete from soldier where gameID='"+gameID+"'");
  return this.body = {
    statusCode:200,
    message:"Success delete.",
    work:"overGame"
  };
}