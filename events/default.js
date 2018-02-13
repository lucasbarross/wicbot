var client = require("../server.js");
var config = require("../config/constants");
var axios = require("axios");
const DBL = require("dblapi.js");

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`on ${client.guilds.size} servers`);
    const dbl = new DBL(config.DBLTOKEN, client);
    axios
    .post("https://discordapp.com/api/webhooks/413050143621906432/PpANNw9GHATvTMMQyNw6z2vhz2IS9DbNVcIgWPI-w7BoVhq9tq_Sq78g_LUIlvPZnYwy", 
    {
        content: "Hey, I'm ready!"
    })
});
    
client.on("guildCreate", (guild) => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`on ${client.guilds.size} servers`);
    axios
    .post("https://discordapp.com/api/webhooks/413050143621906432/PpANNw9GHATvTMMQyNw6z2vhz2IS9DbNVcIgWPI-w7BoVhq9tq_Sq78g_LUIlvPZnYwy", 
    {
        content: "Hey, I joined the guild " + guild.name
    })
});

client.on("guildDelete", (guild) => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`on ${client.guilds.size} servers`);
    axios
    .post("https://discordapp.com/api/webhooks/413050143621906432/PpANNw9GHATvTMMQyNw6z2vhz2IS9DbNVcIgWPI-w7BoVhq9tq_Sq78g_LUIlvPZnYwy", 
    {
        content: "Hey, " + guild.name + " guild removed me! :("
    })
});