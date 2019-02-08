module.exports.run = async (bot, message, args) => {
    let game = bot.games.get(message.author.id);
    if(game){
        bot.games.delete(message.author.id)
        game.message.delete(0).catch(err => console.log("ERROR DELETING GAME MESSAGE WHEN QUITTING", err));
        message.delete(0).catch((err) => console.log("ERROR DELETING ?w q MESSAGE WHEN QUITTING", err));
    }
}

module.exports.config = {
    aliases: ["q", "quit", "sair", "stop"],
    description: "Delete a game instance."
}