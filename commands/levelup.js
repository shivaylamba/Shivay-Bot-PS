/**
 * Commands
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file contains the base commands for Cassius.
 *
 * @license MIT license
 */

'use strict';

// Users who use the settour command when a tournament is already
// scheduled will be added here and prompted to reuse the command.
// This prevents accidentally overwriting a scheduled tournament.
/**@type {Map<string, string>} */
let overwriteWarnings = new Map();

//const juration = require('./lib/juration');
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const http = require("https");
let geoip = require("geoip-lite");
let repeatTimers = {};
var first = true;

const gifts = ["A new pair of pants", "A hug C:", "The new copy of sun and moon you were hoping for!"];
const jokes = ["How does a tree go? It leaves.",
			  /*"Why didn't the skeleton go to the party? He had no-body to dance with!",
			  "Why didn't the skeleton cross the road? Because he didn't have the guts!",
			   '"Somebody told me you remind them of an owl." "Who?"',
			   "How do you make an octopus laugh? With ten-tickles!",
			   "What's an octupus' favorite dessert? Octo-pi!",
			   "This joke is like a bar at a wedding; it has no punchline.",
			   'There were two twins named Juan and Amal. I saw a picture of Juan, and wanted to see Amal to compare them, but my friend said, "once you\'ve seen Juan you\'ve seen Amal.',
			   "What do you call an alligator in a vest? An investigator!",
			   "Whats a ghosts favorite fruit? Booberries.",
			   "Whats a vampires favorite fruit? Necktarines.",
			   "Terrorist: We are planning to kill 14 thousand people and a donkey.",
			   "What do you call it when you Santa stops moving? Santa Pause."*/
               "David: I love her so much <br> Richard: She’s just 14 and you are 28 <br> David: Age is just a number <br> Richard: And jail is just a room",
        "Boy: Hey, you look so beautiful <br> Girl: Aww. Thank you. I don’t know what to say.<br> Boy: Just lie something, like I did",
      "Graham Alexander Bell: I used to study under a candle <br> William Shakespeare: I used to study under street light <br> My BF: What did you guys do during the daytime?",
    "Wife: Look at that drunk guy <br> Husband: Who is he?<br> Wife: 10 years ago he proposed me and I rejected him <br> Husband: Oh my God. He is still celebrating.",        
     " Me: Would you like to be the sun in my life?<br> Her: Awww... Yes!!!<br> Me: Good then stay 92.96 million miles away from me",         
				];

function getDatabase(room) {
	// In case a Room object was passed:
	if (room instanceof Rooms.Room) room = room.id;
	let database = Storage.getDatabase(room);
	if (!database.logs) database.logs = [];
	if (!database.defaultRanks) {
		// This plugin allows the changing of which auth level(s)
		// have the ability to modify the room's logs database.
		// Along with setting a default logs rank, this allows
		// other rooms to add default ranks in this object.
		database.defaultRanks = {};
		database.defaultRanks['logs'] = '+';
	}
	return database;
}



