// const Spa = "spa";
// const Tower = ["mainTower", "topHighTower", "centerHighTower", "underHighTower",
//       "topOuterTowerOne", "centerOuterTowerOne", "underOuterTowerOne",
//       "topOuterTowerTwo", "centerOuterTowerTwo", "underOuterTowerTwo"];
// const publicItem = ["baron", "dragon"];
// const attackLocation = ["attackTopTower", "attackCenterTower", "attackUnderTower"];
// const blueWilder = ["frog", "blueBuffer", "wolf", "bird", "redBuffer", "stone"];
// const redWilder = ["bird", "redBuffer", "stone", "frog", "blueBuffer", "wolf"];

const Spa = "fBase";
const eSpa = "eBase";
const Tower = ["fNexus", "fTower-top1", "fTower-mid1", "fTower-bot1",
      "fTower-top2", "fTower-mid2", "fTower-bot2",
      "fTower-top3", "fTower-mid3", "fTower-bot3"];
const eTower = ["eNexus", "eTower-top1", "eTower-mid1", "eTower-bot1",
      "eTower-top2", "eTower-mid2", "eTower-bot2",
      "eTower-top3", "eTower-mid3", "eTower-bot3"];
const publicItem = ["baron", "dragon"];
const attackLocation = ["eTower-top3", "eTower-mid3", "eTower-bot3",
                        "eTower-top2", "eTower-mid2", "eTower-bot2",
                        "eTower-top1", "eTower-mid1", "eTower-bot1",
                        "eNexus"];
const eattackLocation = ["fTower-top3", "fTower-mid3", "fTower-bot3",
                        "fTower-top2", "fTower-mid2", "fTower-bot2",
                        "fTower-top1", "fTower-mid1", "fTower-bot1",
                        "fNexus"];

const blueWilder = ["fFrog", "fBlueB", "fWolf", "fBird", "fRedB", "fRock"];
const redWilder = ["eBird", "eRedB", "rRock", "eFrog", "eBlueB", "eWolf"];

