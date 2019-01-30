var messenger = require("../util/messenger.js");
var api = require("../util/api_controller");
var axios = require("axios");
var constants = require("../config/constants");

module.exports.run = async (bot, message, args) => {
    try {
        let res = await api.getRank();
        const userGameStats = res.data;
        res = await axios.get(`https://discordapp.com/api/users/${userGameStats.id}`, { headers: { Authorization: `Bot ${constants.token}`}});
        const userDiscordInfo = res.data;
        await messenger.rankMessage(message.channel, userDiscordInfo, userGameStats, message.author.lang);
    } catch (err) {
        console.log("ERROR while trying to show rank", err);
    }
}

module.exports.config = {
    aliases: ["rk","ranking", "rank"],
    description: "Shows last player to complete the game"
}