/**@type {{[k: string]: Command | string}} */
let commands = {
	// Developer commands
  
  
  
  
  
  
	js: 'eval',
	eval: function (target, room, user) {
		if (!user.isDeveloper()) return;
		try {
			target = eval(target);
			this.say(JSON.stringify(target));
		} catch (e) {
			this.say(e.name + ": " + e.message);
		}
    	let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
    
  
  level : function (target, room, user){
    let level,exps;
    let roomid = room.id;
    target = target.toLowerCase();
    if(!target) target = user.id;
  if(!Config.level.includes(room.id)) return;
     level = Storage.databases[roomid].explevels[target].Lvls;
    exps = Storage.databases[roomid].explevels[target].Exps;
    this.say("**" + Users.get(target).name + "** : [ level - " + level + ", Exps - " + exps + "]");
  },
  
  
  
  test : function(target, room, user) {
    var a = Users.users.truthuntold.rooms;
    var b = Object.keys(a);
    var c = Object.values(a);
    this.say(b[0]);
    
  },
  
  
  
  
  
    rlog: 'roomlog',
    roomlog: function(target, room, user) {
      
      let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
      
        	//if (room instanceof Users.User || !user.hasRank(room, '+')) return;
		//let logs = getDatabase(room.id).logs;
		//if (!quotes.length) return this.say("This room doesn't have any quotes.");
		let prettifiedLogs = "Botlogs for " + room.id + ":\n\n" + logs.map(
			/**
			 * @param {string} quote
			 * @param {number} index
			 */
			(log, index) => (index + 1) + ": " + log
		).join("\n");
		Tools.uploadToHastebin(prettifiedLogs, /**@param {string} hastebinUrl */ hastebinUrl => {
			this.say("Bot Logs: " + hastebinUrl);
		});
    },
  
  justdoit : function(target, room, user) {
    this.say("/makegroupchat Enjoyment");
   let name = "groupchat-truthuntold-enjoyment";
    let gc = Rooms.get(name);
    gc.say("/invite pokem9n");
  },
  
  memuse : 'memoryusage',
  memoryusage : function(target, room, user){
    let memUsage = process.memoryUsage();
let results = [memUsage.rss, memUsage.heapUsed, memUsage.heapTotal];
let units = ["B", "KiB", "MiB", "GiB", "TiB"];
for (let i = 0; i < results.length; i++) {
    let unitIndex = Math.floor(Math.log2(results[i]) / 10); // 2^10 base log
    results[i] = `${(results[i] / Math.pow(2, 10 * unitIndex)).toFixed(2)} ${units[unitIndex]}`;
}
this.say(`RSS: ${results[0]}, Heap: ${results[1]} / ${results[2]}`);
  },
  
  
  
  clog: 'clearlog',
  clearlog: function(target, room, user) {
    if(!user.isDeveloper()) return;
    let infinite = 10000000 * 10000000;
     let database = getDatabase(room.id);
      	let logs = database.logs;
    		let prettifiedLogs = "Botlogs for " + room.id + ":\n\n" + logs.map(
			/**
			 * @param {string} quote
			 * @param {number} index
			 */ " "
			
		).join("");
		Tools.uploadToHastebin(prettifiedLogs, /**@param {string} hastebinUrl */ hastebinUrl => {
			this.say("Bot Logs: " + hastebinUrl);
		});
		Storage.exportDatabase(room.id);
    this.say("Successfully cleared Bot logs for this room");
  },
    

  profilehelp : function(target, room, user) {
    this.say("``&addstatus status`` adds a status ``&addfavpoke name`` adds a favourite Pokemon ``&addcountry name`` adds country name ``&addfontcolor`` adds a font color ``&addprofilecolor`` adds a profile background color");
    this.say("``&removestatus status`` removes the current status ``&removefavpoke`` removes current poke ``&removecountry`` removes current country");
    
  },
  
  
  alts : function (target, room, user){
    let trgUser = user.id;
    if(target) trgUser = target.toLowerCase();
    let alts = Storage.databases[room.id].alts[trgUser].alt;
   // alts = alts.split(",");
    this.say("**" + trgUser + "'s** alts are : "+ alts);
  },
    
  
  
  
  
	// General commands

	help: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '+')) return;
		if (!Config.guide) return this.say("There is no guide available.");
		this.say(Users.self.name + " guide: " + Config.guide);
    
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
    
	},
	
	mail: function (target, room, user) {
		if (!(room instanceof Users.User) || !Config.allowMail) return;
		let targets = target.split(',');
		if (targets.length < 2) return this.say("Please use the following format: .mail user, message");
		let to = Tools.toId(targets[0]);
		if (!to || to.length > 18 || to === Users.self.id || to.startsWith('guest')) return this.say("Please enter a valid username");
		let message = targets.slice(1).join(',').trim();
		let id = Tools.toId(message);
		if (!id) return this.say("Please include a message to send.");
		if (message.length > (258 - user.name.length)) return this.say("Your message is too long.");
		let database = Storage.getDatabase('global');
		if (to in database.mail) {
			let queued = 0;
			for (let i = 0, len = database.mail[to].length; i < len; i++) {
				if (Tools.toId(database.mail[to][i].from) === user.id) queued++;
			}
			if (queued >= 3) return this.say("You have too many messages queued for " + Users.add(targets[0]).name + ".");
		} else {
			database.mail[to] = [];
		}
		database.mail[to].push({time: Date.now(), from: user.name, text: message});
		Storage.exportDatabase('global');
		this.say("Your message has been sent to " + Users.add(targets[0]).name + "!");
    
    	let database2 = getDatabase(room.id);
    	let logs = database2logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
    
	},
  
  
  
  about : function(target, room, user){
    this.say(Config.username + " Code by sirDonovan and Pokem9n :- https://github.com/Zerapium/Truth-Untold-Bot");
  },
	
	seerepeats: 'seerepeat',
	seerepeat: function (target, room, user) {
		if (!user.isDeveloper()) return;
		Tools.uploadToHastebin(JSON.stringify(Storage.globalDatabase.repeat), /**@param {string} hastebinUrl */ hastebinUrl => {
			this.say("All repeats: " + hastebinUrl);
		});
    	let database2 = getDatabase(room.id);
    	let logs = database2logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
	
	settopic: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '@') && !user.isDeveloper()) return;
		if (room instanceof Users.User) {
			var res = target.split(",");
			if (res.length === 1) {
				this.say("Format: ~settopic room|topic");
			} else {
				var roomid = res[0].toLowerCase().replace(/\s/g, '');
				var roomobj = Rooms.rooms[roomid];
				if (!user.hasRank(roomobj, '@') && !user.isDeveloper()) {this.say("Insufficient privileges."); return;}
				global.topic[roomid] = res[1];
				this.say("Topic set in "+roomid+".");
			}
		} else {
			global.topic[room.id] = target;
			this.say("Topic set.");
		}
  let database2 = getDatabase(room.id);
    	let logs = database2logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
	
	settopichtml: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '@') && !user.isDeveloper()) return;
		if (room instanceof Users.User) {
			var res = target.split("|");
			if (res.length === 1) {
				this.say("Format: ~settopichtml room|topic");
			} else {
				var roomid = res[0].toLowerCase().replace(/\s/g, '');
				var roomobj = Rooms.rooms[roomid];
				if (!user.hasRank(roomobj, '@') && !user.isDeveloper()) {this.say("Insufficient privileges."); return;}
				global.topic[roomid] = "/adduhtml t, "+res[1]+"<style>";
				this.say("Topic set in "+roomid+".");
			}
		} else {
			global.topic[room.id] = "/adduhtml t, "+target+"<style>";
			this.say("Topic set.");
		}
    
 let database2 = getDatabase(room.id);
    	let logs = database2logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
	
	topic: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '%') && !user.isDeveloper()) return;
		if (global.topic[room.id]) {
			this.say(global.topic[room.id]);
		} else {
			this.say("No topic found for this room.");
		}
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
    
	},
	
	repeat: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '%') && !user.isDeveloper()) return;
		let targetRoom = this.room instanceof Users.User ? 'in PM' : this.room.id;
		if (targetRoom === 'lobby' && !user.hasRank(room, '@') && !user.isDeveloper()) return;
		let [interval, times, ...repeatMsg] = target.split(',');
		if (!(interval && times && repeatMsg.length)) return this.say("/w " + user.name + ", Syntax: ~repeat <interval>, <times>, <target to repeat>");
		if (!(Number(interval))){
		try {
			interval = Custom.parse(interval) * 1000;
		} catch(err) {
			interval = Number(interval) * MINUTE;
		}} else { interval = Number(interval) * MINUTE; }
		if (!interval) return this.say("/w " + user.name + ", Invalid value for interval.");
		if (interval < 5000) { interval = 5000; }
		times = Number(times);
		if (!times) return this.say("/w " + user.name + ", Invalid value for times");
		repeatMsg = repeatMsg.join(',').trim();
		if (repeatMsg.startsWith('/leave') || repeatMsg.startsWith('/part') || (repeatMsg.startsWith('/m') && !repeatMsg.startsWith('/me')) || repeatMsg.startsWith('/hm') || repeatMsg.startsWith('/roomban') || repeatMsg.startsWith('/rb') || repeatMsg.startsWith('/k') || repeatMsg.startsWith('/pm') || repeatMsg.startsWith('/warn')) return this.say("/w " + user.name + ", Please do not enter moderation commands in ``\\repeat``");
		let id = repeatMsg;
		let database = Storage.getDatabase('global');
		if (id in database.repeat) return this.say("/w " + user.name + ", This message is already being repeated.");
		let repeatObj = {msg: repeatMsg, timesLeft: times, interval: interval, room: this.room.id};
		database.repeat[id] = (repeatObj);
		repeatTimers[id] = setTimeout(() => runRepeat(id), interval);
		Storage.exportDatabase('global');
		return this.say(repeatMsg);

		function runRepeat(id) {
			let obj = database.repeat[id];
			if (!obj) return; // failsafe
			if (obj.timesLeft--) {
				Client.send(`${obj.room}|${obj.msg}`);
				repeatTimers[id] = setTimeout(() => runRepeat(id), obj.interval);
			} else {
				delete database.repeat[id];
				delete repeatTimers[id];
			}
			Storage.exportDatabase('global');
		}
  let database2 = getDatabase(room.id);
    	let logs = database2logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
    
	},
  
	clearrepeat: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '%') && !user.isDeveloper()) return;
		let id = target;
		let database = Storage.getDatabase('global');
		if (id in database.repeat) {
			delete database.repeat[id];
			delete repeatTimers[id];
			this.say("Message cleared.");
			Storage.exportDatabase('global');
		} else {return this.say("This message is not being repeated!");}
  let database2 = getDatabase(room.id);
    	let logs = database2logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
	
	
	randtopic: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '+')) return;
		var pokemonA = require('pokemon-random')();
		var pokemonB = require('pokemon-random')();
		var pokemonC = require('pokemon-random')();
		if (room.id == "lobby") {
			var questions = [
				"/wall How would you improve "+pokemonB+"?",
				"/wall Who would win: "+pokemonA+" or "+pokemonB+"?",
				"/wall Which would be more terrifying in real life: "+pokemonA+" or "+pokemonB+"?",
				"/wall Which Pokémon city or town would you want to live and why?",
			];
		}
			var rand = questions[Math.floor(Math.random() * questions.length)];
			this.say(rand);
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},


  uptime: function (target, room, user, pm) {
		let uptime = process.uptime();
		let uptimeText;
		if (uptime > 24 * 60 * 60) {
			let uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			let uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
		} else {
			uptimeText = Tools.toDurationString(uptime * 1000);
      let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
		}
		this.say("Uptime: **" + uptimeText + "**");
	},
	kill: function (target, room, user) {
    if (!user.isDeveloper()) return false;
	  console.log('Killed by ' + user.name);
	  process.exit(-1);
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
        },
  
  jc: 'joingroupchat',
  joingroupchat: function(target, room, user) {
    if(!user.isDeveloper()) return;
    let splitStr = target.split(",");
    if(splitStr.lenhath !== 2) return;
    let owner = splitStr[0];
    let roomname = splitStr[1];
    
    this.say("/join groupchat-" + owner.trim() + "-" + roomname.trim());
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
  },
  
  
  inv: 'invite',
  invite: function(target, room, user) {
    if(!user.hasRank(room,'+')) return;
    this.say("/invite " + target);
    this.say("/pm " + target + ",hello sir! I am just a bot created by Pokem9n, " + user.name + " forced me to invite you");
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
  },
  
  
  gamble: function (target, room, user) {
    this.say("<<casino> )");  this.say("/redirect " + user.name + ", Casino");
  },
  
  //summon games commands
  
  /*host: function(target, room, user) {
 if(room.game.name == "Summon")
   var host = user.name;
    this.say(user.name + " is host");
             },
  */
  
  //ROLEPLAY COMMANDS
  
  rintro : function(target, room, user){
var msg = "<div style='background-color:springgreen;border:8px solid blue; border-radius:30px;'><h1 align = 'center' style='color:brown; font-size:160%;border:2px solid black;border-radius:30px;'><font face='algerian'>Welcome To The Magical Room Of Roleplay!'</font></h1><p align = 'center' style='font-family:courier;font-size:160%;'><font color=tomato><b> 'Welcome to the magical world of roleplaying where your imagination is the limit!'</b><b> Here you can Roleplay with others, make friends and have fun!</b></font></p><b style='color:tomato;'>For new roleplayers please see the 'how to play'</b><ul type=disc style='color:tomato;'><li align=center><a href='https://docs.google.com/document/d/1ceoofOtMKFIxP3QOMHsQaubVUMZB75V_0oIxivuV0Vg/edit?usp=sharing'>How To Roleplay</a></li><li align= center><A href='https://docs.google.com/document/d/1D-gTgxPXb-KBsBANzHDaqjUjGgBfzyWgh0LeG9zUnjc/edit?usp=sharing'>Rulebook</a></li><li align=center><a href='https://pokemonshowdown.com/rules'>Ps rules</a></li></ul><marquee scrollAmount='5' height='20'style='color:red;background:skyblue;border:2px solid black;border-radius:20px;'> <b> Enjoy your stay here! </b></marquee></div>";
    this.sayHtml(msg);
  },
  
  
  
  
 profile: function(target, room, user){
 
    let realdate,userid,regDate,status,bits;
    userid = user.id; //
//  let realid = Users.get(target);
   target = target.toLowerCase();
   //target = target.toAlphaNumeric();

    if(target && target.length <= 18) userid = target;
  // if(target && !realid) return this.say("Invalid User Id");
   //userid = userid.toLowerCase();
    
      function getData(link, callback) {
          http.get(link, function(res) {
              var data = '';
              res.on('data', function(part) {
                  data += part;
              });
              res.on('end', function(end) {
                  callback(data);
              });
          });
      }
  
  function isDst(tarDate) {
                      var deezNuts = new Date(tarDate);
                      var deezMonth = deezNuts.getMonth() + 1;
                      var deezDay = deezNuts.getDate() + 1;
                      var deezDayofWeek = deezNuts.getDay();
                      if(deezMonth > 11 || deezMonth < 3){
                          return false;
                      }
                      if(deezMonth === 3){
                          if(deezDay - deezDayofWeek > 7){
                              return true;
                          }
                          return false;
                      }
                      if(deezMonth === 11){
                          if(deezDay - deezDayofWeek > 0){
                              return true
                          }
                          return false;
                      }
                      return true;
                  }
      getData('https://pokemonshowdown.com/users/' + userid + '.json', function(data) {
          try {
              data = JSON.parse(data);
          }
          catch (e) {
              room.say('ERROR in retrieving data.');
          }
                      let  regdate = (data.registertime * 1000) + (new Date().getTimezoneOffset() * 60 * 1000) - 364000;
                      let realdate = Tools.getTimeAgo(regdate);    
               let age;
                  age = data.registertime * 1000 - (1000 * 60 * 60 * 5) + (new Date().getTimezoneOffset() * 60 * 1000) - 364000;
                  if(isDst(age)) age = age + 3600000;
                  var regDate = (new Date(age)).toString().substr(4, 20);
                //  room.say(realdate + regDate);
                  
                let bits,rank;
//    status = "none";
  bits = "none";
        rank = "Regular";
        if(userid === "pokem9n" || userid === "shivay") rank = "Developer";
        //let user = target ? Tools.told(target) : user.id;
        
   // if(Users(user.id)==target){
   // user = target;
   // }     
        
              getDatabase(userid);
  function getDatabase(userid) {
  // In case a Room object was passed:
//	if (user instanceof Users.User) user = user.id;
  let database = Storage.getDatabase(userid);
//let userid = user.id;
  if (!database.userid) database.userid = [];
  return database;
}
let status,favepoke,pokemon,country,profilecolor,fontcolor;
      //if (room instanceof Users.User || !user.hasRank(room, '+')) return;
//  let userid = user.id;
      let statuss = getDatabase(userid).userid;
      //if (!statuss.length) return status = "none";//this.say("This user doesn't have any status.");
status =		statuss[0];//Tools.sampleOne(statuss);
        let userid2 = userid + userid;
  favepoke = getDatabase(userid).userid2;
        if(!favepoke)  favepoke = ["none"];
      pokemon = favepoke[0];
        const currPKMN = pokemon;
   // let ip = (userid ? geoip.lookup(userid.latestIp) : false);    
      let userid3 = userid + userid +userid;
        country = getDatabase(userid).userid3;
        
        let userid4 = userid + userid + userid +userid;
        profilecolor = getDatabase(userid).userid4;
        let userid5 = userid + userid + userid +userid + userid;
                fontcolor = getDatabase(userid).userid5;

       let  targetUserid = userid;
                let points = [];
      user.rooms.forEach((rank, room) => {
          if (!(room.id in Storage.databases) || !('leaderboard' in Storage.databases[room.id])) return;
          if (targetUserid in Storage.databases[room.id].leaderboard) points.push(Storage.databases[room.id].leaderboard[targetUserid].points);
      });
      //if (!points.length) return this.say((target ? target.trim() + " does not" : "You do not") + " have points on any leaderboard.");
      bits = points;
      //this.say(points.join(" | "));
       // let dev = Config.developers.includes(userid);
          //  if(dev) rank = "developer";
       // room.say("/addhtmlbox sgbfhsdbf");
        //if(Config.developers
       // if(user.isDeveloper()) rank = "Developer";
//let  msg = "<div><center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td> " + user.name + "</td></tr><tr><td><b>ID :-</b></td><td> " + user.id + "</td></tr><tr><td><b>Regdate :-</b></td><td> " + regDate + " </td></tr><tr><td><b>PS Age :-</b></td><td> " + realdate + " </td></tr><tr><td><b>Status :-</b></td><td> " + status + " </td></tr><tr><td><b>BITS :-</b></td><td> " + bits + " </td></tr><tr><td><b>Rank :-</b></td><td> " + rank + "</td></tr></table></div> ";
// let  msg = "<div><center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td> " + user.name + "</td></tr><tr><td><b>ID :-</b></td><td> " + user.id + "</td></tr><tr><td><b>Regdate :-</b></td><td> " + regDate + " </td></tr><tr><td><b>PS Age :-</b></td><td> " + realdate + " </td></tr><tr><td><b>Status :-</b></td><td> " + status + " </td></tr><tr><td><b>BITS :-</b></td><td> " + bits + " </td></tr><tr><td><b>Rank :-</b></td><td> " + rank + "</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td> " + pokemon + "</td></tr></table></div>" ;
//let  msg = "<div><center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td> " + user.name + "</td></tr><tr><td><b>ID :-</b></td><td> " + user.id + "</td></tr><tr><td><b>Regdate :-</b></td><td> " + regDate + " </td></tr><tr><td><b>PS Age :-</b></td><td> " + realdate + " </td></tr><tr><td><b>Status :-</b></td><td> " + status + " </td></tr><tr><td><b>BITS :-</b></td><td> " + bits + " </td></tr><tr><td><b>Rank :-</b></td><td> " + rank + "</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td> " + '<img src="https://www.serebii.net/pokedex-sm/icon/${currPKMN}.png" width="32" height="32"></img>'+"</td></tr></table></div>" ;

        //let msg = `<div><center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td>${user.name}</td></tr><tr><td><b>ID :-</b></td><td>${user.id}</td></tr><tr><td><b>Regdate :-</b></td><td>${regDate}</td></tr><tr><td><b>PS Age :-</b></td><td>${realdate}</td></tr><tr><td><b>Status :-</b></td><td>${status}</td></tr><tr><td><b>BITS :-</b></td><td>${bits}</td></tr><tr><td><b>Rank :-</b></td><td>${rank}</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td>${currPKMN}</td></tr></table></div>`;
//let msg = `<div><center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td>${userid}</td></tr><tr><td><b>ID :-</b></td><td>${userid}</td></tr><tr><td><b>Regdate :-</b></td><td>${regDate}</td></tr><tr><td><b>PS Age :-</b></td><td>${realdate}</td></tr><tr><td><b>Status :-</b></td><td>${status}</td></tr><tr><td><b>BITS :-</b></td><td>${bits}</td></tr><tr><td><b>Rank :-</b></td><td>${rank}</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td>${currPKMN}</td></tr><tr><td><b>Country :-</b></td><td>${country}</td></tr></table></div>`;
if(!fontcolor) fontcolor = "#000000";
  //  let msg = `<div style = "background-image: ${profilecolor}"><center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td>${userid}</td></tr><tr><td><b>Regdate :-</b></td><td>${regDate}</td></tr><tr><td><b>PS Age :-</b></td><td>${realdate}</td></tr><tr><td><b>Status :-</b></td><td>${status}</td></tr><tr><td><b>BITS :-</b></td><td>${bits}</td></tr><tr><td><b>Rank :-</b></td><td>${rank}</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td>${currPKMN}</td></tr><tr><td><b>Country :-</b></td><td>${country}</td></tr></table></div>`;
     let msg;
      //  userid = Users.get(userid).name;
                 msg = `<div style = "background-color: ${profilecolor}"><font color="${fontcolor}"> <center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td>${userid}</td></tr><tr><td><b>Regdate :-</b></td><td>${regDate}</td></tr><tr><td><b>PS Age :-</b></td><td>${realdate}</td></tr><tr><td><b>Status :-</b></td><td>${status}</td></tr><tr><td><b>BITS :-</b></td><td>${bits}</td></tr><tr><td><b>Rank :-</b></td><td>${rank}</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td>${currPKMN}</td></tr><tr><td><b>Country :-</b></td><td>${country}</td></tr></table></font></div>`;

      if(userid === "pokem9n" || userid === "shivay")  msg = `<div style = "background-image: ${profilecolor}"><font color="${fontcolor}"> <center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td>${userid}</td></tr><tr><td><b>Regdate :-</b></td><td>${regDate}</td></tr><tr><td><b>PS Age :-</b></td><td>${realdate}</td></tr><tr><td><b>Status :-</b></td><td>${status}</td></tr><tr><td><b>BITS :-</b></td><td>${bits}</td></tr><tr><td><b>Rank :-</b></td><td>${rank}</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td>${currPKMN}</td></tr><tr><td><b>Country :-</b></td><td>${country}</td></tr></table></font></div>`;

        
       // let msg = `<div style = "background-color: ${profilecolor}"><center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td>${userid}</td></tr><tr><td><b>ID :-</b></td><td>${userid}</td></tr><tr><td><b>Regdate :-</b></td><td>${regDate}</td></tr><tr><td><b>PS Age :-</b></td><td>${realdate}</td></tr><tr><td><b>Status :-</b></td><td>${status}</td></tr><tr><td><b>BITS :-</b></td><td>${bits}</td></tr><tr><td><b>Rank :-</b></td><td>${rank}</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td>${currPKMN}</td></tr><tr><td><b>Country :-</b></td><td>${country}</td></tr><tr><td><b>Favorite Pokemon image:-</b></td><td> + <img src="https://www.serebii.net/pokedex-sm/icon/150.png" width="32" height="32"/> +</td></tr></table></div>`;

        //let msg = `<div style ="background-image: url("https://images5.alphacoders.com/613/thumb-1920-613933.jpg");"><center><h2>PROFILE</h2></center> <hr/> <table><tr><td><b>Name :-</b></td><td>${userid}</td></tr><tr><td><b>ID :-</b></td><td>${userid}</td></tr><tr><td><b>Regdate :-</b></td><td>${regDate}</td></tr><tr><td><b>PS Age :-</b></td><td>${realdate}</td></tr><tr><td><b>Status :-</b></td><td>${status}</td></tr><tr><td><b>BITS :-</b></td><td>${bits}</td></tr><tr><td><b>Rank :-</b></td><td>${rank}</td></tr><tr><td><b>Favorite Pokemon:-</b></td><td>${currPKMN}</td></tr><tr><td><b>Country :-</b></td><td>${country}</td></tr></table></div>`;
//<tr><td><b>Favorite Pokemon image:-</b></td><td> " + "<img src="https://www.serebii.net/pokedex-sm/icon/150.png" width="32" height="32"/>" +"</td></tr>
        
        console.log(profilecolor);
        
        
  /*         let database = getDatabase(room.id);
		target = target.trim();
		let drivers = database.drivers;
		let indexd = drivers.findIndex(/**@param {string} driver */ ///driver => Tools.toId(driver) === user.id);
    /* let database2 = getDatabase(room.id);
		target = target.trim();
		let mods = database2.mods;
		let indexm = mods.findIndex(/**@param {string} mod */ //mod => Tools.toId(mod) === user.id);

/*let database3 = getDatabase(room.id);
		target = target.trim();
		let voices = database3.voices;
		let indexv = voices.findIndex(/**@param {string} mod */ //voice => Tools.toId(voice) === user.id);
  
//		if (indexd >= 0 || indexv >= 0 ) {
//        console.log(user.connection);
        room.say("!addhtmlbox " + msg,true);   
    //  return;
//}
//room.say("/pminfobox " + msg);
});
  


     }, 
  
  reversio : function(target, room, user){

    let str = target;
    
    var n = str.includes("!");
    if(n)
    {return this.say("you cant use ! in your sentence");
    }
        var m = str.includes("/");
    if(m)
    {return this.say("you cant use / in your sentence");
    }

    
    var splitString = str.split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]
 
    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]
 
    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"
    if(joinArray == target) {
       return this.say("you spotted a palindrome! " + joinArray);}
    //Step 4. Return the reversed string
    return this.say(joinArray);
  },// "olleh"
  
  
  
  
  
  
  userdata: function(target, room, user) {
     
     let t,cmd,t2;
     t = target.split(',');
     cmd = t[0];
     t2 = t[1];
     
     

        function getData(link, callback) {
            http.get(link, function(res) {
                var data = '';
                res.on('data', function(part) {
                    data += part;
                });
                res.on('end', function(end) {
                    callback(data);
                });
            });
        }
        getData('https://pokemonshowdown.com/users/' + t2 + '.json', function(data) {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                room.say('ERROR in retrieving data.');
            }
            switch (cmd) {
                case 'regdate': case 'age': case 'regtime':
                    if (data.registertime === 0) {
                        return room.say('The account ' + t2 + ' is not registered.');
                    }
                    if(cmd === 'age' || cmd === 'regtime'){
                        var regdate = (data.registertime * 1000) + (new Date().getTimezoneOffset() * 60 * 1000) - 364000;
                        return room.say('The account ' + t2 + ' was registered ' + Tools.getTimeAgo(regdate) + ' ago.');
                    }
                    function isDst(tarDate) {
                        var deezNuts = new Date(tarDate);
                        var deezMonth = deezNuts.getMonth() + 1;
                        var deezDay = deezNuts.getDate() + 1;
                        var deezDayofWeek = deezNuts.getDay();
                        if(deezMonth > 11 || deezMonth < 3){
                            return false;
                        }
                        if(deezMonth === 3){
                            if(deezDay - deezDayofWeek > 7){
                                return true;
                            }
                            return false;
                        }
                        if(deezMonth === 11){
                            if(deezDay - deezDayofWeek > 0){
                                return true
                            }
                            return false;
                        }
                        return true;
                    }
                    regdate = data.registertime * 1000 - (1000 * 60 * 60 * 5) + (new Date().getTimezoneOffset() * 60 * 1000) - 364000;
                    if(isDst(regdate)) regdate = regdate + 3600000;
                    var regDate = (new Date(regdate)).toString().substr(4, 20);
                    room.say('The account ' + t2 + ' was registered on ' + regDate + ' (EST).');
                    break;
                case 'rank':
//                     var battleRanks = data.ratings;
//                     var text = '';
//                     for (var tier in battleRanks) {
//                         text += tier + ': __' + battleRanks[tier].elo.split('.')[0].trim() + '/' + battleRanks[tier].gxe + 'GXE__ | ';
//                     }
//                     room.say('User: ' + target + ' -- ' + text.trim());
                
	// Context.prototype.splitReply = function (str, maxMessageLength) {
		
	// 	return msgs;
	// };
                 let ratings = data.ratings;
            let buffer = Object.keys(ratings).map(tier => `\`\`${tier}\`\` ${Math.round(ratings[tier].elo)} / ${ratings[tier].gxe}`);
            //console.log(buffer);
            if (!buffer.length) return this.sendReply(`The user '${target}' has not played any ladder games yet.`);
           // this.sendReply(`Ladder ratings for '${target}': ` + buffer.join(" | "));
          var i;
                let maxMessageLength = 300;
               
		var msgs = [];
		while (buffer.length > maxMessageLength) {
			msgs.push(buffer.substr(0, maxMessageLength));
			buffer = buffer.substr(maxMessageLength);
		}
		msgs.push(buffer);
                console.log(msgs);
                //return room.say(msgs);  
         // var arr = this.splitReply(`This is Main's Ladder ratings for '${target}': ${buffer.join(" | ")}`);
      // for( i=0;i<msgs.length;i++){
      //  return  room.say(msgs[i]);
      //  }
                
       let msg = `<div style = "background-color: white "><center><h2>Ranks are as follows :</h2></center> <hr/><center> ${msgs}</center><hr/></div>`;         
             room.say("!addhtmlbox " + msg,true);    
                    break;
            }
        });
    },
  
  
  
  
  
  marry: 'pair',
	pair: function(target, room, user) {
    
    
    let splitStr = target.split(",");
		if (splitStr.length !== 2) return;
		let str1 = splitStr[0];
    let str2 = splitStr[1];
    
		//if (!Bot.canUse('pair', room, by) || !arg) return false;
		var userr = str1;
		var pairing = str2;
		function toBase(num, base) {
			var symbols = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
			//num = num.split("");
			var val;
			var total = 0;

			if (base > symbols.length || base <= 1) return false;
let i;
			for (i = 0; i < num.length; i++) {
				val = symbols.indexOf(num[i]);
				total += ((val % base) * Math.pow(10, i)) + (Math.floor(val / base) * Math.pow(10, i + 1));
			}
			return parseInt(total);
		}

		userr = toBase(userr, 10);
		pairing = toBase(pairing, 10);
		var match = (userr + pairing) % 101;

		this.say( str1 + ' and ' + str2 + ' are ' + Math.abs(match) + '% compatible!!!!');
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
  
  
  compare: function (target, room, user) {
            if(!user.hasRank(room, '+') && !user.isDeveloper()) return;
             let splitStr = target.split(",");
		if (splitStr.length !== 2) return;
		let comparing = Tools.sampleMany(splitStr,2)
            let better,than;
            better =  comparing[0];
            than = comparing[1];
            if(than === "Pokem9n" || than === "pokem9n" || than === "p9" || than === "P9" || than === "Mayur" || than === "mayur") return this.say("My Boyfriend is always better than anyone!!!");
            
            this.say(better + "  is better than " + than + "!!!");
            
        },
        
  
  
  
  
  gift: function (target, room, user) {
		if (!user.isDeveloper() && !user.hasRank(room, '+') && (!Games.host || Games.host.id !== user.id)) return;
		let userTar = Users.get(target);
		if (!userTar) return;
		this.say("Inside " + userTar.name + "'s gift is ..." + Tools.sample(gifts));
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
	
	joke: function (target, room, user) {
		if (!user.isDeveloper() && !user.hasRank(room, '+') && (!Games.host || Games.host.id !== user.id)) return;
		room.say("/addhtmlbox <div style='border-style: double;'> <center> <b> JOKE </b> <br></center>" +  Tools.sample(jokes) + "</div>");
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},     
  
  rps: function(target, room, user) {
		//if (!Bot.hasRank(by, '+%@#&~')) return false;
		target = Tools.toId(target);
		var values = ['rock', 'paper', 'scissors', 'rock', 'paper', 'scissors'];
		if (values.indexOf(target) === -1) return this.say('That\'s not one of the choices!');
		var actionops = ['You win!', 'You lose ;-;', 'It\'s a draw!'];
    var action = Tools.sample(actionops);
		switch (action) {
			case 'You win!':
				var choice = values[values.indexOf(target) + 2];
				break;
			case 'You lose ;-;':
				choice = values[values.indexOf(target) + 1];
				break;
			case 'It\'s a draw!':
				choice = target;
				break;
		}
		this.say(Config.username + ' chooses ' + choice + '. ' + action);
	},
  
  
  
  
  ask: function(target, room, user) {
    
    let by,arg;
    
    
	//	if (!user.hasRank(room,'+')) return;
		by = Tools.toId(user.id);
    var text = '';
		if (!target) return false;

		var alpha = ' abcdefghijklmnopqrstuvwxyz';
		arg = Tools.toId(target).split('');
		var rand = 0;
		for (var i = 0; i < arg.length; i++) {
			rand += alpha.indexOf(arg[i]);
		}
		for (var i = 0; i < by.length; i++) {
			rand += alpha.indexOf(by.charAt(i));
		}


		switch ((rand % 20) + 1) {
			case 1:
				text += "Signs point to yes.";
				break;
			case 2:
				text += "Yes.";
				break;
			case 3:
				text += "Reply hazy, try again.";
				break;
			case 4:
				text += "Without a doubt.";
				break;
			case 5:
				text += "My sources say no.";
				break;
			case 6:
				text += "As I see it, yes.";
				break;
			case 7:
				text += "You may rely on it.";
				break;
			case 8:
				text += "Concentrate and ask again.";
				break;
			case 9:
				text += "Outlook not so good.";
				break;
			case 10:
				text += "It is decidedly so.";
				break;
			case 11:
				text += "Better not tell you now.";
				break;
			case 12:
				text += "Very doubtful.";
				break;
			case 13:
				text += "Yes - definitely.";
				break;
			case 14:
				text += "IDK but you know what i really love Pokem9n <3.";
				break;
			case 15:
				text += "Cannot predict now.";
				break;
			case 16:
				text += "Most likely.";
				break;
			case 17:
				text += "Ask again later.";
				break;
			case 18:
				text += "My reply is no.";
				break;
			case 19:
				text += "Outlook good.";
				break;
			case 20:
				text += "Don't count on it.";
				break;
		}
		this.say(text);
	},
  
  
  meme: function(target, room, user) {
		if (user.isDeveloper() || user.hasRank(room,'+')) {
			var text = '';
		}
		else {
			text = '/pm ' + user.id + ', ';
		}

		var rand = ~~(19 * Math.random()) + 1;

		switch (rand) {
			case 1:
				text += "ᕦ( ͡° ͜ʖ ͡°)ᕤ";
				break;
			case 2:
				text += "ᕙ( ͡° ͜ʖ ͡°)ᕗ";
				break;
			case 3:
				text += "(ง ° ͜ ʖ °)ง";
				break;
			case 4:
				text += "( ͡° ͜ʖ ͡°)";
				break;
			case 5:
				text += "ᕙ༼ຈل͜ຈ༽ᕗ";
				break;
			case 6:
				text += "ᕦ( ͡°╭͜ʖ╮͡° )ᕤ";
				break;
			case 7:
				text += "ヽ༼ຈل͜ຈ༽ﾉ raise your dongers. ヽ༼ຈل͜ຈ༽ﾉ ";
				break;
			case 8:
				text += "┴┬┴┤( ͡° ͜ʖ├┬┴┬";
				break;
			case 9:
				text += "╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ";
				break;
			case 10:
				text += "─=≡Σᕕ( ͡° ͜ʖ ͡°)ᕗ";
				break;
			case 11:
				text += "(つ ͡° ͜ʖ ͡°)つ";
				break;
			case 12:
				text += "༼ຈل͜ຈ༽ﾉ·︻̷┻̿═━一";
				break;
			case 13:
				text += "─=≡Σ(((༼つಠ益ಠ༽つ";
				break;
			case 14:
				text += "༼ ºل͟º༼ ºل͟º༼ ºل͟º ༽ºل͟º ༽ºل͟º ༽";
				break;
			case 15:
				text += "ヽ༼ຈل͜ຈ༽ﾉ︵┻━┻";
				break;
			case 16:
				text += "┌∩┐༼ ºل͟º ༽┌∩┐";
				break;
			case 17:
				text += "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]";
				break;
			case 18:
				text += "( ͡ ͡° ͡° ʖ ͡° ͡°)";
				break;
			case 19:
				text += "(ง ͠° ͟ل͜ ͡°)ง";
				break;
		}
		this.say(text);
	},
  
  
  
  
  //groupchats drivers commands
 
  
/*  uno: function (target, room, user){
    
    if(target !== "pokem9n" && user.id === drivers[0] || user.id === drivers[1] || user.id === drivers[2] || user.id === drivers[3] || user.id === drivers[4]) {
      switch (target) {
        case ' ': this.say("please use the correct syntax ``&uno (create/start/autodq``
      this.say("/um " + target);
    }
  },
  */
  
  
  //end of groupchat commands
  
  host: function (target, room, user) {
		if (!user.hasRank(room, '%')) return;
		let realuser = Users.get(target);
		if (!realuser) return;
		if (Games.host) {
			room.say(realuser.name + " was added to the hostqueue!");
			console.log(Games.hosts);
			Games.hosts.push(realuser.name);
			return;
		}
		Games.host = realuser;
		room.say(+ realuser.name + " is hosting! Do ``&join`` to join!");
	},
  
  
  //random commands own
  jt: function (target, room, user) {
    if (!(room instanceof Users.User) && !user.hasRank(room, '+')) return;
		this.say("/tour join");
  },
  say: 'do',
  do: function (target, room, user) {
    if (!user.isDeveloper()) return;
    this.say(target);
    
     let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
    
  },
  rm: function (target, room, user) {
    var randuser = ["aflyingphantom","order of Phoenix","Aflyingphantom","beekay1976","call of summer","no1explorer","distrib"];
    var move = Math.floor((Math.random() * 4) + 1); // choose move randomly
    this.say(randuser[move]);
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
  },// call attack from array
  
  j: 'judge',
  judge:  function (target, room, user) {
    var judgement = [" is so cute"," is the worst!!!"," is um eh not bad "," is the best"," is ok"];
    var rand = Math.floor((Math.random() * 4) + 1); // choose move randomly
    if (!["!", "/"].includes(target.charAt(0))) 
    this.say(target.split('/') + judgement[rand]);
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
  },// call attack from array

  /*m: 'mute',
  mute: function(target, room, user) {
   */ 
  
  
	// General commands
  //tour commands
    ssbtour: function (target, room, user) {
    if (!(room instanceof Users.User) && user.id == "pratikcool") return;
		this.say("/tour create ssb,elimination");
      this.say("/tour autodq 2");
       this.say("/tour autostart 2");    
  },
  
   rbtour: function (target, room, user) {
    if (!(room instanceof Users.User) && !user.hasRank(room, '+')) return;
		this.say("/tour create gen7randombattle,elimination");
      this.say("/tour autodq 2");
       this.say("/tour autostart 2");    
  },
  
  
  
  ping: function (target, room, user) {
   //if(!(room instanceof Users.User) && !user.hasRank(room, '+')) return;
    var rate = Math.floor((Math.random() * 10) + 1);
    if(rate == 1){
      this.say("You win");
    } 
    
    else if(rate == 4){
      this.say("You lose");
      this.say("/mute " + user.id + ", fuck u");
    }
    else{
      this.say("Pong!");
      
  }
  let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
  },
  
  intro: function (target, room, user){
   // if (!user.isDeveloper() || !(room instanceof Users.User) && !user.hasRank(room, '+')) return;
this.sayHtml("<center><div style='background-image: linear-gradient(white, skyblue);border: 5px solid blue ; border-radius: 15px;'><h1><font color='blue' size='6px' face='jokerman'><i><big>W</big>elcome To The GroupChat</i></font></h1><br><font color='black' face='cursive' size='2px'><div style='border:2px solid grey;border-radius:5px; '><b>You're probably not reading this, if you are, chances are, you are an old member actually reading this for like the millionth time. You can have fun and enjoy your stay here. Try to avoid vernaculars as much as possible, no need to sprinkle in salt, just chill, thats p much it.</b><br><a href = 'https://pastebin.com/ahceGeN9'> Bot Guide </a></div></font><details><summary>Bot drivers</summary>Delta(Summer) <br> Pratik Cool <br> DeminuKoaso <br> R Worrior</details><details><summary>Bot Mods</summary>A Flying Phantom <br> Zeruora <br> No1Explorer</details><br><marquee style='border:2px solid red;border-radius:10px;background-image: linear-gradient(skyblue, red);font-size:15px;'> ENJOY YOUR STAY </marquee><br></div></center>");	
	
  },
  
  c: 'roomsay',
  roomsay: function (target, room, user) {
		if (!user.isDeveloper()) return;
		let splitStr = target.split(",");
		if (splitStr.length !== 2) return;
		let realroom = Rooms.get(splitStr[0]);
		if (!realroom) return;
		realroom.say(splitStr[1]);
	},
  
  
  
  
  
  jr:'joinroom',
  joinroom: function (target,room, user){
    if (!user.isDeveloper() || !(room instanceof Users.User) && !user.hasRank(room, '+')) return;
  
    this.say("/join " + target);
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
  },
  
  //copied commands
  
  
  pick: function (target, room, user) {
		if (!user.hasRank(room, '+') && (!Games.host || Games.host.id !== user.id)) return;
		if (Users.self.hasRank(room, '*')) {
			let stuff = target.split(",");
			let str = "<em>We randomly picked:</em> " + Tools.sample(stuff);
				
			if (room.id === 'developmen') {
				room.say("/addhtmlbox " + str);
			} else {
				room.say("!htmlbox " + str);
			}
		}
		else {
			this.say("!pick " + target);
		}
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
  
  
  timer: function (target, room, user) {
		if (!user.hasRank(room, '+') && (!Games.host || Games.host.id !== user.id)) return;
		let x = Math.floor(target);
		if (!x || x >= 120 || (x < 10 && x > 2) || x <= 0) return room.say("The timer must be between 10 seconds and 2 minutes.");
		if (x === 1) x = 60;
		let minutes = Math.floor(x / 60);
		let seconds = x % 60;
		clearTimeout(Games.timeout);
		this.say("Timer set for " + (minutes > 0 ? "1 minute" + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
		setTimeout(() => this.say("Times Up!"), x * 1000);
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
   
  roll: function (target, room, user) {
		let realtarget = target;
		if (!user.hasRank(room, '+') && (!Games.host || Games.host.id !== user.id)) return;
		let plusIndex = target.indexOf("+");
		let adder = 0;
		if (plusIndex !== -1) {
			adder = parseInt(target.substr(plusIndex + 1));
			let str = adder.toString();
			if (str.length !== (target.substr(plusIndex + 1)).length) return;
			if (!adder) return;
			target = target.substr(0, plusIndex);
		}
		let dIndex = target.indexOf("d");
		let numDice = 1;
		let roll;
		if (dIndex !== -1) {
			numDice = parseInt(target.substr(0, dIndex));;
			if (!numDice) return;
			roll = parseInt(target.substr(dIndex + 1));
			if (!roll) return;	
		} else {
			roll = parseInt(target);
			if (!roll) return;
		}
		let rolls = [];
		let sum = 0;
		for (let i = 0; i < numDice; i++) {
			rolls.push(Tools.random(roll) + 1);
			sum += rolls[i];
		}
		if ((Users.self.hasRank(room, "*"))) {
			if (numDice === 1) {
				let str = "Roll (1 - " + roll + "): " + rolls[0];
				if (room.id === 'survivor') {
					this.say("/addhtmlbox " + str);
				} else {
					this.say("!htmlbox " + str);
				}
			} else {
				let str = numDice + " Rolls (1 - " + roll + "): " + rolls.join(", ") + "<br></br>" + "Sum: " + sum;
				if (room.id === 'survivor') {
					this.say("/addhtmlbox " + str);
				} else {
					this.say("!htmlbox " + str);
				}
			}
		} else {
			room.say("Rolls: " + rolls.join(",") + " || Total: " + (sum + adder));
		}
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
	},
  
  
  
 pun: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		let ew = ["What do you call the security outside of a Samsung Store? Guardians of the Galaxy.", "Did you hear about the guy who got hit in the head with a can of soda? He was lucky it was a soft drink.", "Don't spell part backwards. It's a trap.", "I can't believe I got fired from the calendar factory. All I did was take a day off.", "I have a few jokes about unemployed people but it doesn't matter none of them work.", "I'm reading a book about anti-gravity. It's impossible to put down.", "I wasn't originally going to get a brain transplant, but then I changed my mind.", "Why was Cinderella thrown off the basketball team? She ran away from the ball.", "How did I escape Iraq? Iran.", "I'd tell you a chemistry joke but I know I wouldn't get a reaction.", "eBay is so useless. I tried to look up lighters and all they had was 13,749 matches.", "A friend of mine tried to annoy me with bird puns, but I soon realized that toucan play at that game.", "A courtroom artist was arrested today for an unknown reason... details are sketchy.", "I'm glad I know sign language, it's pretty handy.", "What do you have to do to have a party in space? You have to Planet.", "I was addicted to the hokey pokey... but thankfully, I turned myself around.", "Thieves had broken into my house and stolen everything except my soap, shower gel, towels and deodorant. Dirty Bastards.", "I am on a seafood diet. Every time I see food, I eat it.", "I'm emotionally constipated. I haven't given a shit in days.", "I wear two pairs of pants when I go golfing. People always ask me why I do. I say, I wear two pants when's I golf just in case I get a hole-in-one.", "I wear two pairs of pants when I go golfing. People always ask me why I do. I say, 'I wear two pants when's I golf just in case I get a hole-in-one.'", "Why did the scientist install a knocker on his door? He wanted to win the No-bell prize!", "What do you call an academically successful slice of bread? An honor roll.", "What do you call a cow with no legs? Ground beef.", "My first job was working in an orange juice factory, but I got canned because I couldn't concentrate.", "Claustrophobic people are more productive thinking out of the box.", "A book just fell on my head. I've only got myshelf to blame.", "My mate broke his left arm and left leg, but he was alright.", "What was Forrest Gump's email password? '1forrest1'", "I wanna make a joke about sodium, but Na..", "I hate insects puns, they really bug me.", "I used to be a banker, but then I lost interest.", "What do you call Watson when Sherlock isn't around? Holmeless.", "Did you hear about the Italian chef with a terminal illness? He pastaway.", "I relish the fact that you have mustard the strength to ketchup to me.", "What do prisoners use to call each other? Cell phones.", "If my puns are cheesy, then they would go well with crackers.", "I am so poor I cannot even pay attention.", "I found a rock yesterday which measured 1760 yards in length. Must be some kind of milestone.", "My math teacher called me average. How mean!", "What did one ocean say to the other ocean? Nothing, they just waved.", "I saw an ad for burial plots, and thought to myself this is the last thing I need.", "I've just written a song about tortillas - actually, it's more of a rap.", "Why is Peter Pan always flying? He neverlands.", "Why didn't the skeleton go to prom? Cause he had no body to dance with.", "What do you call people who are afraid of Santa Claus? Claustrophobic", "Atheism is a non-prophet organization.", "Why don't cannibals eat clowns? They taste funny.", "Why did the bee get married? Because he found his honey.", "Why couldn't the bike stand up on it's own? It was two tired.", "A bus station is where a bus stops. A train station is where a train stops. On my desk, I have a work station..", "Get stoned. Drink wet cement.", "If there was someone selling drugs in this place, weed know.", "Which day do chickens hate the most? Friday.", "Last time I got caught stealing a calendar I got 12 months.", "Did you hear about these new reversible jackets? I am excited to see how they turn out.", "A hole was found in the wall of a nudist camp. The police are looking into it.", "My computer has got Miley Virus. It has stopped twerking.", "What do you call a dictionary on drugs? HIGH-Definition.", "What do sea monsters eat for lunch? Fish and ships.", "The future, the present and the past walked into a bar. Things got a little tense.", "I put the 'fun' in dysfunctional.", "Do you know why I make puns? Because it's my respunsibility.", "Fishermen are reel men.", "If anything is possible, is it possible for something to be impossible?", "For Sale: Parachute. Only used once, never opened.", "Did you hear about the guy who choked on a pretzel? He was very salty.", "What did the tree say to autumn? Leaf me alone.", "A Roman fighter consumed his wife. He said he was glad 'e ate 'er", "What do you call a owl that does magic tricks? Hoodini.", "It's hard to explain puns to kleptomaniacs because they always take things literally.", "A garage sale is actually a Garbage sale but the 'b' is silent.", "What is the difference between a poorly dressed man on a bicycle and a nicely dressed man on a tricycle? A tire.", "Your gene pool could use a little chlorine.", "What do ghosts serve for dessert? I Scream.", "What tea do hockey players drink? Penaltea!", "I wanted to make a joke about criminals, but I was scared it would get stolen.", "Why does the bike not stand by itself? Because it is two tired.", "Do skunks celebrate Valentines Day? Sure, they're very scent-imental!", "On the other hand, you have different fingers.", "No matter how much you push the envelope, it'll still be stationery.", "This morning some clown opened the door for me. I thought to myself that's a nice Jester.", "Why did the chicken cross the road? Because KFC was on the other side.", "STRESSED is just DESSERTS spelled backward.", "What if there were no hypothetical questions?", "Television is a medium because anything well done is rare.", "What do you get when you cross a joke with a rhetorical question?", "You know those people using bibles on their phones? They are using phony bibles.", "Where do you find a birthday present for a cat? In a cat-alogue!", "In democracy, it is your vote that counts. In feudalism, it is your count that votes.", "A donkey fell into a bowl of sugar. Now that's a sweet ass.", "What's the difference between a guitar and a fish? You can't tuna fish!", "I asked my friend for a sharpened pencil, but he didn't have one. I always knew he was a little dull", "How do you get Pikachu onto the bus? You Pokemon.", "What nationality is Santa Claus? North Polish" , "I would tell a swimming joke, but I think it's too watered-down to be funny.", "Lately I've been trying to touch my toes, which I don't find so complicated, but my knees just can't get it straight.", "What did Zelda tell Link when he couldn't open the door? TRIFORCE!", ];
		room.say(Tools.sample(ew));
	}, 
  
  randtier: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		let waaw = ["Ubers", "OU", "UU", "RU", "NU", "AG", "MnM", "CAP"]
		room.say(Tools.sample(waaw));
	},
  
  
  hug: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		room.say("/me hugs " + target);
	},
  
  dab: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		room.say("/me dabs");
	},
	
	argdab: function (target, room, user) {
        if (room !== user && !user.hasRank(room, '+')) return;
        room.say("/me dabs on " + target);
    },
	
	argdunk: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		room.say("/me dunks on " + target);
	},
	
  
  
  
  
  
  
  gameslist: function(target, room, user) {
    this.say("**Some available and buggy games** : MMM, CSS, Trivia, Hangman, Magnezone, Orders, CMT, Anagrams, PPP, Count, Summon, Kunc(New but old),TOD(new and dangerous)");
 let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
  },
  
  
	// Game commands
	signups: 'creategame',
  games: 'creategame',
	creategame: function (target, room, user) {
    
		if (room instanceof Users.User) return;
/*	  let database = getDatabase(room.id);
		target = target.trim();
		let drivers = database.drivers;
		let indexd = drivers.findIndex(/**@param {string} driver  driver => Tools.toId(driver) === user.id);
     let database2 = getDatabase(room.id);
		target = target.trim();
		let mods = database2.mods;
		let indexm = mods.findIndex(/**@param {string} mod  mod => Tools.toId(mod) === user.id);

let database3 = getDatabase(room.id);
		target = target.trim();
		let voices = database3.voices;
		let indexv = voices.findIndex(/**@param {string} mod  voice => Tools.toId(voice) === user.id);
  
*/	//	if (indexd >= 0 || indexm >= 0 || indexv >= 0 ) {
		//if (!Config.games || !Config.games.includes(room.id)) return this.say("Games are not enabled for this room.");
		let format = Games.getFormat(target);
		if (!format || format.inheritOnly) return this.say("The game '" + target + "' was not found.");
		if (format.internal) return this.say(format.name + " cannot be started manually.");
		Games.createGame(format, room);
		if (!room.game) return;
		room.game.signups();
    
    let database4 = getDatabase(room.id);
    	let logs = database4.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
    
	},
	start: 'startgame',
	startgame: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '+')) return;
     let database = getDatabase(room.id);
		target = target.trim();
		let drivers = database.drivers;
		let indexd = drivers.findIndex(/**@param {string} driver */ driver => Tools.toId(driver) === user.id);
     let database2 = getDatabase(room.id);
		target = target.trim();
		let mods = database2.mods;
		let indexm = mods.findIndex(/**@param {string} mod */ mod => Tools.toId(mod) === user.id);

