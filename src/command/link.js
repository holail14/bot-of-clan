const database = require('../model/storage');
const api = require('../model/api');

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
  let clan_id = (await database.getClan(message.guild.id));
  let membersCoc = (await api.members(clan_id.tag)).data.items;
  let notLinkedUsers = [];
  //get members of discord serveur
  await message.guild.members.fetch().then((members) => {
    if (members) {
      for (const member of members.values()) {
        if (!member.user.bot) {
          notLinkedUsers.push(member)
        }
      }
    }
  }).catch(console.error);
  let linkedUsers = []
  //get discord member that linked their account
  await database.getPlayers().then(async (players) => {
    for (let i in players) {
      let player = players[i];
      //remove player to list of CoC members
      membersCoc.splice(membersCoc.findIndex(function (i) {
        return i.tag === '#'+player.tag;
      }), 1);

      await message.guild.members.fetch(player.id).then((discordMember) => {
        if (discordMember) {

          //remove discordMember to not linked list
          index = notLinkedUsers.indexOf(discordMember)
          if (index > -1) {
            notLinkedUsers.splice(index, 1);
          }
          //add discordMember to linked list
          linkedUsers.push(discordMember)
        }
      }).catch(() => {
        console.error('Utilisateur inconnu');
      });
    }
  });
  let str = '';
  if (linkedUsers.length > 0) {
    str += `Sur ce serveur discord, les utilisateurs suivants ont liés leur compte discord et leur compte CoC : :grin: :`;
    linkedUsers.forEach((user) =>
      str += `
      - ${user.user.username}`
    );
  }
  if (notLinkedUsers.length > 0) {
    str += `

Les utilisateurs suivants n'ont **PAS** liés leurs comptes discord et CoC (Vite, aidez vous de la commande \`coc!lier aide\`) :worried: :`;
    notLinkedUsers.forEach((user) =>
      str += `
      - ${user.user.toString()}`
    );
  }
  if (membersCoc.length > 0) {
    str += `

Les membres de votre clan suivants n'ont pas rejoint le discord (ou n'ont pas lié leur compte) :cry: :`;
membersCoc.forEach((user) =>
      str += `
      - ${user.name}`
    );
  }
  message.channel.send(str);
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