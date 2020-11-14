const database = require('../model/storage');
const api = require('../model/api');
const translation = require('../translation/translation');

function level(channel, user_id, type) {
    database.getPlayer(user_id).then((value) => {
        if (value && value.tag) {
            api.player(value.tag).then((response) => {
                let niveau = ``;
                if (type == 'troupes') {
                    niveau += `Vraiment pas mal ces troupes \`${response.data.name}\` . Tu as :`;
                    for (let i in response.data.troops) {
                        let troop = response.data.troops[i];
                        if (troop.village == 'home' && !troop.name.includes('Super') && !troop.name.includes('Inferno') && !troop.name.includes('Sneaky')) {
                            niveau += `
                        - ${translation.french(troop.name)}, niveau ${troop.level}/${troop.maxLevel}`;
                        }
                    }
                } else if (type == 'sorts') {
                    niveau += `Tes sorts sont presques aussi puissant que les miens \`${response.data.name}\` :`;
                    for (let i in response.data.spells) {
                        let spell = response.data.spells[i];
                        if (spell.village == 'home') {
                            niveau += `
                        - ${translation.french(spell.name)}, niveau ${spell.level}/${spell.maxLevel}`;
                        }
                    }
                } else if (type == 'héros') {
                    niveau += `J'en connais qui rêverais d'avoir des héros aussi puissants \`${response.data.name}\` :`;
                    for (let i in response.data.heroes) {
                        let hero = response.data.heroes[i];
                        if (hero.village == 'home') {
                            niveau += `
                        - ${translation.french(hero.name)}, niveau ${hero.level}/${hero.maxLevel}`;
                        }
                    }
                }
                channel.send(niveau);
            })
                .catch((error) => { console.log(error) });
        }else{
            helpUndefinedTag(channel);
        }
    });
}

function helpUndefinedTag(channel) {
    channel.send(`J'ai beau être sorcier, je ne suis pas devin. Pense à ajouter ton tag de Clash of Clan (Utilise la commande \`coc!lier aide\`)`);
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
            else help(message.channel)
        }
    }
}