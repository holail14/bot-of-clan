require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./command');
const database = require('./model/storage');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  //update the setTimeout of construction
  database.getBuildings('').then((buildings) => {
    if (buildings.length > 0) {
      buildings.forEach(building => {
        if (building.endTime > Date.now()) {
          setTimeout(() => {
            client.users.fetch(building.id).then((discordMember) => {
              discordMember.createDM().then(channel => {
                channel.send(`Hey ${discordMember.toString()}, ton ouvrier a terminé l'amélioration de ${building.building}`);
              });
            });
            database.deleteBuilding(building.id, building.building, building.startTime, building.endTime);
          }, building.endTime - Date.now());
        } else {
          client.users.fetch(building.id).then((discordMember) => {
            discordMember.createDM().then(channel => {
              channel.send(`Hey ${discordMember.toString()}, ton ouvrier a terminé l'amélioration de ${building.building}`);
            });
          });
          database.deleteBuilding(building.id, building.building, building.startTime, building.endTime);
        }
      });
    }
  });
});

client.on('guildMemberAdd', member => {
  member.createDM().then(channel => {
    channel.send('Bienvenue ! Je suis Le Sorcier du clan ! N\'hésite pas à me demander quoi que ce soit si tu as besoin. Mais avant tout, j\'ai besoin que tu te présente : envoie `coc!lier aide` pour savoir comment. Et si tu veux connaître l\'étendue de mon savoir, tu peux envoyer `coc!aide` et je te montrerai une partie de mes pouvoirs. :wink:');
  });
});

client.on('message', handleMessage);


function handleMessage(message) {
  if (! message.author.bot )
    if (message.content.startsWith('coc!')) {
      let command = message.content.split(' ')[0].substr(4);
      if (command in commands)
        commands[command](message);
    }
}

client.login(process.env.DISCORD);