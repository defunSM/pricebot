var ps = require('ps-node');
fs = require('fs');
const { exec, spawn } = require('child_process');

const PATH_TO_KF_BAT = "D:\\KF2\\KF2BatFile.bat";


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

const gameModes = {
	WEEKLY: "KFGameContent.KFGameInfo_WeeklySurvival",
	SURVIVAL: "KFGameContent.KFGameInfo_Survival",
	ENDLESS: "KFGameContent.KFGameInfo_Endless",
	VERUS: "KFGameContent.KFGameInfo_VersusSurvival",
	ZEDTERNAL: "ZedternalReborn.WMGameInfo_Endless"
}

const COMMAND = 'kfserver';
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
async function createKF2BatFile (msg, embed, server) {
	let binary = ".\\Binaries\\win64\\kfserver "
	
	let mutators = "?Mutator=KFMutator.KFMutator_MaxPlayersV2,DamageDisplay.DmgMut,ClassicScoreboard.ClassicSCMut?MaxPlayers=25?GameLength=2?difficulty=2?players=12"
	let mutator = "?Mutator=KFMutator.KFMutator_MaxPlayersV2,DamageDisplay.DmgMut,ClassicScoreboard.ClassicSCMut?MaxPlayers="
	
	
	let bat = binary + server.map + "?game=" + server.gameMode + mutator + server.maxPlayers + "?GameLength=" + server.length + "?difficulty=" + server.difficulty
	console.log("RESULT: ", bat);
	
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
							server.length = key[1];
						case "difficulty":
							switch(key[1].replace("\"]", "")) {
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
								default:
									console.log(key[1].replace("\"]", ""));
							}
							console.log(key[1]);

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
			if (server.status == "online") {
				
				embed.setTitle("KF2 Server Status");
				embed.setColor('#0099ff');
				embed.addField("Map:", server.map, false);
				embed.addField("Gamemode: ", server.gameMode, false);
				embed.addField("Mutators:", server.mutators, false);
				embed.addField("MaxPlayers:", server.maxPlayers, false);

				switch(server.length) {
					case "0":
						embed.addField("GameLength:", waveLength.SHORT, false);
						break;
					case "1":
						embed.addField("GameLength:", waveLength.MEDIUM, false);
						break;
					case "2":
						embed.addField("GameLength:", waveLength.LONG, false);
						break;
				}

				// switch(server.difficulty) {
				// 	case "0":
				// 		embed.addField("Difficulty", difficulty.NORMAL, false);
				// 		break;
				// 	case "1":
				// 		embed.addField("Difficulty", difficulty.HARD, false);
				// 		break;
				// 	case "2":
				// 		embed.addField("Difficulty", difficulty.SUICIDAL, false);
				// 		break;
				// 	case "3":
				// 		embed.addField("Difficulty", difficulty.HELL, false);
				// 		break;
				// 	default:
				// 		console.log("Strange server.difficulty -", server.difficulty);
				// }	

				embed.addField("Difficulty:", server.difficulty);
				
	
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

				args = msg.content.split(" ");
				for(var i=0; i < args.length; i++) {
					var param = args[i].split("=");
					switch(param[0]) {
						case "game":
							server.gameMode = param[1];
							break;
						case "maxplayers":
							server.maxPlayers = param[1];
							break;
						case "difficulty":
							server.difficulty = param[1];
							break;
						case "length":
							server.length = param[1];
							break;
						case "map":
							server.map = param[1];
							break;
						default:
							console.log("NOT IDENTIFIED: ", param[0], " and ", param[1]);
					}
				}

				createKF2BatFile(msg, embed, server);
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
		constructor(pid=0, status="offline", map="KF-BurningParis", mutators="none", maxPlayers="25", difficulty="2", length="2", gameMode=gameModes.SURVIVAL) {
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



