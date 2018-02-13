var Game = require("../models/Game.js");

module.exports.run = async (bot, message, args) => {
    let game = bot.games.get(message.author.id);
    if(game){
        game.showHint();
    }
    message.delete().catch((err) => console.log(err.message));
}

module.exports.config = {
    aliases: ["d", "hint", "dica"],
    description: "Asks for a hint."
}