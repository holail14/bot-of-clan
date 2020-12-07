require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./command');
const onready = require('./command/onready')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  //update the setTimeout of construction
  onready.retrieveBuildings(client)

  //update server icon by icon of clan every day
  onready.updateServerIcon(client)
  setInterval(function(){onready.updateServerIcon(client)}, 86400000)
  
});

client.on('guildMemberAdd', member => {
  member.createDM().then(channel => {
    channel.send('Bienvenue ! Je suis Le Sorcier du clan ! N\'hésite pas à me demander quoi que ce soit si tu as besoin. Mais avant tout, j\'ai besoin que tu te présente : envoie `coc!lier aide` pour savoir comment. Et si tu veux connaître l\'étendue de mon savoir, tu peux envoyer `coc!aide` et je te montrerai une partie de mes pouvoirs. :wink:');
  });
});

client.on('message', handleMessage);


function handleMessage(message) {
  if (! message.author.bot )
    if (message.content.toLowerCase().startsWith('coc!')) {
      let command = message.content.split(' ')[0].substr(4).toLowerCase();
      if (command in commands)
        commands[command](message);
    }
}

client.login(process.env.DISCORD);