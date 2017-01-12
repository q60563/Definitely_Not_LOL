const mysql = require('koa-mysql');
const config = require('../../config/db.json');
const db = mysql.createPool(config);
const uuid = require('node-uuid');
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

exports.register = function *(){
  const uid = uuid.v1();
  const email = this.request.body.email.toLowerCase() || "root";
  const password = this.request.body.password || "root";
  const username = this.request.body.username || "root";
  // const record = JSON.stringify({"c":"c"});

  const checkEmail = yield db.query("select * from user where email='"+email+"'");
  const checkUserName = yield db.query("select * from user where username='"+username+"'");

  if(email==="root" || password==="root" || username==="root"){
    return this.body = {
        statusCode:404,
        message:"Don't enter empty or root.",
        work:"register"
    }; 
  }else if(checkEmail.length!=0) {
    return this.body = {
      statusCode:404,
      message:"This account already exists.",
      work:"register"
    };
  }else if(checkUserName.length!=0){
    return this.body = {
      statusCode:404,
      message:"This username already exists.",
      work:"register"
    };   
  }

  yield db.query("insert into user (uid, email, password, username)\
              values ('"+uid+"', '"+email+"', '"+password+"', '"+username+"')");
  return this.body = {
    statusCode:200,
    message:"Success register.",
    work:"register"
  };
}

exports.login = function *(){
  const email = this.request.body.email.toLowerCase();
  const password = this.request.body.password;
  const checkEmail = yield db.query("select * from user where email='"+email+"'");

  if(checkEmail.length!=0){
    const checkPassword = yield db.query("select password from user where email='"+email+"'");
    if(password===checkPassword[0].password){
      const createValidateTokenReturn = yield createLoginToken(email);
      const loginToken = createValidateTokenReturn.loginToken;
      const tokenTimestamp = createValidateTokenReturn.timestamp;

      yield db.query("update user \
                set logintoken='"+loginToken+"',timestamp='"+tokenTimestamp+"'\
                where email='"+email+"'");
      console.log("loginToken: " + loginToken);
      this.cookies.set("jwt", loginToken, {httpOnly: true, overwrite: true, expires: new Date(new Date().getTime() + 86400000)});
      return this.body = {
        statusCode:200,
        message:"Success Login.",
        work:"login",
        loginToken:loginToken
      };
      // return yield this.render('hall');
    }else{
      return this.body = {
        statusCode:404,
        message:"Input the wrong password.",
        work:"login"
      };
    }
  }
  return this.body = {
    statusCode:404,
    message:"This account not exists.",
    work:"login"
  };
}

exports.logout = function *(){
  // console.log(this.request.headers.cookie.slice(4));
  // const token = this.request.headers.authorization.slice(7);
  if(this.request.headers.cookie){
    const token = this.request.headers.cookie.slice(4);
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);
    
    if(checkTokenTimestampStatus){
      const timestamp = parseInt(tokenTimestamp[0].timestamp) - 86400;
      const loginToken = jwt.sign({email:email, timestamp:timestamp},JWT_CONFIG.secret);
      yield db.query("update user \
                  set timestamp='"+timestamp+"'\
                  where email='"+email+"'");
      console.log("logout success");

      this.cookies.set("jwt",null, {overwrite: true, expires: new Date()});
      return this.body = {
        statusCode:200,
        message:"Logout Success",
        work:"logout"
      };
      // return yield this.render('index');
    }
  };
  return this.body = {
    statusCode:404,
    message:"The loginToken already expiration.",
    work:"logout"
  };
}

exports.rename = function *(){
  if(this.request.headers.cookie){
    const token = this.request.headers.cookie.slice(4);
    const username = this.request.body.username;
    const checkUsername = yield db.query("select * from user where username='"+username+"'");
    const tokenContent = yield decodeLoginToken(token);
    const email = tokenContent.email;
    const inputTokenTimestamp = tokenContent.timestamp;
    const tokenTimestamp = yield db.query("select timestamp from user where email='"+email+"'");
    const checkTokenTimestampStatus = yield checkToken(tokenTimestamp[0].timestamp,inputTokenTimestamp);
    
    if(checkTokenTimestampStatus){
      if(checkUsername.length!=0){
        return this.body = {
          statusCode:404,
          message:"This username already exists.",
          work:"rename"
        };
      }
      yield db.query("update user \
                  set username='"+username+"'\
                  where email='"+email+"'");
      return this.body = {
        statusCode:200,
        message:"Rename Success",
        work:"rename"
      };
    }
  }
  return this.body = {
    statusCode:404,
    message:"The loginToken is expired.",
    work:"rename"
  };
}