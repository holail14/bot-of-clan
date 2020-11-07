require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./command');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', handleMessage);


function handleMessage(message) {
  if (message.content.startsWith('coc!')) {
    let command = message.content.split(' ')[0].substr(4);
    if (command in commands)
      commands[command](message);
  }
}

client.login(process.env.DISCORD);