let database3 = getDatabase(room.id);
		target = target.trim();
		let voices = database3.voices;
		let indexv = voices.findIndex(/**@param {string} mod */ voice => Tools.toId(voice) === user.id);
  
		if (indexd >= 0 || indexm >= 0 || indexv >= 0 ) {
		if (room.game) room.game.start();
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
    }
	},
	cap: 'capgame',
	capgame: function (target, room, user) {
		if (room instanceof Users.User || !room.game || !user.hasRank(room, '+')) return;
		let cap = parseInt(target);
		if (isNaN(cap)) return this.say("Please enter a valid player cap.");
		if (cap < room.game.minPlayers) return this.say(room.game.name + " must have at least " + room.game.minPlayers + " players.");
		if (room.game.maxPlayers && cap > room.game.maxPlayers) return this.say(room.game.name + " cannot have more than " + room.game.maxPlayers + " players.");
		room.game.playerCap = cap;
		this.say("The game will automatically start at **" + cap + "** players!");
	},
  mp: 'maxpoints',
	maxpoints: function (target, room, user) {
		if (room instanceof Users.User || !room.game || !user.hasRank(room, '+')) return;
		let mp = parseInt(target);
		if (isNaN(mp)) return this.say("Please enter a valid value.");
		//if (cap < room.game.minPlayers) return this.say(room.game.name + " must have at least " + room.game.minPlayers + " players.");
		//if (room.game.maxPlayers && cap > room.game.maxPlayers) return this.say(room.game.name + " cannot have more than " + room.game.maxPlayers + " players.");
		room.game.maxPoints = mp;
		this.say("Player with **" + mp + "** points wins the game!");
	},
  
  
  players: 'pl',
	pl: function (target, room, user) {
		if ((!user.isDeveloper() && !user.hasRank(room, '+')) || !room.game) return;
		if (typeof room.game.pl === 'function') room.game.pl();
	},
  
  
	end: 'endgame',
	endgame: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '+')) return;
     let database = getDatabase(room.id);
		target = target.trim();
		let drivers = database.drivers;
		let indexd = drivers.findIndex(/**@param {string} driver */ driver => Tools.toId(driver) === user.id);
     let database2 = getDatabase(room.id);
		target = target.trim();
		let mods = database2.mods;
		let indexm = mods.findIndex(/**@param {string} mod */ mod => Tools.toId(mod) === user.id);

