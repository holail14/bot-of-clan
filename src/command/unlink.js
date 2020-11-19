const database = require('../model/storage');
const api = require('../model/api');

function player(user, tag, channel) {
  database.unlinkPlayer(user, tag)
    .then(() => {
      channel.send('Ce compte CoC n\'est désormais plus lié à votre profil !');
    })
    .catch(console.error);
}

function help(channel) {
  channel.send(`\`coc!delier joueur [tag]\` : Délie un compte CoC avec votre profil Discord
tag : dans le profil, en haut à gauche en dessous du pseudo
Chacun des tags commencent par un #, il ne faut pas l'inclure. :wink:`);
}

module.exports = function delier(message) {
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
      else help(message.channel);
    }
  }
};