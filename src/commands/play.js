const gameController = require("../controllers/game");

module.exports.run = async (bot, message, args) => {
    if(bot.games.get(message.author.id)){
        message.channel.send("You are already playing!");
    } else {
        try {
            await message.delete(0);
        } catch (err) {
            console.log("ERROR DELETING ?w p MESSAGE " + err.message);
        } finally {
            const gameState = { channel: message.channel, user: message.author };
            gameController.start(bot, gameState);
        }
    }
}

module.exports.config = {
    aliases: ["p","j", "play", "jogar"],
    description: "Starts a game instance."
}