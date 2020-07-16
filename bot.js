const Discord = require('discord.js');
const client = new Discord.Client();
const { findPrice } = require('./price.js');
const { showWeather } = require('./weather.js');
const { strict } = require('assert');
const { startServer } = require('./kf2.js');
require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
var SERVER_STATUS = false;

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
    startServer(msg, embed);
  }

  if (msg.content.includes("killserver")) {
    killServer(msg, embed);
  }
});

client.login(DISCORD_TOKEN);