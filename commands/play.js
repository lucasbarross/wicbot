var Game = require("../models/Game.js");
var messenger = require("../util/messenger");

module.exports.run = async (bot, message, args) => {
    if(bot.games.get(message.author.id)){
        message.channel.send("You are already playing!");
    } else {
        console.log("CREATED A GAME INSTANCE");
        console.log("COLLECTION.GAMES:");
        let deleted = await message.delete(0).catch((err) => console.log("ERROR DELETING ?w p MESSAGE " + err.message));
        
        let loadingMsg = await messenger.loadingMessage(message.channel, message.author);

        let game = new Game(message, loadingMsg);
        game.start();
    }
}

module.exports.config = {
    aliases: ["p","j", "play", "jogar"],
    description: "Starts a game instance."
}