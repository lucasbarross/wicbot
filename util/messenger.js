var api = require("./api_controller");

const colors = {
    DEFAULT: 0,
    AQUA: 1752220,
    GREEN: 3066993,
    BLUE: 3447003,
    PURPLE: 10181046,
    GOLD: 15844367,
    ORANGE: 15105570,
    RED: 15158332,
    GREY: 9807270,
    DARKER_GREY: 8359053,
    NAVY: 3426654,
    DARK_AQUA: 1146986,
    DARK_GREEN: 2067276,
    DARK_BLUE: 2123412,
    DARK_PURPLE: 7419530,
    DARK_GOLD: 12745742,
    DARK_ORANGE: 11027200,
    DARK_RED: 10038562,
    DARK_GREY: 9936031,
    LIGHT_GREY: 12370112,
    DARK_NAVY: 2899536
}

module.exports.championMessage = async (channel, user, representation) => {
    return channel.send(user.toString(), {embed: {
        color: colors.LIGHT_GREY,
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
        var statsArray = [stats.data.total_tries, stats.data.status.count, stats.data.remaining]
        var text = await api.getText("startText", user.lang)
        var str = text.data.text;
        for(var i = 1; i < 4; i++){
            str = str.replace('%'+ i +'$d', statsArray[i-1])
        }
        return channel.send( user.toString(),
            {
                embed: 
                {
                    color: colors.BLUE,
                    author: {
                        name: user.username + " stats",
                        icon_url: user.avatarURL
                },
                description: str
            }
        });
    } catch(err){
        console.log("ERROR PLAYER STATS MESSAGE:" + err.message);
        throw err;
    }
}

module.exports.helpMessage = async (channel, user) => {
    try{
        var title = await api.getText("helpTitle", user.lang);
        var body = await api.getText("helpText", user.lang);
        return channel.send({embed: {
            color: colors.GOLD,
            title: title.data.text,
            description: body.data.text.replace(/\\n/g, "\n")
         }
        });
    }catch(err){
        console.log("ERROR HELP MESSAGE: " + err.message);
        throw err;
    }
}


module.exports.hintMessage = async (message, channel, user, championName) => {
    try{
        var hint = await api.getHint(user.id, championName+"Text", user.lang);
        var title = await api.getText("hintTitle", user.lang);
        return message.edit({embed: {
            color: colors.GREY,
            author: {
                name: user.username,
                icon_url: user.avatarURL
            },
            description: message.embeds[0].description,
            fields: [{
                name: title.data.text,
                value: hint.data.text
            }]
        }}
        );
    } catch(err){
        console.log("ERROR HINT MESSAGE:" + err.message);
        throw err;
    }
}

module.exports.editChampionMessage = async (user, message, nextRepresentation) => {
    return message.edit(user.toString(), {embed: {
        color: colors.LIGHT_GREY,
        author: {
          name: user.username,
          icon_url: user.avatarURL
        },
        description: nextRepresentation
      }
    });
}

module.exports.feedbackMessage = async (channel, user, message, correct) => {
    let query = correct ? "correct" : "incorrect"
    let color = correct ? 3066993 : 15158332;
    let file = correct ? "https://lh3.googleusercontent.com/a560R0P39R1myJnFH9RjnDwvcEHPSUHcrLf3q9fNiYyVIZbX4ylqJBw5SD6hfwZd1ySkEeXEZnBErtLKvUIiC4T0uYOsMbnzxJVey99MhHDIfak1mBJ5QlVBhQkJUd96GooN3_ZbJ6d39NjTyYvbNioNl8EmORKuVMtg0F-2BbVpWQU6O8PtWuH1Tpyx0BEWBP76o6YwVzHQtCru_0QwsrS9kZo4bJgbg_9VW_byXbKZlgNCqrGYzQpd6MusNrNHyhsIxEASXsLDEpuPxhEuV2JuIg8XDIDWXBHbK0jHlUWOrOgrRavd9RJpUx-38AT6uaU69X0sSs9K2dMk7LwcM4Y5v-8hDxKaijwan4bNvxBNcD-QKHXS2nIrBw7DTLxkznFCqfaGhfysdaVIKM1bzZ44wcQF9VWZxwF_KWCew3M8RLHWi0qZt9hw1lKp_2nkTAGiVULA9UvPnnzmeNYUVmf0ydfJq4zlCSbX8YeIQrI4LOmMyrPb2nvZvi5Ks0XxiYX9eddcupymvnmLvVvDzRN1h9-9XqjYLqeqGqsPOLNj8jFdR-ip_R4DxMZiA_jlx1tP-09GNBAFBLqntD3bEPCv73tadTyMVnRtxEJdcf4Xh4lkpi869onfHe8CU9WzDt6FSTZPQOls9Jd23EflYqgULN-3CYQ=s80-no" : "https://lh3.googleusercontent.com/f_bNe2vqjfIjIGnV4nsnqYKviQptWTdneO4ZhNEOyiMCAF6aiVKw-NJrrGdyyhxjbJ5Qac4JHYtoHU43tojYkhM7zdFzJ_wd2KnvFWhRRQoTh2RMYoWbOGzvJerlqj39CsyRZ67kCmXzTs9LeuDqcnhWT1bOW-5ukWLPoxFERneJPT2aJWj-NoQ08FrdN3k28EMNbTfYWF8vGid8eaRfrneEW6MTTXegoBOR8hmTjQomN3KaCYroejgoNbml5rxGFEx8GsqGd6Tc4_7LM6tRwIgOITUFgSthJkc1l8KDVBfbwGXnRbCOHSNqqRda-JEvi1aG1wrMXovcvtrnsaJiWivyUfK0D2rX5bPyQqjvO8y64-umtH9kAH0FzYs8N37fuyi_ZyQWoDQ0iookSlxrwDrmDWwjkHlnNG0Ges_kblrQyT9CnhL1Q5N5kJaKFSmKgMp5XuURNiBKUQ4FOoNslxpcqjM6UZPcHdpya3m_CEficQatjmPxjN4qdIqc75xMBj_0sPo5yDBs8Qge3Rwalhk_gT19jUZIUzF1KDbfgdWjp2aHebIxtnwGUvSlZiYuKND8b2uxfxFg3Etz75TKJ8myPdwqCZlVVpIOhQ=s80-no";
    return message.edit(user.toString(), {embed: {
        color: color,
        author: {
            name: user.username,
            icon_url: user.avatarURL
        },
        image: { url: file }
    }
    });
}