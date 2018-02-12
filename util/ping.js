var config = require("../config/constants");
//PING to keep bot alive
setInterval(() => {
    http.get(config.BOT_URL);
}, 280000);
