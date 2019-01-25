var moment = require("moment");
var config = require("../../../../config/constants");
var axios = require("axios");

module.exports = async function (bot) {
    try {
        bot.games.forEach(game => {
            if(moment(moment.now()).diff(game.created_at, 'days') >= 1){
                bot.games.delete(game.user.id);
            }
        });
    } catch (err) {
        axios
        .post(config.GUILD_WEBHOOK, 
        {
            content: err.message
        }).catch((err) => console.log("ERROR POSTING TO WEBHOOK"));
        console.log(err.message);
    }
}