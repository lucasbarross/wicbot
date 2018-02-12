var webapp = require('express')(),
    Discord = require('discord.js'),
    config = require("./config/constants.js"),
    fs = require("fs-extra"),
    client = new Discord.Client();
    routes = require("./config/routes.js");

webapp.use(routes);
webapp.listen(process.env.PORT || 3000, function(){
    console.log("Express connected");
});

client.games = new Discord.Collection();

//SETUP COMMANDS
client.commands = new Discord.Collection();
fs.readdir("./commands/")
.then((files) => {
    var jsfiles = files.filter(f => f.split(".").pop() == 'js'); 
    jsfiles.forEach((file, i) => {
        var cmd = require(`./commands/${file}`);
        cmd.config.aliases.forEach((alias, i) => {
            client.commands.set(alias, cmd);
        })
    })
})
.catch((err) => { console.log(err) })
//

client.login(config.token).catch((err) => console.log(err));
module.exports = client;

require('./events/default');
require('./events/message');
require('./util/ping');