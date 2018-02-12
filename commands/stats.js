var messenger = require("../util/messenger.js");

module.exports.run = async (bot, message, args) => {
    message.author.lang = message.guild.region == "brazil" ? "br" : "us"
    messenger.playerStatsMessage(message.channel, message.author).catch((err) => console.log(err.message));
}

module.exports.config = {
    aliases: ["st","stats", "status"],
    description: "Shows player statistics."
}