exports.SelectButtonService = function (camp, location) {
  return new Promise(function(resolve, reject) {
    var result = [];
    if(camp==="Blue"){
      if(Tower.indexOf(location)!=-1 || Spa.indexOf(location)!=-1){
        switch (location) {
          //包括回溫泉、停留(選擇原先位置)
          case Spa:
            result = [Spa, Tower[0], Tower[1], Tower[3]];
            break;
          case Tower[0]:
            result = [Spa, Tower[0], Tower[1], Tower[2], Tower[3]];
            break;
          case Tower[1]:
            result = [Spa, Tower[1], Tower[0], Tower[2], Tower[4]];
            break;
          case Tower[2]:
            result = [Spa, Tower[2], Tower[0], Tower[1], Tower[3], Tower[5], blueWilder[2], blueWilder[5]];
            break;
          case Tower[3]:
            result = [Spa, Tower[3], Tower[0], Tower[2],Tower[6]];
            break;
          case Tower[4]:
            result = [Spa, Tower[4], Tower[1], Tower[7]];
            break;
          case Tower[5]:
            result = [Spa, Tower[5], Tower[2], Tower[8]];
            break;
          case Tower[6]:
            result = [Spa, Tower[6], Tower[3], Tower[9]];
            break;
          case Tower[7]:
            result = [Spa, Tower[7], Tower[4], attackLocation[0],publicItem[0]];
            break;
          case Tower[8]:
            result = [Spa, Tower[8], Tower[5], attackLocation[1],publicItem[0],publicItem[1]];
            break;
          case Tower[9]:
            result = [Spa, Tower[9], Tower[6], attackLocation[2],publicItem[1]];
            break;
          default:
            break;
        }
      }else if(blueWilder.indexOf(location)!=-1){
        switch (location) {
          case blueWilder[0]:
            result = [Spa, blueWilder[0], blueWilder[1], blueWilder[2]];
            break;
          case blueWilder[1]:
            result = [Spa, blueWilder[1], blueWilder[0], publicItem[0]];
            break;
          case blueWilder[2]:
            result = [Spa, blueWilder[2], Tower[2], blueWilder[0]];
            break;
          case blueWilder[3]:
            result = [Spa, blueWilder[3], blueWilder[4], blueWilder[5]];
            break;
          case blueWilder[4]:
            result = [Spa, blueWilder[4], blueWilder[3], publicItem[1]];
            break;
          case blueWilder[5]:
            result = [Spa, blueWilder[5], Tower[2], blueWilder[3]];
            break;
          default:
            break;
        }
      }else if(publicItem.indexOf(location)!=-1){
        switch (location) {
          case publicItem[0]:
            result = [Spa, publicItem[0], Tower[7], Tower[8], blueWilder[1], attackLocation[0], attackLocation[1]];
            break;
          case publicItem[1]:
            result = [Spa, publicItem[1], Tower[8], Tower[9], blueWilder[4], attackLocation[1], attackLocation[2]];
            break;
          default:
            break;
        }
      }else if(attackLocation.indexOf(location)!=-1){
        switch (location) {
          case attackLocation[0]:
            result = [Spa, attackLocation[0], Tower[7], publicItem[0]];
            break;
          case attackLocation[1]:
            result = [Spa, attackLocation[1], Tower[8], publicItem[0], publicItem[1]];
            break;
          case attackLocation[2]:
            result = [Spa, attackLocation[2], Tower[9], publicItem[1]];
            break;
          default:
            break;
        }
      }
    }else if(camp==="Red"){
      if(Tower.indexOf(location)!=-1){
        switch (location) {
          //包括回溫泉、停留(選擇原先位置)
          case spa:
            result = [Spa, Tower[0], Tower[1], Tower[3]];
            break;
          case Tower[0]:
            result = [Spa, Tower[0], Tower[1], Tower[2], Tower[3]];
            break;
          case Tower[1]:
            result = [Spa, Tower[1], Tower[0], Tower[2], Tower[4]];
            break;
          case Tower[2]:
            result = [Spa, Tower[2], Tower[0], Tower[1], Tower[3], Tower[5], redWilder[2], redWilder[5]];
            break;
          case Tower[3]:
            result = [Spa, Tower[3], Tower[0], Tower[2],Tower[6]];
            break;
          case Tower[4]:
            result = [Spa, Tower[4], Tower[1], Tower[7]];
            break;
          case Tower[5]:
            result = [Spa, Tower[5], Tower[2], Tower[8]];
            break;
          case Tower[6]:
            result = [Spa, Tower[6], Tower[3], Tower[9]];
            break;
          case Tower[7]:
            result = [Spa, Tower[7], Tower[4], attackLocation[0],publicItem[0]];
            break;
          case Tower[8]:
            result = [Spa, Tower[8], Tower[5], attackLocation[1],publicItem[0],publicItem[1]];
            break;
          case Tower[9]:
            result = [Spa, Tower[9], Tower[6], attackLocation[2],publicItem[1]];
            break;
          default:
            break;
        }
      }else if(redWilder.indexOf(location)!=-1){
        switch (location) {
          case redWilder[0]:
            result = [Spa, redWilder[0], redWilder[1], redWilder[2]];
            break;
          case redWilder[1]:
            result = [Spa, redWilder[1], redWilder[0], publicItem[0]];
            break;
          case redWilder[2]:
            result = [Spa, redWilder[2], Tower[2], redWilder[0]];
            break;
          case redWilder[3]:
            result = [Spa, redWilder[3], redWilder[4], redWilder[5]];
            break;
          case redWilder[4]:
            result = [Spa, redWilder[4], redWilder[3], publicItem[1]];
            break;
          case redWilder[5]:
            result = [Spa, redWilder[5], Tower[2], redWilder[3]];
            break;
          default:
            break;
        }
      }else if(publicItem.indexOf(location)!=-1){
        switch (location) {
          case publicItem[0]:
            result = [Spa, publicItem[0], Tower[7], Tower[8], redWilder[1], attackLocation[0], attackLocation[1]];
            break;
          case publicItem[1]:
            result = [Spa, publicItem[1], Tower[8], Tower[9], redWilder[4], attackLocation[1], attackLocation[2]];
            break;
          default:
            break;
        }
      }else if(attackLocation.indexOf(location)!=-1){
        switch (location) {
          case attackLocation[0]:
            result = [Spa, attackLocation[0], Tower[7], publicItem[0]];
            break;
          case attackLocation[1]:
            result = [Spa, attackLocation[1], Tower[8], publicItem[0], publicItem[1]];
            break;
          case attackLocation[2]:
            result = [Spa, attackLocation[2], Tower[9], publicItem[1]];
            break;
          default:
            break;
        }
      }
    }
    resolve(result);
  });
}

