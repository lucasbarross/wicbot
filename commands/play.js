var Game = require("../models/Game.js");

module.exports.run = async (bot, message, args) => {
    if(bot.games.get(message.author.id)){
        message.channel.send("You are already playing!");
    } else {
        let game = new Game(message);
        game.start();
    }
}

module.exports.config = {
    aliases: ["p","j", "play", "jogar"],
    description: "Starts a game instance."
}