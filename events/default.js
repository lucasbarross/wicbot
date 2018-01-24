var client = require("../client.js");
var config = require("../config.js");

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`on ${client.guilds.size} servers`);
});
    
client.on("guildCreate", (guild) => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", (guild) => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`on ${client.guilds.size} servers`);
});

function findCmd (alias){
    return new Promise((resolve, reject) => {
        var cmd = client.commands.get(alias)
        if(cmd){
            resolve(cmd)
        } else{
            reject(new Error("Command not found"));
        }
    })
}

client.on("message", (message) => {
    if (message.author.bot) return;
    var content = message.content.split(" ");
    var prefix = content[0];
    var cmdAlias = content[1];
    var args = content.slice(1);
    if (prefix == config.prefix){
        findCmd(cmdAlias).then((cmd) => cmd.run(client, message, args)).catch((err) => console.log(err.message))
    } else if (client.games.get(message.author.id)){
        client.games.get(message.author.id).registerAnswer(message.content);
    }
})