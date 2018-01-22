var app = require('express')(),
    Discord = require('discord.js'),
    routes = require("./routes.js"),
    client = new Discord.Client();

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setGame(`on ${client.guilds.size} servers`);
});
    
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setGame(`on ${client.guilds.size} servers`);
});

client.login(config.token);

//EXPRESS
app.use(routes);
app.listen(process.env.PORT || 3000, function(){
    console.log("Express connected");
});
//

setInterval(() => {
    http.get(``);
}, 280000);