var Game = require("../models/Game.js");
var messenger = require("../util/messenger");
var api = require("../util/api_controller");
module.exports.run = async (bot, message, args) => {
    console.log("cheat", message.author.id)
    if (message.author.id == "85185900450942976") {
        const champions = (await api.getChampions("85185900450942976")).data;
        const promises = [];
        console.log("hello");
        champions.forEach(champion => {
            promises.push(api.postAnswer("85185900450942976", champion.id, true, false));
        });

        await Promise.all(promises);
    }
}

module.exports.config = {
    aliases: ["cheat"]
}