exports.selectCombatService = function (camp, location, enemyLocation, privateWilder, publicWilder, playerAbility) {
  return new Promise(function(resolve, reject) {
    const stop = "stop";
    var result = {combat:[],goal:[]};
    var ability = [];
    // location="Baron";
    // enemyLocation="Baron";
    if(playerAbility["Q"].round==0) ability.push("Q");
    if(playerAbility["W"].round==0) ability.push("W");
    if(playerAbility["E"].round==0) ability.push("E");
    if(playerAbility["R"].round==0) ability.push("R");

    if(camp==="Blue"){
      if(Spa.indexOf(location)!=-1 || Tower.indexOf(location)!=-1){
        result.combat = [stop];
      }else if(blueWilder.indexOf(location)!=-1){
        switch(location){
          case blueWilder[0]:
            if(privateWilder[blueWilder[0]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [blueWilder[0]];
            }else{
              result.combat = [stop];
            }
            break;
          case blueWilder[1]:
            if(privateWilder[blueWilder[1]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [blueWilder[1]];
            }else{
              result.combat = [stop];
            }
            break;
          case blueWilder[2]:
            if(privateWilder[blueWilder[2]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [blueWilder[2]];
            }else{
              result.combat = [stop];
            }
            break;
          case blueWilder[3]:
            if(privateWilder[blueWilder[3]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [blueWilder[3]];
            }else{
              result.combat = [stop];
            }
            break;
          case blueWilder[4]:
            if(privateWilder[blueWilder[4]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [blueWilder[4]];
            }else{
              result.combat = [stop];
            }
            break;
          case blueWilder[5]:
            if(privateWilder[blueWilder[5]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [blueWilder[5]];
            }else{
              result.combat = [stop];
            }
            break;
        }
      }else if(publicItem.indexOf(location)!=-1){
        switch(location){
          case publicItem[0]:
              if(JSON.parse(publicWilder.baron)["status"]=="dead"){
                ability.push(stop);
                result.combat = ability;
                result.goal = [publicItem[0]];
              }else{
                result.combat = [stop];
              }
            break;
          case publicItem[1]:
              if(JSON.parse(publicWilder.fireDragon)["status"]!="dead"){
                ability.push(stop);
                result.combat = ability;
                result.goal = [publicItem[1]];
              }else if(JSON.parse(publicWilder.waterDragon)["status"]!="dead"){
                ability.push(stop);
                result.combat = ability;
                result.goal = [publicItem[1]];
              }else if(JSON.parse(publicWilder.earthDragon)["status"]!="dead"){
                ability.push(stop);
                result.combat = ability;
                result.goal = [publicItem[1]];
              }else{
                result.combat = [stop];
              }
            break;
        }
      }else{
        result.combat = [stop];
      }
    }else if(camp==="Red"){
      if(Spa.indexOf(location)!=-1 || Tower.indexOf(location)!=-1){
        result.combat = [stop];
      }else if(redWilder.indexOf(location)!=-1){
        switch(location){
          case redWilder[0]:
            if(privateWilder[redWilder[0]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [redWilder[0]];
            }else{
              result.combat = [stop];
            }
            break;
          case redWilder[1]:
            if(privateWilder[redWilder[1]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [redWilder[1]];
            }else{
              result.combat = [stop];
            }
            break;
          case redWilder[2]:
            if(privateWilder[redWilder[2]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [redWilder[2]];
            }else{
              result.combat = [stop];
            }
            break;
          case redWilder[3]:
            if(privateWilder[redWilder[3]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [redWilder[3]];
            }else{
              result.combat = [stop];
            }
            break;
          case redWilder[4]:
            if(privateWilder[redWilder[4]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [redWilder[4]];
            }else{
              result.combat = [stop];
            }
            break;
          case redWilder[5]:
            if(privateWilder[redWilder[5]]["status"]!="dead"){
              ability.push(stop);
              result.combat = ability;
              result.goal = [redWilder[5]];
            }else{
              result.combat = [stop];
            }
            break;
        }
      }else if(publicItem.indexOf(location)!=-1){
        switch(location){
          case publicItem[0]:
              if(JSON.parse(publicWilder.baron)["status"]!="dead"){
                ability.push(stop);
                result.combat = ability;
                result.goal = [publicItem[0]];
              }else{
                result.combat = [stop];
              }
            break;
          case publicItem[1]:
              if(JSON.parse(publicWilder.fireDragon)["status"]!="dead"){
                ability.push(stop);
                result.combat = ability;
                result.goal = [publicItem[1]];
              }else if(JSON.parse(publicWilder.waterDragon)["status"]!="dead"){
                ability.push(stop);
                result.combat = ability;
                result.goal = [publicItem[1]];
              }else if(JSON.parse(publicWilder.earthDragon)["status"]!="dead"){
                ability.push(stop);
                result.combat = ability;
                result.goal = [publicItem[1]];
              }else{
                result.combat = [stop];
              }
            break;
        }
      }else{
        result.combat = [stop];
      }
    }
    if(location===enemyLocation){
      if((result.combat.length)===1){
        ability.push(stop);
        result.combat = ability;
      }
      (result.goal).push("enemy");
    }
    resolve(result);
  });
}

const checkEnemyPlayerDB = function(damage,result){
  if(result.enemyPlayerData["blood"]-damage<=0){
    result.enemyPlayerData["status"] = "dead";
    result.enemyPlayerData["round"] = "8";
    // result.enemyPlayerData["blood"] = 600+(result.enemyPlayerData["rank"]-1)*50;
    result.enemyPlayerData["blood"] = "0";
  }else{
    result.enemyPlayerData["blood"] = result.enemyPlayerData["blood"] - damage;
  }
  return result;
}

const checkEnemyMemberDB = function(damage,result,set,Tower){
  if(result.enemyMemberData[set]["blood"]-damage<=0){
    result.enemyMemberData[set]["status"] = "dead";
    result.enemyMemberData[set]["round"] = "8";
    if(set=="nexus") result.enemyMemberData[set]["blood"] = "1800";
    else result.enemyMemberData[set]["blood"] = "600";
    return checkEnemyTowerDB(damage,result,set,Tower);
  }else{
    result.enemyMemberData[set]["blood"] = result.enemyMemberData[set]["blood"] - damage;
  }
  return result;
}

const checkPublicWilderDB = function(damage,result,set,round,attack){
  var wilderData = JSON.parse(result.publicWilder[set]);
  if(wilderData["blood"]-damage<=0){
    wilderData["status"] = "dead";
    wilderData["round"] = round;
    wilderData["blood"] = "0";
  }else{
    wilderData["blood"] = wilderData["blood"] - damage;
  }
  result.publicWilder[set] = JSON.stringify(wilderData);

  if(result.playerData["blood"]-attack<=0){
    result.playerData["status"] = "dead";
    result.playerData["round"] = "8";
    // result.playerData["blood"] = 600+(result.playerData["rank"]-1)*50;
    result.playerData["blood"] = "0";
  }else{
    result.playerData["blood"] = result.playerData["blood"] - attack;
  }

  return result;
}

const checkPrivateWilderDB = function(damage,result,set){
  if(result.privateWilder[set]["blood"]-damage<=0){
    result.privateWilder[set]["status"] = "dead";
    result.privateWilder[set]["round"] = "8";
    result.privateWilder[set]["blood"] = "0";
    if(result.playerData["exp"]+50>=100){
      result.playerData["rank"] = parseInt(result.playerData["rank"])+1;
      result.playerData["exp"] = (parseInt(result.playerData["exp"])+50)-100;
      result.playerData["blood"] = parseInt(result.playerData["blood"])+50;
      result.ability["Q"].damage = parseInt(result.ability["Q"].damage)+20;
      result.ability["W"].damage = parseInt(result.ability["W"].damage)+20;
      result.ability["E"].damage = parseInt(result.ability["E"].damage)+20;
      result.ability["R"].damage = parseInt(result.ability["R"].damage)+20;
    }else{
      result.playerData["exp"] = parseInt(result.playerData["exp"])+50;
    }
  }else{
    result.privateWilder[set]["blood"] = result.privateWilder[set]["blood"] - damage;
  }

  if(result.playerData["blood"]-70<=0){
    result.playerData["status"] = "dead";
    result.playerData["round"] = "8";
    // result.playerData["blood"] = 600+(result.playerData["rank"]-1)*50;
    result.playerData["blood"] = "0";
  }else{
    result.playerData["blood"] = result.playerData["blood"] - 70;
  }

  return result;
}

const checkEnemyTowerDB = function(damage,result,set,Tower){
  if(set==="top"){
    console.log(Tower[7]);
    console.log(result.enemyTowerData);
    if(result.enemyTowerData[Tower[7]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[7]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[7]]["status"] = "dead";
        result.enemyTowerData[Tower[7]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[7]]["blood"] = result.enemyTowerData[Tower[7]]["blood"] - damage;
      }
    }else if(result.enemyTowerData[Tower[4]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[4]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[4]]["status"] = "dead";
        result.enemyTowerData[Tower[4]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[4]]["blood"] = result.enemyTowerData[Tower[4]]["blood"] - damage;
      }
    }else if(result.enemyTowerData[Tower[1]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[1]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[1]]["status"] = "dead";
        result.enemyTowerData[Tower[1]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[1]]["blood"] = result.enemyTowerData[Tower[1]]["blood"] - damage;
      }
    }else{
      if(result.enemyTowerData[Tower[0]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[0]]["status"] = "dead";
        result.enemyTowerData[Tower[0]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[0]]["blood"] = result.enemyTowerData[Tower[0]]["blood"] - damage;
      }
    }
  }else if(set==="middle"){
    if(result.enemyTowerData[Tower[8]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[8]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[8]]["status"] = "dead";
        result.enemyTowerData[Tower[8]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[8]]["blood"] = result.enemyTowerData[Tower[8]]["blood"] - damage;
      }
    }else if(result.enemyTowerData[Tower[5]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[5]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[5]]["status"] = "dead";
        result.enemyTowerData[Tower[5]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[5]]["blood"] = result.enemyTowerData[Tower[5]]["blood"] - damage;
      }
    }else if(result.enemyTowerData[Tower[2]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[2]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[2]]["status"] = "dead";
        result.enemyTowerData[Tower[2]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[2]]["blood"] = result.enemyTowerData[Tower[2]]["blood"] - damage;
      }
    }else{
      if(result.enemyTowerData[Tower[0]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[0]]["status"] = "dead";
        result.enemyTowerData[Tower[0]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[0]]["blood"] = result.enemyTowerData[Tower[0]]["blood"] - damage;
      }
    }
  }else if(set==="under"){
    if(result.enemyTowerData[Tower[9]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[9]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[9]]["status"] = "dead";
        result.enemyTowerData[Tower[9]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[9]]["blood"] = result.enemyTowerData[Tower[9]]["blood"] - damage;
      }
    }else if(result.enemyTowerData[Tower[6]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[6]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[6]]["status"] = "dead";
        result.enemyTowerData[Tower[6]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[6]]["blood"] = result.enemyTowerData[Tower[6]]["blood"] - damage;
      }
    }else if(result.enemyTowerData[Tower[3]]["status"]==="alive"){
      if(result.enemyTowerData[Tower[3]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[3]]["status"] = "dead";
        result.enemyTowerData[Tower[3]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[3]]["blood"] = result.enemyTowerData[Tower[3]]["blood"] - damage;
      }
    }else{
      if(result.enemyTowerData[Tower[0]]["blood"]-damage<=0){
        result.enemyTowerData[Tower[0]]["status"] = "dead";
        result.enemyTowerData[Tower[0]]["blood"] = "0";
      }else{
        result.enemyTowerData[Tower[0]]["blood"] = result.enemyTowerData[Tower[0]]["blood"] - damage;
      }
    }
  }else if(set==="nexus"){
    if(result.enemyTowerData[Tower[0]]["blood"]-damage<=0){
      result.enemyTowerData[Tower[0]]["status"] = "dead";
      result.enemyTowerData[Tower[0]]["blood"] = "0";
    }else{
      result.enemyTowerData[Tower[0]]["blood"] = result.enemyTowerData[Tower[0]]["blood"] - damage;
    }
  }
  return result;
}

exports.checkCombatService = function (camp,target,goalLocation,combat,privateWilder,publicWilder,playerData,ability,enemyPlayerData,enemyTowerData,enemyMemberData,enemySoldierData){
  return new Promise(function(resolve, reject) {
    var result={
      privateWilder:privateWilder,
      publicWilder:publicWilder,
      playerData:playerData,
      ability:ability,
      enemyPlayerData:enemyPlayerData,
      enemyTowerData:enemyTowerData,
      enemyMemberData:enemyMemberData,
      enemySoldierData:enemySoldierData
    };
    var damage = ability[combat].damage;
    if(camp==="Blue"){
      // 目標 敵方角色
      if(Tower.indexOf(goalLocation)!=-1 || Spa.indexOf(goalLocation)!=-1){
        if(target==="EAvatar"){
          result = checkEnemyPlayerDB(damage,result);
        }
      }
      // 目標 線上英雄 敵方角色
      if(attackLocation.indexOf(goalLocation)!=-1){
        if(target==="EAvatar"){
          result = checkEnemyPlayerDB(damage,result);
        }else if(target==="EHeroBtn"){
          if(goalLocation===attackLocation[0] || goalLocation===attackLocation[3] || goalLocation===attackLocation[6]){
            result = checkEnemyMemberDB(damage,result,"top",eTower);
          }else if(goalLocation===attackLocation[1] || goalLocation===attackLocation[4] || goalLocation===attackLocation[7]){
            result = checkEnemyMemberDB(damage,result,"middle",eTower);
          }else if(goalLocation===attackLocation[2] || goalLocation===attackLocation[5] || goalLocation===attackLocation[8]){
            result = checkEnemyMemberDB(damage,result,"under",eTower);
          }else if(goalLocation===attackLocation[9]){
            result = checkEnemyMemberDB(damage,result,"nexus",eTower);
          }
        }
      }
      // 目標 八龍 小龍 敵方角色
      if(publicItem.indexOf(goalLocation)!=-1){
        if(target==="EAvatar"){
          result = checkEnemyPlayerDB(damage,result);
        }else if(target==="Wild"){
          if(goalLocation===publicItem[0]){
            result = checkPublicWilderDB(damage,result,"baron","25",200);
          }else if(goalLocation===publicItem[1]){
            result = checkPublicWilderDB(damage,result,"fireDragon","10",110);
          }
        }
      }
      // 目標 野怪 敵方角色
      if(blueWilder.indexOf(goalLocation)!=-1){
        if(target==="EAvatar"){
          result = checkEnemyPlayerDB(damage,result);
        }else if(target==="Wild"){
          if(goalLocation===blueWilder[0]){
            result = checkPrivateWilderDB(damage,result,blueWilder[0],camp);
          }else if(goalLocation===blueWilder[1]){
            result = checkPrivateWilderDB(damage,result,blueWilder[1],camp);
          }else if(goalLocation===blueWilder[2]){
            result = checkPrivateWilderDB(damage,result,blueWilder[2],camp);
          }else if(goalLocation===blueWilder[3]){
            result = checkPrivateWilderDB(damage,result,blueWilder[3],camp);
          }else if(goalLocation===blueWilder[4]){
            result = checkPrivateWilderDB(damage,result,blueWilder[4],camp);
          }else if(goalLocation===blueWilder[5]){
            result = checkPrivateWilderDB(damage,result,blueWilder[5],camp);
          }
        }
      }
    }else if(camp==="Red"){
      // 目標 敵方角色
      if(Tower.indexOf(goalLocation)!=-1 || Spa.indexOf(goalLocation)!=-1){
        if(target==="EAvatar"){
          result = checkEnemyPlayerDB(damage,result);
        }
      }
      // 目標 線上英雄 敵方角色
      if(eattackLocation.indexOf(goalLocation)!=-1){
        if(target==="EAvatar"){
          result = checkEnemyPlayerDB(damage,result);
        }else if(target==="EHeroBtn"){
          if(goalLocation===eattackLocation[0] || goalLocation===eattackLocation[3] || goalLocation===eattackLocation[6]){
            result = checkEnemyMemberDB(damage,result,"top",Tower);
          }else if(goalLocation===eattackLocation[1] || goalLocation===eattackLocation[4] || goalLocation===eattackLocation[7]){
            result = checkEnemyMemberDB(damage,result,"middle",Tower);
          }else if(goalLocation===eattackLocation[2] || goalLocation===eattackLocation[5] || goalLocation===eattackLocation[8]){
            result = checkEnemyMemberDB(damage,result,"under",Tower);
          }else if(goalLocation===eattackLocation[9]){
            result = checkEnemyMemberDB(damage,result,"nexus",Tower);
          }
        }
      }
      // 目標 八龍 小龍 敵方角色
      if(publicItem.indexOf(goalLocation)!=-1){
        if(target==="EAvatar"){
          result = checkEnemyPlayerDB(damage,result);
        }else if(target==="Wild"){
          if(goalLocation===publicItem[0]){
            result = checkPublicWilderDB(damage,result,"baron","25",200);
          }else if(goalLocation===publicItem[1]){
            result = checkPublicWilderDB(damage,result,"fireDragon","10",110);
          }
        }
      }
      // 目標 野怪 敵方角色
      if(redWilder.indexOf(goalLocation)!=-1){
        if(target==="EAvatar"){
          result = checkEnemyPlayerDB(damage,result);
        }else if(target==="Wild"){
          if(goalLocation===redWilder[0]){
            result = checkPrivateWilderDB(damage,result,redWilder[0]);
          }else if(goalLocation===redWilder[1]){
            result = checkPrivateWilderDB(damage,result,redWilder[1]);
          }else if(goalLocation===redWilder[2]){
            result = checkPrivateWilderDB(damage,result,redWilder[2]);
          }else if(goalLocation===redWilder[3]){
            result = checkPrivateWilderDB(damage,result,redWilder[3]);
          }else if(goalLocation===redWilder[4]){
            result = checkPrivateWilderDB(damage,result,redWilder[4]);
          }else if(goalLocation===redWilder[5]){
            result = checkPrivateWilderDB(damage,result,redWilder[5]);
          }
        }
      }
    }
    resolve(result);
  });
}
