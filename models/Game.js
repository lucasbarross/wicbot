var api = require("../util/api_controller");
var messenger = require("../util/messenger");
var client = require("../client");

module.exports = class Game {
    
    //channel
    //guild
    //user
    //currentChampion
    //championIndex (currentChampion index on championsAvailable array)
    //championsAvailable
    //message
    //hinted


    constructor(message) {
        this.channel = message.channel;
        this.guild = message.guild;
        this.user = message.author;
        if(this.guild.region == "brazil"){
            this.user.lang = "br";
        } else {
            this.user.lang = "us";
        }
    }

    getRandomChampion(){
        var index = Math.floor(Math.random()*this.championsAvailable.length);
        this.championIndex = index;
        return this.championsAvailable[index];
    }

    start() {
        api.getChampions(this.user.id).then((response) => {
            this.hinted = false;
            this.championsAvailable = response.data;
            this.currentChampion = this.getRandomChampion();
            messenger.championMessage(this.channel, this.user, this.currentChampion.representation).then((msg) => { this.message = msg }).catch(err => console.log(err.message)); 
        }).catch((err) => console.log(err.message));      
    }

    checkBard(){
        if(this.currentChampion.name == "bard" && this.user.lang == "br"){
            this.currentChampion.name = "bardo";
        }
    }

    nextChampion(){
        this.hinted = false;
        if(this.championsAvailable.length > 0){
            this.currentChampion = this.getRandomChampion();
            this.checkBard();
            messenger.editChampionMessage(this.user, this.message, this.currentChampion.representation).catch((err) => console.log(err.message));  
        } else {
            api.getText("completeGameText", this.user.lang).then((response) => {
                messenger.editChampionMessage(this.user, this.message, response.data.text);
                client.games.delete(this.user.id);
            });
        }
    }

    showHint(){
        this.hinted = true;
        messenger.hintMessage(this.channel, this.user, this.currentChampion.name)
        .then((msg) => { return msg.delete(15000) })
        .catch((err) => console.log(err.message));
    }

    registerAnswer(hunch){
        var isCorrect = hunch.toLowerCase() == this.currentChampion.name;
        api.postAnswer(user.id, this.currentChampion.id, isCorrect, this.hinted).then((response) => { 
            if(isCorrect){
                this.championsAvailable.slice(this.championIndex, 1);
                messenger.feedbackMessage(this.channel, this.user, this.message, true)
                .then(() => 
                {
                    setTimeout(function(){
                        this.nextChampion();
                    }, 500);
                });
            } else {
                messenger.feedbackMessage(this.channel, this.user, this.message, false)
                .then((message) => {
                    setTimeout(function(){ 
                        messenger.editChampionMessage(this.user, this.message, this.currentChampion) 
                    }, 500);
                });
            }
        }).catch((err) => console.log(err.message));
    }
}