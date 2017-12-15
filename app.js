var app = require('express')(),
    mongoose = require('mongoose');
    Discord = require('discord.js');
    client = new Discord.Client();

client.on('ready', () => {
    console.log('Logged');
})

app.get("/", function(req, res){
    res.send("Hello!");
})

client.login('token');
app.listen(3000, 'localhost');