const mysql = require('koa-mysql');
const config = require('../../config/db.json');
const db = mysql.createPool(config);
const jwt = require('koa-jwt');
const JWT_CONFIG = require('../../config/jwt.json');

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
};

exports.search = function *(){
  if(this.request.headers.cookie){
    const token = this.request.headers.cookie.slice(4);
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);  // const email = "root";
    
    if(checkTokenTimestampStatus){
      const result = yield db.query("select record from user where email='"+email+"'");
      if(result[0].record){
        const record = JSON.parse(result[0].record);
        return this.body = {
          statusCode:200,
          message:"Success",
          result:record[0]
        };
      }
      return this.body = {
        statusCode:404,
        message:"It's not any record."
      };
    }
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken is expired."
  };
};

exports.delete = function *(){
  if(this.request.headers.cookie){
    const token = this.request.headers.cookie.slice(4);
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);
  
    if(checkTokenTimestampStatus){
      const result = yield db.query("select record from user where email='"+email+"'");
      console.log(result);
      if(result[0].record){
        yield db.query("update user \
                  set record=''\
                  where email='"+email+"'");     
        return this.body = {
          statusCode:200,
          message:"Delete Record Success.",
          work:"delete"
        };
      }
      return this.body = {
        statusCode:404,
        message:"The record is already empty."
      }
    }
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken is expired."
  };
};
// [ {"對戰編號" : "Game002","對戰結果" : "勝利","對戰時間" : "30:00","Gank成功次數" :"10/15"},{"對戰編號" : "Game001","對戰結果" : "失敗","對戰時間" : "20:00","Gank成功次數" : "3/10"}]

exports.insert = function *(){
  return this.body = {
    statusCode:200,
    message:"Success.",
    work:"insert"
  }
};