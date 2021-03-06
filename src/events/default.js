var config = require("../config/constants");
var axios = require("axios");
const DBL = require("dblapi.js");

module.exports = function (client) {
  client.on("ready", () => {
    console.log(
      `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
    );

    const dbl = new DBL(config.DBLTOKEN, client);

    setInterval(() => {
      dbl.postStats(client.guilds.size, client.shard.id, client.shard.total);
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
};
