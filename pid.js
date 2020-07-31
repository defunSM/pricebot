var ps = require('ps-node');
fs = require('fs');
const { exec, spawn } = require('child_process');


// difficulty of the server
const difficulty = {
	HELL: "hell on earth",
	SUICIDAL: "suicidal",
	HARD: "hard",
	NORMAL: "normal"
}

// # of waves
const waveLength = {
	SHORT: "short (5 waves)",
	MEDIUM: "medium (7 waves)",
	LONG: "long (10 waves)"
}

const COMMAND = 'kfserver';
var SERVER_PIDS = [];
// A simple pid lookup

// Returns KF2 game arguments such as the map, mutators, gamemode and etc...
async function gamelookup() {
	var ARGUMENTS = [];
	ps.lookup({
    command: COMMAND
    }, function(err, resultList ) {
    if (err) {
        throw new Error( err );
    }
	//console.log(resultList);
	console.log("results:")
	console.log(resultList[0]);
	fs.writeFile('kf2statuslog.txt', JSON.stringify(resultList[0]), function (err) {
	if (err) return console.log(err);
	  console.log('wrote to kf2statuslog.txt');
	});
	// fs.close('kf2statuslog.txt', function (err) {
	// 	if (err) return console.log(err);
	// })
	});
	
}
// Creates a bat file to exec later that the runKF2BatFile function uses
async function createKF2BatFile (msg, embed) {
	let binary = ".\\Binaries\\win64\\kfserver "
	let map = "KF-BurningParis"
	let mutators = "?game=ZedternalReborn.WMGameInfo_Endless?Mutator=KFMutator.KFMutator_MaxPlayersV2,DamageDisplay.DmgMut,ClassicScoreboard.ClassicSCMut?MaxPlayers=25?GameLength=2?difficulty=2?players=12"
	let bat = binary + map + mutators
	fs.writeFile('KF2BatFile.bat', bat, function (err) {
		if (err) return console.log(err);
		  console.log('wrote to KF2BatFile.bat');
		});
}
// Executes the bat file created from the createKF2BatFile
function runKF2BatFile () {
	exec("start D:\\KF2\\KF2BatFile.bat", function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
	});
	console.log("Started KF2 Server")
}
// Looks up if there is a kfserver running and collects its arguments
function checkKF2ServerStarted (msg, embed, server) {
	gamelookup();
	ps.lookup({
		command: COMMAND
		}, function(err, resultList ) {
		if (err) {
			throw new Error( err );
		}
		// console.log(resultList);
		//console.log(resultList[0]);
		fs.readFile('kf2statuslog.txt', 'utf8', function (err, data) {
			if (err) {return console.log(err) } 
			
			console.log("data:\n"+data.split("\n"));
			pid = JSON.parse(data).pid;
			console.log("PID: " + pid);
			args = JSON.parse(data).arguments;
			server.pid = pid;
			console.log("server.pid: ", server.pid);

			property = JSON.stringify(args).split("?");
			for (var i=0; i < property.length; i++) {
				key = property[i].split("=");
				if(key[1]) {
					// console.log(key[1]);
					switch(key[0]) {
						case "game":
							server.gameMode = key[1];
							break;
						case "Mutator":
							server.mutators = key[1];
							break;
						case "MaxPlayers":
							server.maxPlayers = key[1];
							break;
						case "GameLength":
							switch(key[1]) {
								case "0":
									server.length = waveLength.SHORT;
									break;
								case "1":
									server.length = waveLength.MEDIUM;
									break;
								case "2":
									server.length = waveLength.LONG;
									break;
							}
						case "difficulty":
							switch(key[1]) {
								case "0":
									server.difficulty = difficulty.NORMAL;
									break;
								case "1":
									server.difficulty = difficulty.HARD;
									break;
								case "2":
									server.difficulty = difficulty.SUICIDAL;
									break;
								case "3":
									server.difficulty = difficulty.HELL;
									break;
							}

						default:
							console.log(key[0]);
					}
				} else {
					server.map = key[0].replace("[\"", "");
				}
			}
			// msg.channel.send(args);
			

		});

		//SERVER_PIDS.push();
});
}

// importing to bot.js
module.exports = {
	gamestatus: async function (msg, embed, server) {
		try {
			//const result = await gamelookup();
			if (server.status != "offline") {
				
				embed.setTitle("KF2 Server Status");
				embed.setColor('#0099ff');
				embed.addField("Map:", server.map, false);
				embed.addField("Gamemode: ", server.gameMode, false);
				embed.addField("Mutators:", server.mutators, false);
				embed.addField("MaxPlayers:", server.maxPlayers, false);
				embed.addField("GameLength", server.length, false);
				embed.addField("Difficulty", server.difficulty, false);
	
				msg.channel.send({embed});

			} else {
				embed.setTitle("KF2 Server is not running");
				embed.setColor('#FF0000');
			}


		} catch (err) {console.log(err)}
		
		//const lookupresult = await readgameinfo(msg, embed, kfServer);
	},
	killServer: async function (msg, embed, server) {
		ps.kill( server.pid, { 
			signal: 'SIGKILL',
			timeout: 10,  // will set up a ten seconds timeout if the killing is not successful
		}, console.log("Server killed"));

		embed.setTitle("KF2 Server killed");
		embed.setColor('#0099ff');
		msg.channel.send({embed});

		server.status = "offline";

	},
	startServer: async function (msg, embed, server) {
		try {

			if(server.status != "online") {
				createKF2BatFile();
				runKF2BatFile();
				checkKF2ServerStarted(msg, embed, server);
				
				server.status = "online";
	
				embed.setTitle("KF2 Server started");
				embed.setColor('#0099ff');
				//embed.addField("PID: ", server.pid, false);
				msg.channel.send({embed});
			
			} else {
				embed.setTitle("KF2 Server is already running");
				embed.setColor('#FF0000');

				msg.channel.send({embed});
			}
			

		} catch {console.log(err)}
		
	},
	Server: class {
		// Class that stores KF2 server properties (pid, map, mutators, maxPlayers, etc...)
		constructor(pid=0, status="offline", map=0, mutators="none", maxPlayers=6, difficulty=0, length=0, gameMode=0) {
			this.pid = pid;
			this.status = status;
			this.map = map;
			this.mutators = mutators;
			this.maxPlayers = maxPlayers;
			this.difficulty = difficulty;
			this.length = length;
			this.gameMode = gameMode;
		}
	
	}
}



