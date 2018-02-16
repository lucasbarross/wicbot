var client = require("../server.js");
var config = require("../config/constants");
var axios = require("axios");
const DBL = require("dblapi.js");

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`?w help`);
    //const dbl = new DBL(config.DBLTOKEN, client);
    axios
    .post(config.GUILD_WEBHOOK, 
    {
        content: "Hey, I'm ready!"
    }).catch((err) => console.log("ERROR POSTING TO WEBHOOK"));
});
    
client.on("guildCreate", (guild) => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    axios
    .post(config.GUILD_WEBHOOK, 
    {
        content: "Hey, I joined the guild " + guild.name
    }).catch((err) => console.log("ERROR POSTING TO WEBHOOK"));
});

client.on("guildDelete", (guild) => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    axios
    .post(config.GUILD_WEBHOOK, 
    {
        content: "Hey, " + guild.name + " guild removed me! :("
    }).catch((err) => console.log("ERROR POSTING TO WEBHOOK"));
});