let database3 = getDatabase(room.id);
		target = target.trim();
		let voices = database3.voices;
		let indexv = voices.findIndex(/**@param {string} mod */ voice => Tools.toId(voice) === user.id);
  
		if (indexd >= 0 || indexm >= 0 || indexv >= 0 ) {
		if (room.game) room.game.forceEnd();
    let database = getDatabase(room.id);
    	let logs = database.logs;
    	logs.push("Command = " + this.command + ", User = " + user.name + ", Target = " + target);
		Storage.exportDatabase(room.id);
    }
	},
  
  answer: 'a',
	a: function (target, room, user) {
		if (!room.game) return;
		if (typeof room.game.guess === 'function') room.game.guess(target, user);
	},
  
	join: 'joingame',
	joingame: function (target, room, user) {
		if (room instanceof Users.User || !room.game) return;
		room.game.join(user);
	},
  
  latejoin: function(target, room, user){
    this.room.game.lateJoin(user);
  },
  
  
	leave: 'leavegame',
	leavegame: function (target, room, user) {
		if (room instanceof Users.User || !room.game) return;
		room.game.leave(user);
	},
 elim: 'eliminate',
	eliminate: function (target, room, user) {
		if (room instanceof Users.User || !room.game ||!user.isDeveloper()) return;
		this.room.game.elim(target);
    this.say(target + " was eliminated by " + user.name);
	},
  
 
	// Storage commands
	bits: 'points',
	points: function (target, room, user) {
		//if (room !== user) return;
		let targetUserid = target ? Tools.toId(target) : user.id;
		/**@type {Array<string>} */
		let points = [];
		user.rooms.forEach((rank, room) => {
			if (!(room.id in Storage.databases) || !('leaderboard' in Storage.databases[room.id])) return;
			if (targetUserid in Storage.databases[room.id].leaderboard) points.push("**" + room.id + "**: " + Storage.databases[room.id].leaderboard[targetUserid].points);
		});
		if (!points.length) return this.say((target ? target.trim() + " does not" : "You do not") + " have points on any leaderboard.");
		this.say(points.join(" | "));
	},
  
  choose: function (target, room, user) {
		for (room in Rooms.rooms) {
			let realRoom = Rooms.rooms[room];
			if (realRoom.game && typeof realRoom.game.choose === 'function') realRoom.game.choose(user, target);
		}
	},

	suspect: function (target, room, user) {
		if (room.name !== user.name) return;
		let firstComma = target.indexOf(',');
		if (firstComma === -1) {
			user.say("The correct syntax is " + Config.commandCharacter + "suspect user, pokemon, room");
			return;
		}
		let userID = target.substr(0, firstComma);
		target = target.substr(firstComma + 1);
		if (target.charAt(0) === ' ') {
			target = target.substr(1);
		}
		for (room in Rooms.rooms) {
			let realRoom = Rooms.rooms[room];
			if (realRoom.game && typeof realRoom.game.suspect === 'function') realRoom.game.suspect(user, userID, target);
		}
	},
	
	steal: function (target, room, user) {
		if (!room.game) return;
		if (typeof room.game.steal === 'function') room.game.steal(target, user);
	},
	
	count: function (target, room, user) {
		if (!room.game) {
			if (!user.hasRank(room, '+') || Tools.toId(target) !== "start") {
				return;
			}
			Games.createGame("count", room)
		} else if (typeof room.game.count === 'function') {
			room.game.count(target,user);
		}
	},
  
  givebts: function (target, room, user){
    if(!user.isDeveloper()) return;
let targetid,targetname,split,pts;
    split = target.split(',');
 pts = +split[0];
    targetid = split[1];
    targetname = split[2];
    Storage.addPoints(pts, targetid,targetname, room.id);
  Storage.exportDatabase(room.id);
  },
  
  
   keeproomalive: function(target, room, user) {
     
  
     
     /*cond = true;
     let I = 0;
        while(true) {
            this.say('bad users are bad');
          await sleep(6000);
          // setInterval(1000,call());
          //etInterval(()=> this.say("bad users are bad"), 10000);
        }*/
   },
  
  lb : function (target, room, user){
    let lb,username,points,array,details;
    let str = Storage.databases[room.id].leaderboard;
    //Hi line 1474 aur 75 ko CUT karo   
   //what are you doing p9 bro :D
    lb = Object.keys(str);
    let usr = lb[1];
     let a = Object.values(str);
    let ptr = a.sort();
    //room.say("!code " + ptr);
    //console.log(ptr);
    // var sorting = [];
    // for (var name in a){
    //   sorting.push([name,a[name]]);
    // }
    // sorting.sort(function(a,b)
    //             {
    //   return a[1] - b[1];
    // });
    // room.say("!code" + sorting);
    //console.log(sorting);
    let I;
    var msg = "";
   var htmltext = "!addhtmlbox <ul>";
    for(I = 0; I <= 1; I++){
       username = lb[I];
      let pts = Storage.databases[room.id].leaderboard[username].points;
      
      msg = lb[I] + " -- "+ pts  ; 
       htmltext += `<li> ${msg} </li>`
    }
     htmltext+="</ul>";
    // user.say(htmltext);
      this.say(htmltext);
  
      
    
    
   // array = lb.split(",");
    //this.say(lb[0]);
  
  },
  
  
  
  
  
  
  

	// Tournament commands
 
	tourr: 'tournament',
	tournament: function (target, room, user) {
		if (room instanceof Users.User || !Config.tournaments || !Config.tournaments.includes(room.id)) return;
		if (!target) {
			if (!user.hasRank(room, '+')) return;
			if (!room.tour) return this.say("I am not currently tracking a tournament in this room.");
			let info = "``" + room.tour.name + " tournament info``";
			if (room.tour.startTime) {
				return this.say(info + ": **Time**: " + Tools.toDurationString(Date.now() - room.tour.startTime) + " | **Remaining players**: " + room.tour.getRemainingPlayerCount() + '/' + room.tour.totalPlayers);
			} else if (room.tour.started) {
				return this.say(info + ": **Remaining players**: " + room.tour.getRemainingPlayerCount() + '/' + room.tour.totalPlayers);
			} else {
				return this.say(info + ": " + room.tour.playerCount + " player" + (room.tour.playerCount > 1 ? "s" : ""));
			}
		} else {
	//		if (!user.hasRank(room, '%') || !user.isDeveloper()) return;
			let targets = target.split(',');
			let cmd = Tools.toId(targets[0]);
			let format;
			switch (cmd) {
			case 'end':
				this.say("/tour end");
				break;
			case 'start':
				this.say("/tour start");
				break;
			default:
				format = Tools.getFormat(cmd);
				if (!format) return this.say('**Error:** invalid format.');
				if (!format.playable) return this.say(format.name + " cannot be played, please choose another format.");
				let cap;
				if (targets[1]) {
					cap = parseInt(Tools.toId(targets[1]));
					if (cap < 2 || cap > Tournaments.maxCap || isNaN(cap)) return this.say("**Error:** invalid participant cap.");
				}
				this.say("/tour new " + format.id + ", elimination, " + (cap ? cap + ", " : "") + (targets.length > 2 ? ", " + targets.slice(2).join(", ") : ""));
			}
		}
	},
	settour: 'settournament',
	settournament: function (target, room, user) {
		if (room instanceof Users.User || !Config.tournaments || !Config.tournaments.includes(room.id) || !user.hasRank(room, '%')) return;
		if (room.id in Tournaments.tournamentTimers) {
			let warned = overwriteWarnings.has(room.id) && overwriteWarnings.get(room.id) === user.id;
			if (!warned) {
				overwriteWarnings.set(room.id, user.id);
				return this.say("A tournament has already been scheduled in this room. To overwrite it, please reuse this command.");
			}
			overwriteWarnings.delete(room.id);
		}
		let targets = target.split(',');
		if (targets.length < 2) return this.say(Config.commandCharacter + "settour - tier, time, cap (optional)");
		let format = Tools.getFormat(targets[0]);
		if (!format) return this.say('**Error:** invalid format.');
		if (!format.playable) return this.say(format.name + " cannot be played, please choose another format.");
		let date = new Date();
		let currentTime = (date.getHours() * 60 * 60 * 1000) + (date.getMinutes() * (60 * 1000)) + (date.getSeconds() * 1000) + date.getMilliseconds();
		let targetTime = 0;
		if (targets[1].includes(':')) {
			let parts = targets[1].split(':');
			let hours = parseInt(parts[0]);
			let minutes = parseInt(parts[1]);
			if (isNaN(hours) || isNaN(minutes)) return this.say("Please enter a valid time.");
			targetTime = (hours * 60 * 60 * 1000) + (minutes * (60 * 1000));
		} else {
			let hours = parseFloat(targets[1]);
			if (isNaN(hours)) return this.say("Please enter a valid time.");
			targetTime = currentTime + (hours * 60 * 60 * 1000);
		}
		let timer = targetTime - currentTime;
		if (timer <= 0) timer += 24 * 60 * 60 * 1000;
		Tournaments.setTournamentTimer(room, timer, format.id, targets[2] ? parseInt(targets[2]) : 0);
		this.say("The " + format.name + " tournament is scheduled for " + Tools.toDurationString(timer) + ".");
	},
	canceltour: 'canceltournament',
	canceltournament: function (target, room, user) {
		if (room instanceof Users.User || !Config.tournaments || !Config.tournaments.includes(room.id) || !user.hasRank(room, '%')) return;
		if (!(room.id in Tournaments.tournamentTimers)) return this.say("There is no tournament scheduled for this room.");
		clearTimeout(Tournaments.tournamentTimers[room.id]);
		this.say("The scheduled tournament was canceled.");
	},
};

