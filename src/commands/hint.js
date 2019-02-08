var gameController = require("../controllers/game");

module.exports.run = async (bot, message, args) => {
    const gameState = bot.games.get(message.author.id);
    
    if(gameState){
        gameController.showHint(gameState).catch((err) => console.log("ERROR SHOW HINT -> HINT MESSAGE METHOD", err.message));
    }

    message.delete(0).catch((err) => console.log("ERROR DELETING ?w d MESSAGE", err));
}

module.exports.config = {
    aliases: ["d", "hint", "dica"],
    description: "Asks for a hint."
}