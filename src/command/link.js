const database = require('../model/storage');

function clan(server, tag) {
  database.linkClan(server, tag)
    .catch(console.error);
}

function player(user, tag) {
  database.linkPlayer(user, tag)
    .catch(console.error);
}

function help(channel) {
  channel.send(`\`coc!link [type] [tag]\`
type : \`joueur\` ou \`clan\`
tag :
- pour un joueur : dans le profil, en haut à gauche en dessous du pseudo
- pour le clan : il s'agit du tag trouvé sous le nom du clan
Chacun des tags commencent par un #, il faut l'inclure.`);
}

module.exports = function link(message) {
  const tokens = message.content.split(' ');
  if (tokens[1] === 'help') {
    help(message.channel);
  } else {
    const type = tokens[1];
    const tag = tokens[2];
    if (typeof type === 'undefined' || typeof tag === 'undefined')
      help(message.channel);
    else {
      if (type === 'joueur') player(message.author.id, tag);
      else if (type === 'clan') clan(message.author.id, tag);
      else help(message.channel);
    }
  }
}