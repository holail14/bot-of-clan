const database = require('../model/storage');
const api = require('../model/api');

function retrieveBuildings(client) {
    database.getBuildings('').then((buildings) => {
        if (buildings.length > 0) {
            buildings.forEach(building => {
                if (building.endTime > Date.now()) {
                    setTimeout(() => {
                        client.users.fetch(building.id).then((discordMember) => {
                            discordMember.createDM().then(channel => {
                                channel.send(`Hey ${discordMember.toString()}, ton ouvrier a terminé l'amélioration de ${building.building}`);
                            });
                        });
                        database.deleteBuilding(building.id, building.building, building.startTime, building.endTime);
                    }, building.endTime - Date.now());
                } else {
                    client.users.fetch(building.id).then((discordMember) => {
                        discordMember.createDM().then(channel => {
                            channel.send(`Hey ${discordMember.toString()}, ton ouvrier a terminé l'amélioration de ${building.building}`);
                        });
                    });
                    database.deleteBuilding(building.id, building.building, building.startTime, building.endTime);
                }
            });
        }
    });
}

function updateServerIcon(client) {
    database.getAllClans().then((clans) => {
        for (index in clans) {
            let clan = clans[index]
            if (clan.canUpdateIcon) {
                api.clan(clan.tag).then((response) => {
                    let badgeUrl = response.data.badgeUrls.large
                    if(badgeUrl){
                        client.guilds.fetch(clan.id).then((server) => {
                            server.setIcon(badgeUrl)
                            .then(updated => console.log('Updated the guild icon'))
                            .catch(console.error);
                        });
                    }
                });
            }
        }
    })
}

module.exports = {
    retrieveBuildings,
    updateServerIcon
};