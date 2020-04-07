var Game = require("../models/Game.js");

module.exports.run = async (bot, message, args) => {
  let game = bot.games.get(message.author.id);
  if (game) {
    game.skipChampion();
  }
  message.delete({ timeout: 0 }).catch((err) => console.log(err.message));
};

module.exports.config = {
  aliases: ["s", "skip", "pular"],
  description: "Skip a champion.",
};
