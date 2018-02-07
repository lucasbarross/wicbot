var express = require("express"),
    client = require("../client.js"),
    config = require("./config.js")
    router = express.Router();

router.get("/", function(req, res){
    res.send("Hello!");
})

router.post("/", function(req, res){
    let user = req.body['client_id'];
    let secret = req.body['secret'];
    let msg = req.body['message'];

    if(user == config.client.uid && secret == config.client.secret){
        client.guilds.forEach((guild, i) => {
            guild.defaultChannel.send(msg);
        })
    }
})

module.exports = router;