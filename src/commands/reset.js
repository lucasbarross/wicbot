

var Game = require("../models/Game");
var Promise = require("bluebird");
var api = require("../util/api_controller")

module.exports.run = async (bot, message, args) => {
    try {
        let lang = message.guild.region == "brazil" ? "br" : "us"
        await api.resetStats(message.author.id);
        const line = await api.getText("resetText", lang);
        await message.channel.send(message.author.toString() + ', ' + line.data.text)
    } catch (err) {
        console.log( "Error while resetting stats", err);
    }

}

module.exports.config = {
    aliases: ["r","reset", "resetar"],
    description: "Reset game progress."
}