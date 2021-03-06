if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  token: process.env.TOKEN,
  client: {
    secret: process.env.SECRET,
    uid: process.env.CLIENT_ID,
  },
  API_URL: process.env.API_URL,
  BOT_URL: process.env.BOT_URL,
  DBLTOKEN: process.env.DBLTOKEN,
  GUILD_WEBHOOK: process.env.GUILD_WEBHOOK,
  prefix: "?w",
};
