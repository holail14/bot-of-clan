const database = require('../model/storage');
const api = require('../model/api');


function delete_old_role(message, server_id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let disponible = message.guild.roles.cache.find(role => role.name === "Disponible"); //get the good role
            let indisponible = message.guild.roles.cache.find(role => role.name === "Indisponible"); //get the good role
            database.getClan(server_id).then((value) => { //get the clan tag
                if (value && value.tag) {
                    api.clan(value.tag).then((response) => { //get info of clan
                        for (let i in response.data.memberList) {
                            let member = response.data.memberList[i];
                            let tag = member.tag.replace('#', '');
                            database.getPlayerByTag(tag).then((user) => { //get discord id of coc player
                                if (user) {
                                    message.guild.members.fetch(user.id).then((discordMember) => {
                                        if (discordMember) {
                                            discordMember.roles.add(indisponible.id)
                                            discordMember.roles.remove(disponible.id)
                                        }
                                    });
                                }
                            }).catch((error) => { console.log(error) });
                        }
                        resolve();
                    }
                    ).catch((error) => { console.log(error) });
                } else {
                    resolve();
                }
            })
                .catch(console.error);
        }, 2000);
    });
}

async function update_roles(message, server_id) {
    await delete_old_role(message, server_id)
    let channel = message.channel;
    let disponible = message.guild.roles.cache.find(role => role.name === "Disponible"); //get the good role
    let indisponible = message.guild.roles.cache.find(role => role.name === "Indisponible"); //get the good role
    database.getClan(server_id).then((value) => { //get the clan tag
        if (value && value.tag) {
            api.currentwar(value.tag).then((response) => { //get info of current war
                for (let i in response.data.clan.members) {
                    let member = response.data.clan.members[i];
                    let tag = member.tag.replace('#', '');
                    database.getPlayerByTag(tag).then((user) => { //get discord id of coc player
                        if (user) {
                            message.guild.members.fetch(user.id).then((discordMember) => {
                                if (discordMember) {
                                    discordMember.roles.remove(indisponible.id)
                                    discordMember.roles.add(disponible.id)
                                }
                            });
                        }
                    }).catch((error) => { console.log(error) });
                }
                let update = `Les rôles ont bien été mis à jour pour la GDC contre ${response.data.opponent.name}.`;
                channel.send(update);
            }
            ).catch((error) => { console.log(error) });
        } else {
            helpUndefinedTag(channel);
        }
    })
        .catch(console.error);
}

function helpUndefinedTag(channel) {
    channel.send(`J'ai beau être sorcier, je ne suis pas devin. Pense à ajouter ton tag de Clan (Utilise la commande \`coc!link help\`)`);
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
        update_roles(message, message.guild.id);
    }
}