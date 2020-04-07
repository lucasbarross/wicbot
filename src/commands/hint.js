var Game = require("../models/Game.js");

module.exports.run = async (bot, message, args) => {
  let game = bot.games.get(message.author.id);

  if (game) {
    game
      .showHint()
      .catch((err) =>
        console.log("ERROR SHOW HINT -> HINT MESSAGE METHOD", err.message)
      );
  }

  message
    .delete({ timeout: 0 })
    .catch((err) => console.log("ERROR DELETING ?w d MESSAGE", err));
};

module.exports.config = {
  aliases: ["d", "hint", "dica"],
  description: "Asks for a hint.",
};
