const database = require('../model/storage');
const api = require('../model/api');


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
                    if(!(user.id in already_delete)){
                      already_delete.push(user.id);
                      await editRoles(message, user.id, spectateur, guerrier);
                    }
                  })
                }
              }).catch(console.error);
            }
            resolve();
          }
          ).catch(console.error);
        } else {
          resolve();
        }
      })
        .catch(console.error);
    }, 500);
  });
}

async function update_roles(message, server_id) {
  await delete_old_role(message, server_id);
  let channel = message.channel;
  let guerrier = message.guild.roles.cache.find(role => role.name === 'Guerrier'); //get the good role
  let spectateur = message.guild.roles.cache.find(role => role.name === 'Spectateur'); //get the good role
  database.getClan(server_id).then((value) => { //get the clan tag
    if (value && value.tag) {
      api.currentwar(value.tag).then(async (response) => { //get info of current war
        let already_update = []
        for (let i in response.data.clan.members) {
          let member = response.data.clan.members[i];
          let tag = member.tag.replace('#', '');
          await database.getPlayerByTag(tag).then(async (users) => { //get discord id of coc player
            if (users) {
              users.forEach(async (user) => {
                if(!(user.id in already_update)){
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
      ).catch(console.error);
    } else {
      helpUndefinedTag(channel);
    }
  })
    .catch(console.error);
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
  channel.send(`\`coc!roles \`
  met à jour les roles de la gdc de ton clan`);
}


module.exports = function profil(message) {
  const tokens = message.content.split(' ');
  if (tokens[1]) {
    help(message.channel);
  } else {
    message.channel.send('Mise à jour des rôles en cours :arrows_counterclockwise: ');
    update_roles(message, message.guild.id);
  }
};