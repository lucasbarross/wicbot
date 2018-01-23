var Instance = require("../models/instance.js");

module.exports.run = async (bot, message, args) => {
    if(bot.instances.get(message.author.id)){
        message.channel.send("You are already playing!");
    } else {
        let instance = new Instance(message.author.id);
        bot.instances.set(message.author.id, instance)
        instance.start();
    }
}

module.exports.config = {
    aliases: ["p","j", "play", "jogar"],
    description: "Starts a game instance."
}