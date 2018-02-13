var Game = require("../models/Game.js");

module.exports.run = async (bot, message, args) => {
    let game = bot.games.get(message.author.id);
    if(game){
        bot.games.delete(message.author.id)
        game.message.delete().catch(err => console.log(err.message));
        message.delete().catch((err) => console.log(err.message));
    }
}

module.exports.config = {
    aliases: ["q", "quit", "sair"],
    description: "Delete a game instance."
}