module.exports = commands;//https://github.com/Zerapium/Truth-Untold-Bot,






/**
 * Rooms
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file tracks information about the rooms that the bot joins.
 *
 * @license MIT license
 */

'use strict';


class Room {
	/**
	 * @param {string} id
	 */
	constructor(id) {
		this.id = id;
		this.clientId = id === 'lobby' ? '' : id;
		/**@type {Map<User, string>} */
		this.users = new Map();
		/**@type {{[k: string]: Function}} */
		this.listeners = {};
		/**@type {?Game} */
		this.game = null;
		/**@type {?Tournament} */
		this.tour = null;
	}

	/**
	 * @param {User} user
	 * @param {string} rank
	 */
	onJoin(user, rank) {
  /*  let roomid, userid, jp, array;
    try{
   array = Storage.databases[user.id].userid6[0].split(",");
    
  //  catch (e){
  
    roomid = array[0];
    jp = array[1];
    if(!array) return;
    room.say(jp);
    }
    catch(e){
    }*/
    
   // if(room.id !== "groupchat-truthuntold-enjoyment") return;
   // if(user.id !== "pokem9n") return;
    //this.say(user.id + " joined");
		this.users.set(user, rank);
		user.rooms.set(this, rank);
	}

	
	 // @param {User} user
	 onLeave(user) {
		this.users.delete(user);
		user.rooms.delete(this);
	}

