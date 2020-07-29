var ps = require('ps-node');
fs = require('fs');
const { exec } = require('child_process');
 
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

async function readgameinfo(msg, embed) {
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
				} else {
					embed.addField(`${keys[0]}:`, `${keys[1]}`, false);
				}
				
			} else {
				embed.addField(`Map: `, `${keys[0]}`, false);
			}
			
		})

		msg.channel.send({embed});

		});
}

async function createKF2BatFile (msg, embed) {
	let binary = "start .\\Binaries\\win64\\kfserver "
	let map = "KF-BurningParis"
	let mutators = "?game=ZedternalReborn.WMGameInfo_Endless?Mutator=KFMutator.KFMutator_MaxPlayersV2,DamageDisplay.DmgMut,ClassicScoreboard.ClassicSCMut,FriendlyHUD.FriendlyHUDMutator?MaxPlayers=25?GameLength=2?difficulty=2?players=12"
	let bat = binary + map + mutators
	fs.writeFile('KF2BatFile.bat', bat, function (err) {
		if (err) return console.log(err);
		  console.log('wrote to KF2BatFile.bat');
		});
}

function runKF2BatFile () {
	exec("D:\\KF2\\KF2BatFile.bat", function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
	});
	console.log("Started KF2 Server")
}

function checkKF2ServerStarted (msg, embed) {
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
			console.log(JSON.stringify(data));
			var data2 = JSON.stringify(data);
			msg.channel.send(data2);

		});

		//SERVER_PIDS.push();
});
}


module.exports = {
	gamestatus: async function (msg, embed) {
		try {
			const result = await gamelookup();
		} catch (err) {console.log(err)}
		
		const lookupresult = await readgameinfo(msg, embed);
	},
	killServer: async function (msg, embed) {
		createKF2BatFile(); // Creates the bat file that will be executed to start the KF2 Server
		runKF2BatFile(); // executes the KF2BatFile.bat 
		checkKF2ServerStarted(); // checks if the server did start by obtaining its PID

	},
	startServer: async function (msg, embed) {
		createKF2BatFile();
		runKF2BatFile();
		checkKF2ServerStarted(msg, embed);
	}
}



