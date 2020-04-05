var client = require("../bot.js");
var config = require("../config/constants");
var axios = require("axios");
const DBL = require("dblapi.js");

client.on("ready", () => {
  console.log(
    `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
  );

  setInterval(() => {
    DBL.postStats(client.guilds.size, client.shard.id, client.shards.total);
  }, 1800000);

  client.user.setActivity(`?w help`);

  axios
    .post(config.GUILD_WEBHOOK, {
      content: "Hey, I'm ready!",
    })
    .catch((err) => console.log("ERROR POSTING TO WEBHOOK"));
});

client.on("error", (error) => {
  console.error("ERROR EVENT", error);
});
