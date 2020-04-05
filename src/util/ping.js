var config = require("../config/constants");
var axios = require("axios");
setInterval(() => {
    console.log("Ping");
    axios.get(config.BOT_URL).catch((err) => console.log(err.message));
}, 280000);
