const { re } = require('mathjs');
const db = require('./database')
const imgGen = require('./HTML2IMG');



exports.changeUser = async function (deckid, userid, username, oldUserid) {
  deckData = await db.get(`usersDecks.${deckid}`)

  newData = deckData
  newData.user.id = userid
  newData.user.name = username

  await db.set(`usersDecks.${deckid}`, newData)
  await db.set(`user.${userid}.decks.${deckid}`, newData)
   
  await db.delete(`user.${oldUserid}.decks.${deckid}`)


  return `Deck ${deckid} has been changed to ${username} (${userid})`;
}

exports.get = async function (deckData) {
  if (!deckData) return;
  await db.add(`deckStats.${deckData.id}.views`, 1)
  deckHTML = []
  setLeader = false
  for (unit of deckData.units) {

    if (setLeader == false) {
      deckHTML.push(`
        <div class="unit-card leader-card">
            <div class="leader-tag">LEADER</div>
            <div class="unit-img-cont">
              <img src="http://localhost:8008/gbl/${unit.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.png">
            </div>
          </div>
          `)
      setLeader = true
    } else {
      deckHTML.push(`
        <div class="unit-card">
            <div class="unit-img-cont">
              <img src="http://localhost:8008/gbl/${unit.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.png">
            </div>
          </div>
          `)
    }


  }
  var finalHTML = `

  <style>
  *{font-family:"Poppins",sans-serif}.deck-card{background:linear-gradient(to bottom,rgba(255,162,76,113),rgba(255,185,76));color:#462b00;width:1250px;height:auto;border-radius:25px;display:flex;flex-wrap:wrap;position:relative;padding:25px;row-gap:25px;column-gap:25px;justify-content:space-between;overflow:hidden;position:relative}.unit-card{background:rgba(255,185,76);border:5px solid rgb(255,162,113);width:22%;flex:1 1 22%;height:283.75px;border-radius:15px;position:relative;display:flex;justify-content:center;align-items:center;box-shadow:0 2px 4px rgb(255,162,113)}.leader-card{border-color:rgb(76,146,255)}.leader-tag{background:rgb(76,146,255);color:#fff;font-size:24px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px;text-align:center;position:absolute;top:-20px;left:50%;transform:translatex(-50%);padding-left:15px;padding-right:15px;z-index:9}.unit-img-cont{max-width:300px;max-height:180px;margin:auto;display:flex;justify-content:center;align-items:center}.unit-img-cont img{max-height:190px;max-width:95%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));filter:drop-shadow(0 2px 3px rgba(76,146,255,.4));display:block}.cost{display:none;position:absolute;bottom:10px;right:25px;background:#4c92ff;padding:15px;font-size:20px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px}.full{width:100%}.half{width:50%}.centered{display:flex;justify-content:center;align-items:center}.title{font-size:34px;font-weight:600;letter-spacing:.25px;color:#003735;margin-top:8px;margin-bottom:0;text-align:center;z-index:100}.small-title{font-size:17px;font-weight:600;letter-spacing:.15px;color:#003735;margin-top:0;margin-bottom:0;text-align:center;z-index:100}.credit-img{position:absolute;height:75px;display:block;bottom:5px;right:5px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1));z-index:100}
  </style>
  <div class="deck-card">
  <img class="credit-img" src="http://localhost:8008/gbl/pelops/Pelops_II.webp">
  <div class="title full">${deckData.details.name}
  <div class="small-title full">Made by ${deckData.user.name}</div>
  </div>
      ${deckHTML.join('')}
    </div>
      `
  var img = await imgGen.cluster(finalHTML, '.deck-card');

  return img
}