	/**
	 * @param {User} user
	 * @param {string} newName
	 */
	onRename(user, newName) {
		let rank = newName.charAt(0);
		newName = Tools.toName(newName);
		let id = Tools.toId(newName);
		let oldName = user.name;
		if (id === user.id) {
			user.name = newName;
		} else {
			delete Users.users[user.id];
			if (Users.users[id]) {
				user = Users.users[id];
				user.name = newName;
			} else {
				user.name = newName;
				user.id = id;
				Users.users[id] = user;
			}
		}
		this.users.set(user, rank);
		user.rooms.set(this, rank);
		if (this.game) this.game.renamePlayer(user, oldName);
		if (this.tour) this.tour.renamePlayer(user, oldName);
    Storage.addAlt(newName, oldName, this.id);
    Storage.exportDatabase(this.id);
    
    
	}

	/**
	 * @param {string} message
	 * @param {boolean} [skipNormalization]
	 */
	say(message, skipNormalization) {
		if (!skipNormalization) message = Tools.normalizeMessage(message, this);
		if (!message) return;
		Client.send(this.clientId + '|' + message);
	}

	/**
	 * @param {string} message
	 * @param {Function} listener
	 */
	on(message, listener) {
		message = Tools.normalizeMessage(message, this);
		if (!message) return;
		this.listeners[Tools.toId(message)] = listener;
	}
}

