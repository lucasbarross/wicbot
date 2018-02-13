var express = require("express"),
    config = require("./constants.js")
    router = express.Router();

router.get("/", function(req, res){
    res.send("Hello!");
})

router.post("/", function(req, res){
    let user = req.body['client_id'];
    let secret = req.body['secret'];
    let msg = req.body['message'];
    let promises = [];
    if(user == config.client.uid && secret == config.client.secret){
        require("../server").guilds.forEach((guild) => { //for each guild the bot is in
            let defaultChannel = "";
            guild.channels.forEach((channel) => {
                  if(channel.type == "text" && defaultChannel == "") {
                    if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                        defaultChannel = channel;
                    }
                  }
                })
                promises.push(defaultChannel.send(msg).catch((err) => console.log(err.message))); //send it to whatever channel the bot has permissions to send on
            })
        }    

    Promise.all(promises).then(() => res.send("Sent."));
})

module.exports = router;