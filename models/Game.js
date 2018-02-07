var api = require("../util/api_controller");
var messenger = require("../util/messenger");
var client = require("../client");

module.exports = class Game {
    
    /**
    * @param channel //Channel the game is on
    * @param guild //Guild the game is on
    * @param user //User playing the game
    * @param currentChampion //Current champion player is on
    * @param championIndex (currentChampion index on championsAvailable array)
    * @param championsAvailable //All champions available to the player
    * @param message //Reference to the bot message so we can edit it later to pass to the next champion
    * @param hinted //If the player asked for a hint in the current champion
    */

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
    
    timeout(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    registerAnswer(hunch){
        var isCorrect = hunch.content.toLowerCase() == this.currentChampion.name;
        hunch.delete(0).catch((err) => console.log(err));
        api.postAnswer(this.user.id, this.currentChampion.id, isCorrect, this.hinted).then((response) => { 
            return messenger.feedbackMessage(this.channel, this.user, this.message, isCorrect)
        }).then((fbmsg) => {
            return this.timeout(5000);
        }).then(() => {
            if(isCorrect){
                return this.nextChampion()
            } else {
                return messenger.editChampionMessage(this.user, this.message, this.currentChampion.representation)
            }
        }).catch((err) => console.log(err.message));
    }
}