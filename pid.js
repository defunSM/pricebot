var ps = require('ps-node');
fs = require('fs');
 
const COMMAND = 'kfserver';
// A simple pid lookup

// Returns KF2 game arguments such as the map, mutators, gamemode and etc...
function gamelookup() {
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
	});
}

function readgameinfo(msg, embed) {
	
}

module.exports = {
	gamestatus: function (msg, embed) {
		gamelookup();

		fs.readFile('kf2statuslog.txt', 'utf8', function (err, data) {
		if (err) return console.log(err);
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
}



