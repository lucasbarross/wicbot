var app = require('express')(),
    http = require('http'),    
    Discord = require('discord.js'),
    routes = require("./routes.js"),
    config = require("./config.js"),
    fs = require("fs-extra"),
    client = new Discord.Client();

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

client.login(config.token);
module.exports = client;
require("./events/default.js");

//EXPRESS
app.use(routes);
app.listen(process.env.PORT || 3000, function(){
    console.log("Express connected");
});
//

//PING
// setInterval(() => {
//     http.get(``);
// }, 280000);
//