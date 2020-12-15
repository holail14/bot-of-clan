const database = require('../model/storage');

function wallUpgrade(channel, nb, level) {
    database.getWall(level).then((wall) => {
        if (wall == null) {
            channel.send(`Ce niveau de mur n'existe pas :upside_down:`);
        } else {
            let cost = wall.cost * nb;
            if (wall.elixirUpgrade) {
                channel.send(`Il te faut ${cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} d'Elixir ou d'Or pour améliorer ${nb} murs au niveau ${level} :money_mouth: `)
            } else {
                channel.send(`Il te faut ${cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} d'Or pour améliorer ${nb} murs au niveau ${level} :money_mouth: `)
            }
        }
    }).catch(console.error);
}

async function wallsUpgrade(channel, nb, levelStart, levelEnd) {
    let goldCost = [];
    let elixirAndGoldCost = [];
    for (let i = parseFloat(levelStart) + 1; i <= levelEnd; i++) {
        await database.getWall(i).then((wall) => {
            let cost = wall.cost * nb;
            if (wall.elixirUpgrade) {
                elixirAndGoldCost.push(cost);
            } else {
                goldCost.push(cost);
            }
        }).catch(console.error);
    }
    if (elixirAndGoldCost.length > 0) {
        goldCost = goldCost.reduce((a, b) => a + b, 0);
        elixirAndGoldCost = elixirAndGoldCost.reduce((a, b) => a + b, 0);
        let total = goldCost + elixirAndGoldCost;
        let reduce = total * 0.8;
        if (goldCost > 0) {
            channel.send(`Il te faut ${goldCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} d'Or + ${elixirAndGoldCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} d'Elixir ou d'Or (soit ${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}) pour améliorer ${nb} murs du niveau ${levelStart} au niveau ${levelEnd} :money_mouth:
(tu as 20% de réduction avec le pass or, ce qui reviens à ${reduce.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}) #ad`)
        } else {
            reduce = elixirAndGoldCost * 0.8;
            channel.send(`Il te faut ${elixirAndGoldCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} d'Elixir ou d'Or pour améliorer ${nb} murs du niveau ${levelStart} au niveau ${levelEnd} :money_mouth: 
(tu as 20% de réduction avec le pass or, ce qui reviens à ${reduce.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}) #ad`)
        }
    } else {
        goldCost = goldCost.reduce((a, b) => a + b, 0);
        let reduce = goldCost * 0.8;
        channel.send(`Il te faut ${goldCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} d'Or pour améliorer ${nb} murs du niveau ${levelStart} au niveau ${levelEnd} :money_mouth:
(tu as 20% de réduction avec le pass or, ce qui reviens à ${reduce.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}) #ad`)
    }
}

function help(channel) {
    channel.send(`\`coc!murs [nb] [niveauDebut] [niveauFin]\`
        nb : nombre de murs à améliorer
        niveauDebut : niveau de vos murs a améliorer (ou niveau de départ)
        niveauFin : niveau max  vers lequel vous améliorer vos murs (facultatif)
exemple : \`coc!murs 25 10\` ou \`coc!murs 50 1 5\``);
}

module.exports = function lier(message) {
    const tokens = message.content.split(' ');
    if (tokens[1] === 'aide') {
        help(message.channel);
    } else {
        const nb = tokens[1];
        const levelStart = tokens[2];
        const levelEnd = tokens[3];
        if (typeof nb === 'undefined' || typeof levelStart === 'undefined')
            help(message.channel);
        else {
            if (levelStart < 0 || levelStart > 14 || levelEnd < 1 || levelEnd > 14) {
                message.channel.send(`Ce niveau de mur n'existe pas :upside_down:`);
            } else {
                if (typeof levelEnd === 'undefined') wallUpgrade(message.channel, nb, levelStart);
                else wallsUpgrade(message.channel, nb, levelStart, levelEnd);
            }
        }
    }
};