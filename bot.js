const Discord = require('discord.js');
const client = new Discord.Client();
const { findPrice } = require('./price.js');
const { showWeather } = require('./weather.js');
const { strict } = require('assert');
const { serverParams } = require('./kf2.js');
const { Server, gamestatus, killServer, startServer } = require('./pid.js');
require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  const embed = new Discord.MessageEmbed();
  server = new Server();

  if (msg.content.includes("!price")) {
    searchItem = msg.content.split(" ").slice(1).join(" ");
    findPrice(searchItem, searchItem, embed);
  }

  if (msg.content.includes("!weather")) {
    showWeather(msg, embed);
  }

  if (msg.content.includes("!startserver")) {
    
    startServer(msg, embed, server);
    
  }

  if (msg.content.includes("!killserver")) {
    killServer(msg, embed);
  }

  if (msg.content.includes("!params")) {
    params = msg.content.split(" ").slice(1).join(" ");
    serverParams(msg, embed, params);
  }
  
  if (msg.content.includes("!kf2")) {
    gamestatus(msg, embed, server);
    server.pid="1111"
    msg.channel.send(JSON.stringify(server));
  }
});

client.login(DISCORD_TOKEN);