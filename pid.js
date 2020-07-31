var ps = require('ps-node');
fs = require('fs');
const { exec, spawn } = require('child_process');


// difficulty

const difficulty = {
	HELL: "Hell on Earth",
	SUICIDAL: "Suicidal",
	HARD: "Hard",
	NORMAL: "Normal"
}

const waveLength = {
	SHORT: "Short (5 waves)",
	MEDIUM: "Medium (7 waves)",
	LONG: "Long (10 waves)"
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

async function readgameinfo(msg, embed, kfServer) {
	fs.readFile('kf2statuslog.txt', 'utf8', function (err, data) {
		if (err) return console.log(err);
		console.log(data);
		var data = JSON.stringify(JSON.parse(data).arguments[0]).split("?");
		//msg.channel.send(data);
		
		embed.setTitle("KF2 Server Status");
		embed.setColor('#0099ff');
		data.forEach(function (item) {
			var keys = item.split("=");
			if (keys[1]) {
				if (keys[0] == "difficulty") {
					switch(keys[1]) {
						case "0":
							embed.addField(`${keys[0]}:`, `normal`, false);
							break;
						case "1":
							embed.addField(`${keys[0]}:`, `hard`, false);
							break;
						case "2":
							embed.addField(`${keys[0]}:`, `suicidal`, false);
							break;
						case "3":
							embed.addField(`${keys[0]}:`, `hell on earth`, false);
							break;
						default:
							embed.addField(`${keys[0]}:`, `${keys[1]}`, false);
					} 
				} else if (keys[0] == "GameLength") {
					switch(keys[1]) {
						case "0":
							embed.addField(`${keys[0]}:`, `short (5 waves)`, false);
							break;
						case "1":
							embed.addField(`${keys[0]}:`, `medium (7 waves)`, false);
							break;
						case "2":
							embed.addField(`${keys[0]}:`, `long (10 waves)`, false);
							break;
						default:
							embed.addField(`${keys[0]}:`, `${keys[1]}`, false);
					}
				} else if (keys[0] == "pid") {
					// server.pid = keys[1];
				} else {
					embed.addField(`${keys[0]}:`, `${keys[1]}`, false);
				}
				
			} else {
				embed.addField(`Map: `, `${keys[0]}`, false);
				// kfServer.setMap(keys[0]);
			}
			
		})

		msg.channel.send({embed});

		});
}

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

function runKF2BatFile () {
	exec("start D:\\KF2\\KF2BatFile.bat", function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
	});
	console.log("Started KF2 Server")
}

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
					server.map = key[0];
				}
			}
			msg.channel.send(args);
			

		});

		//SERVER_PIDS.push();
});
}


module.exports = {
	gamestatus: async function (msg, embed, kfServer) {
		try {
			const result = await gamelookup();
		} catch (err) {console.log(err)}
		
		const lookupresult = await readgameinfo(msg, embed, kfServer);
	},
	killServer: async function (msg, embed) {
		createKF2BatFile(); // Creates the bat file that will be executed to start the KF2 Server
		runKF2BatFile(); // executes the KF2BatFile.bat 
		checkKF2ServerStarted(); // checks if the server did start by obtaining its PID

	},
	startServer: async function (msg, embed, server) {
		try {
			createKF2BatFile();
			runKF2BatFile();
			checkKF2ServerStarted(msg, embed, server);
		} catch {console.log(err)}
		
	},
	Server: class {
		// Class that stores KF2 server properties (pid, map, mutators, maxPlayers, etc...)
		constructor(pid=0, map=0, mutators="none", maxPlayers=6, difficulty=0, length=0, gameMode=0) {
			this.pid = pid;
			this.map = map;
			this.mutators = mutators;
			this.maxPlayers = maxPlayers;
			this.difficulty = difficulty;
			this.length = length;
			this.gameMode = gameMode;
		}
	
		setPid(pidOfServer) {
			this.pid = pidOfServer;
		}
	
		setMap(mapname) {
			this.map = mapname;
		}
	
		setMutators(mutatorString) {
			this.mutators = mutatorString;
		}
	
		setMaxPlayers(maxPlayers) {
			this.maxPlayers = maxPlayers;
		}

		setDifficulty(difficulty) {
			this.difficulty = difficulty;
		}

		setLength(length) {
			this.length = length;
		}
	}
}



