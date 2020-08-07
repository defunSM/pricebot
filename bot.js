const Discord = require('discord.js');
const client = new Discord.Client();
const { findPrice } = require('./price.js');
const { showWeather } = require('./weather.js');
const { serverParams, kf2Login } = require('./kf2.js');
const { Server, gamestatus, killServer, startServer } = require('./pid.js');
require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
server = new Server();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  const embed = new Discord.MessageEmbed();
  

  if (msg.content.includes("!price")) {
    searchItem = msg.content.split(" ").slice(1).join(" ");
    findPrice(searchItem, searchItem, embed);
  }

  if (msg.content.includes("!weather")) {
    showWeather(msg, embed);
  }

  if (msg.content.includes("!startserver")) {
    
    try {
      if (msg.member.hasPermission('ADMINISTRATOR')) console.log('User is an admin.');
    } catch {
      console.log("user is not ADmin:");
    }
    
    console.log(msg.content);

    startServer(msg, embed, server);
    
  }

  if (msg.content.includes("!killserver")) {
    killServer(msg, embed, server);
  }

  if (msg.content.includes("!params")) {
    params = msg.content.split(" ").slice(1).join(" ");
    serverParams(msg, embed, params);
  }
  
  if (msg.content.includes("!kf2")) {
    gamestatus(msg, embed, server);
    //msg.channel.send(JSON.stringify(server));
  }

  if (msg.content == "!maps") {
    msg.channel.send("https://i.imgur.com/nvldvkP.png");
    msg.channel.send("https://i.imgur.com/g2nHRr7.png");
  }

  if (msg.content == "!kf2help") {
    msg.channel.send("https://i.imgur.com/Of5nJVs.png");
  }

  if (msg.content == "!kf2login") {
    kf2Login(msg, embed);
  }
});

client.login(DISCORD_TOKEN);