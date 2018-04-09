var moment = require("moment");

module.exports = async function (bot) {
    try {
        bot.games.forEach(game => {
            if(moment(moment.now()).diff(game.created_at, 'days') >= 1){
                bot.games.delete(game.user.id);
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}