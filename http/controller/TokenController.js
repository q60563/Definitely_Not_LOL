const mysql = require('koa-mysql');
const config = require('../../config/db.json');
const db = mysql.createPool(config);
const jwt = require('koa-jwt');
const JWT_CONFIG = require('../../config/jwt.json');

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

exports.update = function *(){
  if(this.request.headers.cookie){
    const token = this.request.headers.cookie.slice(4);
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);

    if(checkTokenTimestampStatus){
      const resultToken = yield createLoginToken(email);
      yield db.query("update user \
                  set logintoken='"+resultToken.loginToken+"',timestamp='"+resultToken.timestamp+"'\
                  where email='"+email+"'"); 
      this.cookies.set("jwt", resultToken.loginToken, {httpOnly: true, overwrite: true, expires: new Date(new Date().getTime() + 86400000)});
      return this.body = {
        statusCode:200,
        message:"updateToken success.",
        loginToken:resultToken.loginToken,
        work:"update"
      };
    }
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken is expired.",
    work:"update"
  };
}