const database = require('../model/storage');

function clan(server, tag, channel) {
  database.linkClan(server, tag)
    .then(() => {
      channel.send('Votre serveur est désormais lié !');
    })
    .catch(console.error);
}

function player(user, tag, channel) {
  database.linkPlayer(user, tag)
    .then(() => {
      channel.send('Vous êtes désormais lié à votre profil !');
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

async function summarize(message) {
  database.getPlayers().then(async (players) => {
    let str = `Sur ce serveur discord, les utilisateurs suivants ont liés leur compte discord et leur compte CoC :`
    let linkedAccount = 0;
    for (let i in players) {
      let player = players[i];
      await message.guild.members.fetch(player.id).then((discordMember) => {
        if (discordMember) {
          str += `
          - ${discordMember.user.username}`
          linkedAccount++;
        }
      }).catch(() => {
        console.error('Utilisateur inconnu');
      });
    }
    if (linkedAccount > 0) {
      message.channel.send(str);
    } else {
      message.channel.send(`Aucun utilisateurs de ce serveur n'ont lié leur compte`);
    }
  });
}

module.exports = function lier(message) {
  const tokens = message.content.split(' ');
  if (tokens[1] === 'aide') {
    help(message.channel);
  } else if (tokens[1] === 'recap') {
    summarize(message)
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
};