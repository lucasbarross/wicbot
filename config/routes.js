var express = require("express"),
    client = require("../server.js"),
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
        client.guilds.forEach((guild, i) => {
            promises.push(guild.defaultChannel.send(msg).catch((err) => console.log(err)));
        })
    }
    
    Promise.all(promises).then(() => res.send("Sent."));
})

module.exports = router;