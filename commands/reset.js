

var Game = require("../models/Game");
var Promise = require("bluebird");
var api = require("../util/api_controller")

module.exports.run = async (bot, message, args) => {
    let lang = message.guild.region == "brazil" ? "br" : "us"
    api.resetStats(message.author.id)
    .then((res) => {
        return api.getText("resetText", lang)
    })
    .then((line) => { 
        return message.channel.send(line.data.text)
    })
    .catch((err) => console.log(err));
}

module.exports.config = {
    aliases: ["r","reset", "resetar"],
    description: "Reset game progress."
}