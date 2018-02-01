var api = require("../util/api_controller");
var messenger = require("../util/messenger");

module.exports = class Game {
    
    //channel
    //guild
    //user
    //currentChampion
    //championsAvailable
    //message

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
        return this.championsAvailable[index];
    }

    start() {
        api.getChampions(this.user.id).then((response) => {
            this.championsAvailable = response.data;
            this.currentChampion = this.getRandomChampion();
            messenger.championMessage(this.channel, this.user, this.currentChampion.representation).then((msg) => { this.message = msg }).catch(err => console.log(err.message)); 
        }).catch((err) => console.log(err.message));      
    }

    nextChampion(){
        api.getChampions(this.user.id).then((response) => {
            this.championsAvailable = response.data;
            this.currentChampion = this.getRandomChampion();
            messenger.editChampionMessage(this.user, this.message, this.currentChampion.representation).catch((err) => console.log(err.message)); 
        }).catch(err => console.log(err.message)); 
    }

    showHint(){

    }

    registerAnswer(){
        this.nextChampion();
    }
}