require("./config/express");
require("./util/ping");

const config = require("./config/constants.js");

const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./src/bot.js", {
  token: config.token,
  totalShards: 2,
});

manager.spawn().catch((err) => console.log("error spawning shard", err));
manager.on("launch", (shard) =>
  console.log(`Launched shard ${shard.id}`, shard)
);
