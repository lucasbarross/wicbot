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
  DARK_NAVY: 2899536,
};

module.exports.championMessage = async (channel, user, representation) => {
  return channel.send(user.toString(), {
    embed: {
      color: colors.LIGHT_GREY,
      author: {
        name: user.username,
        icon_url: user.avatarURL(),
      },
      description: representation,
    },
  });
};

module.exports.playerStatsMessage = async (channel, user) => {
  try {
    var stats = await api.getPlayerStats(user.id);
    var statsArray = [
      stats.data.total_tries,
      stats.data.status.count,
      stats.data.remaining,
    ];
    var text = await api.getText("startText", user.lang);
    var str = text.data.text;
    for (var i = 1; i < 4; i++) {
      str = str.replace("%" + i + "$d", statsArray[i - 1]);
    }
    return channel.send(user.toString(), {
      embed: {
        color: colors.BLUE,
        author: {
          name: user.username + " stats",
          icon_url: user.avatarURL(),
        },
        description: str,
      },
    });
  } catch (err) {
    console.log("ERROR PLAYER STATS MESSAGE:" + err.message);
    throw err;
  }
};

module.exports.helpMessage = async (channel, user) => {
  try {
    var title = await api.getText("helpTitle", user.lang);
    var body = await api.getText("helpText", user.lang);

    console.log(title.data);
    console.log(body);

    return channel.send({
      embed: {
        color: colors.GOLD,
        title: title.data.text,
        description: body.data.text.replace(/\\n/g, "\n"),
      },
    });
  } catch (err) {
    console.log("ERROR HELP MESSAGE: " + err.message);
    throw err;
  }
};

module.exports.hintMessage = async (message, channel, user, hintMessage) => {
  try {
    var title = await api.getText("hintTitle", user.lang);
    return message.edit({
      embed: {
        color: colors.GREY,
        author: {
          name: user.username,
          icon_url: user.avatarURL(),
        },
        description: message.embeds[0].description,
        fields: [
          {
            name: title.data.text,
            value: hintMessage,
          },
        ],
      },
    });
  } catch (err) {
    console.log("ERROR HINT MESSAGE:" + err.message);
    throw err;
  }
};

module.exports.editChampionMessage = async (
  user,
  message,
  nextRepresentation
) => {
  return message.edit(user.toString(), {
    embed: {
      color: colors.LIGHT_GREY,
      author: {
        name: user.username,
        icon_url: user.avatarURL(),
      },
      description: nextRepresentation,
    },
  });
};

module.exports.feedbackMessage = async (channel, user, message, correct) => {
  let query = correct ? "correct" : "incorrect";
  let color = correct ? 3066993 : 15158332;
  let file = correct
    ? "https://i.imgur.com/AHUmdp2.png"
    : "https://i.imgur.com/e6D8hho.png";
  return message.edit(user.toString(), {
    embed: {
      color: color,
      author: {
        name: user.username,
        icon_url: user.avatarURL(),
      },
      image: { url: file },
    },
  });
};

module.exports.loadingMessage = async (channel, user) => {
  return channel.send({
    embed: {
      color: colors.DARKER_GREY,
      author: {
        name: user.username,
        icon_url: user.avatarURL(),
      },
      description: "Loading...",
    },
  });
};

module.exports.rankMessage = async (
  channel,
  userDiscordInfo,
  userStatsInfo,
  lang
) => {
  let rankText = await api.getText("rankText", lang);
  rankText = rankText.data.text
    .replace("{player_name}", userDiscordInfo.username)
    .replace("{hits}", userStatsInfo.total_tries);
  return channel.send({
    embed: {
      color: colors.BLUE,
      author: {
        name: userDiscordInfo.username,
        icon_url: `https://cdn.discordapp.com/avatars/${userDiscordInfo.id}/${userDiscordInfo.avatar}`,
      },
      description: rankText,
    },
  });
};

module.exports.startMessage = async (channel, user) => {
  let startText = await api.getText("welcomeText", user.lang);
  startText = startText.data.text;
  return channel.send({
    embed: {
      color: colors.DARK_ORANGE,
      description: startText,
    },
  });
};
