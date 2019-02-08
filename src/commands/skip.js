var gameController = require("../controllers/game");

module.exports.run = async (bot, message, args) => {
    const gameState = bot.games.get(message.author.id);
    
    if(gameState){
        gameController.skipChampion(gameState);
    }
    
    message.delete(0).catch((err) => console.log(err.message));
}

module.exports.config = {
    aliases: ["s", "skip", "pular"],
    description: "Skip a champion."
}