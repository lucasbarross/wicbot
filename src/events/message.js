var client = require("../server.js");
var config = require("../config/constants.js");

function findCmd (alias){
    return new Promise((resolve, reject) => {
        var cmd = client.commands.get(alias)
        if(cmd){
            resolve(cmd)
        } else{
            reject(new Error("Command not found ("+ alias +")"));
        }
    })
}

client.on("message", (message) => {
    if (message.author.bot) return;
    var content = message.content.split(" ");
    var prefix = content[0];
    var cmdAlias = content[1];
    var args = content.slice(1);
    var game = client.games.get(message.author.id);
    if (prefix == config.prefix){
        findCmd(cmdAlias).then((cmd) => cmd.run(client, message, args)).catch((err) => console.log(err.message))
    } else if (game){
        if(game.channel == message.channel){
            client.games.get(message.author.id).registerAnswer(message);
        }
    }
})