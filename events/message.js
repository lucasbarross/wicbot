var client = require("../client.js");
var config = require("../config/constants.js");

function findCmd (alias){
    return new Promise((resolve, reject) => {
        var cmd = client.commands.get(alias)
        if(cmd){
            resolve(cmd)
        } else{
            reject(new Error("Command not found"));
        }
    })
}

client.on("message", (message) => {
    if (message.author.bot) return;
    var content = message.content.split(" ");
    var prefix = content[0];
    var cmdAlias = content[1];
    var args = content.slice(1);
    if (prefix == config.prefix){
        findCmd(cmdAlias).then((cmd) => cmd.run(client, message, args)).catch((err) => console.log(err.message))
    } else if (client.games.get(message.author.id)){
        client.games.get(message.author.id).registerAnswer(message);
    }
})