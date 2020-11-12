const database = require('../model/storage');

function clan(server, tag, channel) {
  database.linkClan(server, tag)
    .then(() => {
      channel.send("Votre serveur est désormais lié !");
    })
    .catch(console.error);
}

function player(user, tag, channel) {
  database.linkPlayer(user, tag)
    .then(() => {
      channel.send("Vous êtes désormais lié à votre profil !");
    })
    .catch(console.error);
}

function help(channel) {
  channel.send(`\`coc!lier [type] [tag]\`
type : \`joueur\` ou \`clan\`
tag :
- pour un joueur : dans le profil, en haut à gauche en dessous du pseudo
- pour le clan : il s'agit du tag trouvé sous le nom du clan
Chacun des tags commencent par un #, il ne faut pas l'inclure. :wink:`);
}

module.exports = function link(message) {
  const tokens = message.content.split(' ');
  if (tokens[1] === 'aide') {
    help(message.channel);
  } else {
    const type = tokens[1];
    const tag = tokens[2];
    if (typeof type === 'undefined' || typeof tag === 'undefined')
      help(message.channel);
    else {
      if (type === 'joueur') player(message.author.id, tag, message.channel);
      else if (type === 'clan') clan(message.guild.id, tag, message.channel);
      else help(message.channel);
    }
  }
}