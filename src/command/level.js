const database = require('../model/storage');
const api = require('../model/api');
const translation = require('../translation/translation');

function level(channel, user_id, type) {
  database.getPlayer(user_id).then((value) => {
    if (value) {
      value.forEach((user) => {
        if (user.tag) {
          api.player(user.tag).then((response) => {
            let niveau = '';
            if (type == 'troupes') {
              if (response.data.troops.length > 0) {
                niveau += `Vraiment pas mal ces troupes \`${response.data.name}\` . Tu as :`;
                let builderBaseTroops = [];
                for (let i in response.data.troops) {
                  let troop = response.data.troops[i];
                  if ((troop.name == 'Super P.E.K.K.A') || (!troop.name.includes('Super') && !troop.name.includes('Inferno') && troop.name != 'Ice Hound' && !troop.name != 'Sneaky Gobelin')) {
                    if (troop.village == 'home') {
                      niveau += `
                          - ${translation.french(troop.name)}, niveau ${troop.level}/${troop.maxLevel}`;
                    } else {
                      builderBaseTroops.push(troop);
                    }
                  }
                }
                if (builderBaseTroops.length > 0) {
                  niveau += `
              Sur la base des ouvriers, tu as :`;
                  for (let y in builderBaseTroops) {
                    let builderTroop = builderBaseTroops[y];
                    niveau += `
                          - ${translation.french(builderTroop.name)}, niveau ${builderTroop.level}/${builderTroop.maxLevel}`;
                  }
                }
              } else {
                niveau += `Comment veux tu te battre sans troupes \`${response.data.name}\` :thinking: . `;
              }
            } else if (type == 'sorts') {
              if (response.data.spells.length > 0) {
                niveau += `Tes sorts sont presques aussi puissant que les miens \`${response.data.name}\` :`;
                for (let i in response.data.spells) {
                  let spell = response.data.spells[i];
                  if (spell.village == 'home') {
                    niveau += `
                        - ${translation.french(spell.name)}, niveau ${spell.level}/${spell.maxLevel}`;
                  }
                }
              } else {
                niveau += `Tu ne possède aucuns sorts \`${response.data.name}\`, tu veux que je t'en apprennes ? :teacher:`;
              }
            } else if (type == 'héros') {
              if (response.data.heroes.length > 0) {
                niveau += `J'en connais qui rêverais d'avoir des héros aussi puissants \`${response.data.name}\` :`;
                for (let i in response.data.heroes) {
                  let hero = response.data.heroes[i];
                  niveau += `
                        - ${translation.french(hero.name)}, niveau ${hero.level}/${hero.maxLevel}`;
                }
              } else {
                niveau += `Tu n'as aucuns héros \`${response.data.name}\`, tu veux le 06 de la reine ? :spy:`;
              }
            }
            channel.send(niveau, { split: true });
          })
            .catch((error) => { console.log(error); channel.send(translation.french(error.response.data.message)) });
        }
      })
    } else {
      helpUndefinedTag(channel);
    }
  });
}

function helpUndefinedTag(channel) {
  channel.send('J\'ai beau être sorcier, je ne suis pas devin. Pense à ajouter ton tag de Clash of Clan (Utilise la commande `coc!lier aide`)');
}

function help(channel) {
  channel.send(`\`coc!niveau [type]\`
type : \`troupes\` ou \`sorts\` ou \`héros\`
retourne les niveaux des troupes, sorts ou héros :muscle:`);
}

module.exports = function levels(message) {
  const tokens = message.content.split(' ');
  if (tokens[1] === 'aide') {
    help(message.channel);
  } else {
    const type = tokens[1];
    if (typeof type === 'undefined')
      help(message.channel);
    else {
      if (type == 'troupes' || type == 'sorts' || type == 'héros') level(message.channel, message.author.id, type);
      else help(message.channel);
    }
  }
};