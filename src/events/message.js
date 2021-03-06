var config = require("../config/constants.js");

module.exports = function (client) {
  client.on("message", (message) => {
    if (message.author.bot) return;
    var content = message.content.split(" ");
    var prefix = content[0];
    var cmdAlias = content[1];
    var args = content.slice(1);
    var game = client.games.get(message.author.id);

    if (message.guild) {
      message.author.lang = message.guild.region == "brazil" ? "br" : "us";
    } else {
      message.author.lang = "us";
    }

    if (prefix == config.prefix) {
      runCmd(cmdAlias, message, args);
    } else if (game) {
      if (game.channel == message.channel) {
        client.games
          .get(message.author.id)
          .registerAnswer(message)
          .catch((err) => console.log("ERROR REGISTERING ANSWER", err));
      }
    }
  });
};

function runCmd(alias, message, args) {
  const cmd = client.commands.get(alias);

  if (cmd) {
    cmd.run(client, message, args);
  } else {
    console.log("Command not found", alias);
  }
}
