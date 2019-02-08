const gameController = require("../controllers/game");
const moment = require ("moment");

module.exports.run = async (bot, message, args) => {
    if(bot.games.get(message.author.id)){
        message.channel.send("You are already playing!");
    } else {
        try {
            await message.delete(0);
        } catch (err) {
            console.log("ERROR DELETING ?w p MESSAGE " + err.message);
        } finally {
            const gameState = { channel: message.channel, user: message.author, created_at: moment.now() };
            gameController.start(bot, gameState);
        }
    }
}

module.exports.config = {
    aliases: ["p","j", "play", "jogar"],
    description: "Starts a game instance."
}