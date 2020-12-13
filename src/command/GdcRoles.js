const database = require('../model/storage');
const api = require('../model/api');
const translation = require('../translation/translation');


function delete_old_role(message, server_id) {
  return new Promise(resolve => {
    setTimeout(() => {
      let guerrier = message.guild.roles.cache.find(role => role.name === 'Guerrier'); //get the good role
      let spectateur = message.guild.roles.cache.find(role => role.name === 'Spectateur'); //get the good role
      database.getClan(server_id).then(async (value) => { //get the clan tag
        if (value && value.tag) {
          await api.clan(value.tag).then(async (response) => { //get info of clan
            let already_delete = []
            for (let i in response.data.memberList) {
              let member = response.data.memberList[i];
              let tag = member.tag.replace('#', '');
              await database.getPlayerByTag(tag).then(async (users) => { //get discord id of coc player
                if (users) {
                  users.forEach(async (user) => {
                    if (!(user.id in already_delete)) {
                      already_delete.push(user.id);
                      await editRoles(message, user.id, spectateur, guerrier);
                    }
                  })
                }
              }).catch(console.error);
            }
            resolve();
          }
          ).catch((error) => { console.error(error); message.channel.send(translation.french(error.response.data.message)) });
        } else {
          resolve();
        }
      })
        .catch(console.error);
    }, 500);
  });
}

async function update_gdc_roles(message, server_id) {
  await delete_old_role(message, server_id);
  let channel = message.channel;
  let guerrier = message.guild.roles.cache.find(role => role.name === 'Guerrier'); //get the good role
  let spectateur = message.guild.roles.cache.find(role => role.name === 'Spectateur'); //get the good role
  database.getClan(server_id).then((value) => { //get the clan tag
    if (value && value.tag) {
      api.currentwar(value.tag).then(async (response) => { //get info of current war
        if (response.data.state == 'notInWar') {
          channel.send(`Aucune GDC n'est en cours.`);
        } else {
          let already_update = []
          for (let i in response.data.clan.members) {
            let member = response.data.clan.members[i];
            let tag = member.tag.replace('#', '');
            await database.getPlayerByTag(tag).then(async (users) => { //get discord id of coc player
              if (users) {
                users.forEach(async (user) => {
                  if (!(user.id in already_update)) {
                    already_update.push(user.id);
                    await editRoles(message, user.id, guerrier, spectateur);
                  }
                })
              }
            }).catch(console.error);
          }
          let update = `Les rôles ont bien été mis à jour pour la GDC contre ${response.data.opponent.name}.`;
          channel.send(update);
        }
      }
      ).catch((error) => {
        console.error(error);
        if (error.response.data.message) {
          channel.send(translation.french(error.response.data.message))
        } else {
          channel.send(`Aucune LDC n'est en cours.`);
        }
      });
    } else {
      helpUndefinedTag(channel);
    }
  })
    .catch(console.error);
}

async function update_ldc_roles(message, server_id) {
  await delete_old_role(message, server_id);
  let channel = message.channel;
  let guerrier = message.guild.roles.cache.find(role => role.name === 'Guerrier'); //get the good role
  let spectateur = message.guild.roles.cache.find(role => role.name === 'Spectateur'); //get the good role
  database.getClan(server_id).then((value) => { //get the clan tag
    if (value && value.tag) {
      api.currentleague(value.tag).then(async (response) => { //get info of current war
        if (!response.data || response.data.state == 'notInWar') {
          channel.send(`Aucune LDC n'est en cours.`);
        } else {
          let clan = response.data.clans.filter(clan => clan.tag == '#' + value.tag);
          let already_update = []
          for (let i in clan[0].members) {
            let member = clan[0].members[i];
            let tag = member.tag.replace('#', '');
            await database.getPlayerByTag(tag).then(async (users) => { //get discord id of coc player
              if (users) {
                users.forEach(async (user) => {
                  if (!(user.id in already_update)) {
                    already_update.push(user.id);
                    await editRoles(message, user.id, guerrier, spectateur);
                  }
                })
              }
            }).catch(console.error);
          }
          let otherClans = response.data.clans.filter(clan => clan.tag != '#' + value.tag);
          let otherClansName = []
          otherClans.forEach(clan => otherClansName.push(clan.name))
          let update = `Les rôles ont bien été mis à jour pour la LDC de la saison de **${convertDate(response.data.season)}** contre ${otherClansName.join(', ')}.`;
          channel.send(update);
        }
      }
      ).catch((error) => {
        console.error(error);
        if (error.response.data.message) {
          channel.send(translation.french(error.response.data.message))
        } else {
          channel.send(`Aucune LDC n'est en cours.`);
        }
      });
    } else {
      helpUndefinedTag(channel);
    }
  })
    .catch(console.error);
}

function convertDate(fulldate) {
  let date = fulldate.split('-');
  let month;
  if (date[1] == 1 || date[1] == 01) {
    month = 'janvier'
  } else if (date[1] == 2 || date[1] == 02) {
    month = 'février'
  } else if (date[1] == 3 || date[1] == 03) {
    month = 'mars'
  } else if (date[1] == 4 || date[1] == 04) {
    month = 'avril'
  } else if (date[1] == 5 || date[1] == 05) {
    month = 'mai'
  } else if (date[1] == 6 || date[1] == 06) {
    month = 'juin'
  } else if (date[1] == 7 || date[1] == 07) {
    month = 'juillet'
  } else if (date[1] == 8 || date[1] == 08) {
    month = 'août'
  } else if (date[1] == 9 || date[1] == 09) {
    month = 'septmbre'
  } else if (date[1] == 10) {
    month = 'octobre'
  } else if (date[1] == 11) {
    month = 'novembre'
  } else {
    month = 'décembre'
  }

  return month + ' ' + date[0];
}

function editRoles(message, user_id, roleToAdd, roleToRemove) {
  return new Promise((resolve) => {
    setTimeout(() => {
      message.guild.members.fetch(user_id).then((discordMember) => {
        if (discordMember) {
          discordMember.roles.add(roleToAdd.id);
          discordMember.roles.remove(roleToRemove.id);
        }
        resolve();
      }).catch(() => {
        console.error('Utilisateur inconnu');
        resolve();
      });
    }, 500);
  });
}

function helpUndefinedTag(channel) {
  channel.send('J\'ai beau être sorcier, je ne suis pas devin. Pense à ajouter ton tag de Clan (Utilise la commande `coc!lier aide`)');
}

function help(channel) {
  channel.send(`\`coc!roles [type]\`
  met à jour les roles de la gdc de ton clan
  type : \`GDC\` ou \`LDC\``);
}


module.exports = function profil(message) {
  if (!message.member.roles.cache.find(r => r.name === "Chef")) {
    message.channel.send(`Seul un vrai **Chef** peut utiliser cette commande :smiling_imp: `);
  } else {
    const tokens = message.content.split(' ');
    if (tokens[1] === undefined) {
      help(message.channel);
    } else {
      if (tokens[1].toLowerCase() == 'gdc') {
        message.channel.send('Mise à jour des rôles en cours pour la GDC :arrows_counterclockwise: ');
        update_gdc_roles(message, message.guild.id);
      } else if (tokens[1].toLowerCase() == 'ldc') {
        message.channel.send('Mise à jour des rôles en cours pour la LDC :arrows_counterclockwise: ');
        update_ldc_roles(message, message.guild.id);
      } else {
        help(message.channel);
      }
    }
  }
};