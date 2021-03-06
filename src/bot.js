const Discord = require("discord.js"),
  config = require("./config/constants.js"),
  fs = require("fs-extra"),
  purgeCron = require("./modules/schedules").purgeCron,
  setupDefaultEvents = require("./events/default"),
  setupMessageEvents = require("./events/message");

client = new Discord.Client();

client.games = new Discord.Collection();

//SETUP COMMANDS
client.commands = new Discord.Collection();
fs.readdir("./src/commands/")
  .then((files) => {
    var jsfiles = files.filter((f) => f.split(".").pop() == "js");
    jsfiles.forEach((file, i) => {
      var cmd = require(`./commands/${file}`);
      cmd.config.aliases.forEach((alias, i) => {
        client.commands.set(alias, cmd);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
//

client
  .login(config.token)
  .then((bot) => {
    purgeCron(client);
  })
  .catch((err) => console.log(err));

setupDefaultEvents(client);
setupMessageEvents(client);

module.exports = client;