exports.Room = Room;

class Rooms {
	constructor() {
		this.rooms = {};

		this.Room = Room;
		this.globalRoom = this.add('global');
	}

	/**
	 * @param {Room | string} id
	 * @return {Room}
	 */
	get(id) {
		if (id instanceof Room) return id;
		return this.rooms[id];
	}

	/**
	 * @param {string} id
	 * @return {Room}
	 */
	add(id) {
		let room = this.get(id);
		if (!room) {
			room = new Room(id);
			this.rooms[id] = room;
		}
		return room;
	}

	/**
	 * @param {Room | string} id
	 */
	destroy(id) {
		let room = this.get(id);
		if (!room) return;
		if (room.game) room.game.forceEnd();
		if (room.tour) room.tour.end();
		room.users.forEach(function (value, user) {
			user.rooms.delete(room);
		});
		delete this.rooms[room.id];
	}

	destroyRooms() {
		for (let i in this.rooms) {
			this.destroy(i);
		}
	}
}

exports.Rooms = new Rooms();




/**
 * Storage
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file handles the storage of room databases
 *
 * @license MIT license
 */

'use strict';

const fs = require('fs');
const BACKUP_INTERVAL = 60 * 60 * 1000;

class Storage {
	constructor() {
		this.databases = {};
		this.backupInterval = setInterval(() => this.exportDatabases(), BACKUP_INTERVAL);
	}

