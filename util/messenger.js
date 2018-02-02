var api = require("./api_controller");

// DEFAULT: 0,
// AQUA: 1752220,
// GREEN: 3066993,
// BLUE: 3447003,
// PURPLE: 10181046,
// GOLD: 15844367,
// ORANGE: 15105570,
// RED: 15158332,
// GREY: 9807270,
// DARKER_GREY: 8359053,
// NAVY: 3426654,
// DARK_AQUA: 1146986,
// DARK_GREEN: 2067276,
// DARK_BLUE: 2123412,
// DARK_PURPLE: 7419530,
// DARK_GOLD: 12745742,
// DARK_ORANGE: 11027200,
// DARK_RED: 10038562,
// DARK_GREY: 9936031,
// LIGHT_GREY: 12370112,
// DARK_NAVY: 2899536

module.exports.championMessage = async (channel, user, representation) => {
    return channel.send({embed: {
        color: 8359053,
        author: {
          name: user.username,
          icon_url: user.avatarURL
        },
        description: representation
      }
    });
}

module.exports.playerStatsMessage = async (channel, user) => {
    try{
        var stats = await api.getPlayerStats(user.id);
        var statsArray = [stats.total_tries, stats.status.count, stats.remaining]
        var text = await api.getText("startText", user.lang)
        for(var i = 0; i < 3; i++){
            text = text.replace(`%${i}$d`, statsArray[i])
        }
        return channel.send(
            {
                embed: 
                {
                    color: 3066993,
                    author: {
                        name: user.username,
                        icon_url: user.avatarURL
                },
                description: text
            }
        });
    } catch(err){
        console.log(err.message);
    }
}

module.exports.helpMessage = async (channel, user) => {
    try{
        var title = await api.getText("helpTitle", user.lang);
        var body = await api.getText("helpText", user.lang);
        return channel.send({embed: {
            color: 15105570,
            title: title,
            description: body
        }
        });
    }catch(err){
        console.log(err.message);
    }
}


module.exports.hintMessage = async (channel, user, championName) => {
    try{
        var hint = await api.getText(championName+"Text", user.lang);
        var text = await api.getText("hintTitle", user.lang);
        return channel.send({embed: {
            color: 2123412,
            author: {
            name: text + ' ' + user.username,
            icon_url: user.avatarURL
            },
            description: hint
        }
        });
    } catch(err){
        console.log(err.message);
    }
}

module.exports.editChampionMessage = async (user, message, nextChampion) => {
    return message.edit({embed: {
        color: 3447003,
        author: {
          name: user.username,
          icon_url: user.avatarURL
        },
        description: nextChampion
      }
    });
}

module.exports.feedbackMessage = async (channel, user, message, correct) => {
    try{
        let query = correct ? "correct" : "incorrect"
        let color = correct ? 3066993 : 15158332;
        let file = correct ? "https://image.flaticon.com/icons/png/128/443/443138.png" : "https://en.vmm.be/stay-in-touch/icons/red-tick.png/@@images/62e4cd3d-46f0-42c8-b245-48b457cfe51a.png";
        let title = await api.getText(query+"Text", user.lang);
        return message.edit({embed: {
            color: color,
            title: title,
            author: {
                name: user.username,
                icon_url: user.avatarURL
            },
            file: file
        }
        });
    }catch(err){
        console.log(err.message);
    }
}