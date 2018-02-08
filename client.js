var webapp = require('./config/express'),
    http = require('http'),    
    Discord = require('discord.js'),
    config = require("./config/config.js"),
    fs = require("fs-extra"),
    client = new Discord.Client();
    
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