var messenger = require("../util/messenger.js");

module.exports.run = async (bot, message, args) => {
    messenger.helpMessage(message.channel, message.author).catch((err) => console.log(err.message));
}

module.exports.config = {
    aliases: ["h","help", "ajuda"],
    description: "Displays help message."
}