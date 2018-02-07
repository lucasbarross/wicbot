var config = require("./config/config");
//PING to keep bot alive
setInterval(() => {
    http.get(config.BOT_URL);
}, 280000);