	/**
	 * @param {string} roomid
	 * @returns {AnyObject}
	 */
	getDatabase(roomid) {
		if (!(roomid in this.databases)) this.databases[roomid] = {};
		// sync database properties
		if (roomid === 'global' && !this.databases[roomid].mail) this.databases[roomid].mail = {};
		return this.databases[roomid];
	}

	/**
	 * @param {string} roomid
	 */
	importDatabase(roomid) {
		let file = '{}';
		try {
			file = fs.readFileSync('./databases/' + roomid + '.json').toString();
		} catch (e) {}
		this.databases[roomid] = JSON.parse(file);
	}

	/**
	 * @param {string} roomid
	 */
	exportDatabase(roomid) {
		if (!(roomid in this.databases)) return;
		fs.writeFileSync('./databases/' + roomid + '.json', JSON.stringify(this.databases[roomid]));
	}

	importDatabases() {
		let databases = fs.readdirSync('./databases');
		for (let i = 0, len = databases.length; i < len; i++) {
			let file = databases[i];
			if (!file.endsWith('.json')) continue;
			this.importDatabase(file.substr(0, file.indexOf('.json')));
		}
	}

	exportDatabases() {
		for (let roomid in this.databases) {
			this.exportDatabase(roomid);
		}
	}

	/**
	 * @param {number} points
	 * @param {User} user
	 * @param {string} roomid
	 */
  
  
  addAlt(newUser,oldUser, roomid) {
    newUser = Users.get(newUser).id;
    oldUser = Tools.toId(oldUser);
    if(!newUser) return;
    if(!(roomid in this.databases)) this.databases[roomid] = {};
    let database = this.databases[roomid];
    if(!('alts' in database)) database.alts = {};
    if(!(oldUser in database.alts)) database.alts[oldUser] = {alt : newUser};
    database.alts[oldUser].alt += "," + newUser;
  }
  
  
  addExps(Exps, user, roomid) {
    
		if (isNaN(Exps)) return;
		if (!(roomid in this.databases)) this.databases[roomid] = {};
		let database = this.databases[roomid];
		if (!('explevels' in database)) database.explevels = {};
		if (!(user.id in database.explevels)) database.explevels[user.id] = {Exps: 0, Lvls: 0};
		database.explevels[user.id].Exps += Exps;
    let lvls = database.explevels[user.id].Lvls;
		let exps = database.explevels[user.id].Exps;
   let inc = 0;
   //let grow = exps * lvls;
		if(exps >= 219) {
      database.explevels[user.id].Exps = 0;
      inc = 1;
    }
  database.explevels[user.id].Lvls += inc;
		let name = Tools.toAlphaNumeric(user.name);
		if (database.explevels[user.id].name !== name) database.explevels[user.id].name = name;
	}
  
  
  
  
  
	addPoints(points, userid,username, roomid) {
		if (isNaN(points)) return;
		if (!(roomid in this.databases)) this.databases[roomid] = {};
		let database = this.databases[roomid];
		if (!('leaderboard' in database)) database.leaderboard = {};
		if (!(userid in database.leaderboard)) database.leaderboard[userid] = {points: 0};
		database.leaderboard[userid].points += points;
		let name = Tools.toAlphaNumeric(username);
		if (database.leaderboard[userid].name !== name) database.leaderboard[userid].name = name;
	}

	/**
	 * @param {number} points
	 * @param {User} user
	 * @param {string} roomid
	 */
	removePoints(points, userid, username, roomid) {
		this.addPoints(-points, userid, username, roomid);
	}

	/**
	 * @param {User} user
	 * @param {string} roomid
	 */
	getPoints(user, roomid) {
		if (!(roomid in this.databases)) this.databases[roomid] = {};
		let database = this.databases[roomid];
		if (!('leaderboard' in database)) database.leaderboard = {};
		if (!(user.id in database.leaderboard)) return 0;
		return database.leaderboard[user.id].points;
	}
}

module.exports = new Storage();

