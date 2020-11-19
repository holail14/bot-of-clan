const database = require('../model/storage');
const api = require('../model/api');
const translation = require('../translation/translation');

function send_profile(channel, user_id) {
  database.getPlayer(user_id).then((value) => {
    if (value) {
      value.forEach((user) => {
        if (user.tag) {
          api.player(user.tag).then((response) => {
            let profil = `Salut \`${response.data.name}\` !
  Pas mal cet HDV ${response.data.townHallLevel}, alors que tu es seulement niveau ${response.data.expLevel}.
  Actuellement tu as ${response.data.trophies} trophées, mais tu as réussi à aller jusqu'à ${response.data.bestTrophies} trophées :open_mouth:
  Tu es ${translation.french(response.data.role)} du clan ${response.data.clan.name}, clan niveau ${response.data.clan.clanLevel}.
  
  Sur la base des ouvriers, ta maison est niveau ${response.data.builderHallLevel}.
  Tu as gagné ${response.data.versusBattleWins} duels, ce qui te permet d'avoir ${response.data.versusTrophies} trophées.`;

            channel.send(profil);
          })
            .catch((error) => { console.log(error); });
        }
      })
    } else {
      helpUndefinedTag(channel);
    }
  })
    .catch(console.error);
}

function helpUndefinedTag(channel) {
  channel.send('J\'ai beau être sorcier, je ne suis pas devin. Pense à ajouter ton tag de Clash of Clan (Utilise la commande `coc!lier aide`)');
}

function help(channel) {
  channel.send(`\`coc!profil \`
  retourne les informations de ton profil :shushing_face:`);
}


module.exports = function profil(message) {
  const tokens = message.content.split(' ');
  if (tokens[1]) {
    help(message.channel);
  } else {
    send_profile(message.channel, message.author.id);
  }
};