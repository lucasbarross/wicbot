

var Game = require("../models/Game");
var Promise = require("bluebird");
var api = require("../util/api_controller")

module.exports.run = async (bot, message, args) => {
    try {
        let lang = message.guild.region == "brazil" ? "br" : "us"
        let line;
        
        if(!bot.games.get(message.author.id)) {
            await api.resetStats(message.author.id);
            line = await api.getText("resetText", lang);
        } else {
            line = await api.getText("closeGameText", lang);
        };

        await message.channel.send(message.author.toString() + ', ' + line.data.text);
    } catch (err) {
        console.log( "Error while resetting stats", err);
    }

}

module.exports.config = {
    aliases: ["r","reset", "resetar"],
    description: "Reset game progress."
}