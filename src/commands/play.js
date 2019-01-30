var Game = require("../models/Game.js");
var messenger = require("../util/messenger");

module.exports.run = async (bot, message, args) => {
    if(bot.games.get(message.author.id)){
        message.channel.send("You are already playing!");
    } else {
        try {
            await message.delete(0);
        } catch (err) {
            console.log("ERROR DELETING ?w p MESSAGE " + err.message);
        } finally {
            let game = new Game(message);
            game.start(bot).catch(err => console.log("ERROR STARTING GAME", err));
        }
    }
}

module.exports.config = {
    aliases: ["p","j", "play", "jogar"],
    description: "Starts a game instance."
}