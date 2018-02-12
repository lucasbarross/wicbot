var api = require("../util/api_controller");
var messenger = require("../util/messenger");
var client = require("../server");
var Promise = require("bluebird");

module.exports = class Game {
    
    /**
    * @param channel //Channel the game is on
    * @param guild //Guild the game is on
    * @param user //User playing the game
    * @param currentChampion //Current champion player is on
    * @param championIndex (currentChampion index on championsAvailable array)
    * @param championsAvailable //All champions available to the player
    * @param message //Reference to the bot message so we can edit it later
    * @param hinted //If the player asked for a hint in the current champion
    * @param guessEnabled //Enables player to take a guess (stops spamming and therefore bugs)
    * @param hunch // message player sent to try guessing
    */

    constructor(message) {
        this.channel = message.channel;
        this.guild = message.guild;
        this.user = message.author;
        this.guessEnabled = true;
        if(this.guild.region == "brazil"){
            this.user.lang = "br";
        } else {
            this.user.lang = "us";
        }
    }

    getRandomChampion(champions){
        var index = Math.floor(Math.random()*champions.length);
        return champions[index];
    }

    completeGame(message){
        return Promise.all([api.getText("completeGameText", this.user.lang), api.getPlayerStats(this.user.id)]).spread((text, stats) => {
            //console.log(client.games)
            client.games.delete(this.user.id)
            this.message.delete().catch((err) => console.log(err.message));
            if(message){
                return messenger.editChampionMessage(this.user, this.message, text.data.text.replace("%d", stats.data.total_tries));
            } else {
                return messenger.championMessage(this.channel, this.user, text.data.text.replace("%d", stats.data.total_tries));
            }
        })
    }

    start() {
        api.getChampions(this.user.id).then((response) => {
            if(response.data.length <= 0){
                return this.completeGame(null);
            }
            client.games.set(this.user.id, this);
            this.hinted = false;
            this.championsAvailable = response.data;
            this.currentChampion = this.getRandomChampion(this.championsAvailable);
            messenger.championMessage(this.channel, this.user, this.currentChampion.representation).then((msg) => { this.message = msg }).catch(err => console.log(err.message)); 
        }).catch((err) => console.log(err.message));      
    }

    checkBard(){
        if(this.currentChampion.name == "bard" && this.user.lang == "br"){
            this.currentChampion.name = "bardo";
        }
    }

    nextChampion(champion){
        this.guessEnabled = true;
        this.hinted = false;
        if(this.championsAvailable.length > 0){
            this.currentChampion = champion;
            this.checkBard();
            messenger.editChampionMessage(this.user, this.message, this.currentChampion.representation).catch((err) => console.log(err.message));  
        } else {
            this.completeGame(this.message).catch(err => console.log(err.message));
        }
    }

    
    skipChampion(){
        var championsAvailableWithoutActualChampion = this.championsAvailable.slice(0);
        var index = this.currentIndex();
        championsAvailableWithoutActualChampion.splice(index, 1);
        if(championsAvailableWithoutActualChampion.length <= 0){
            return;
        }

        let champion = this.getRandomChampion(championsAvailableWithoutActualChampion);
        this.nextChampion(champion);
    }

    showHint(){
        this.hinted = true;
        messenger.hintMessage(this.message, this.channel, this.user, this.currentChampion.name)
        .then((msg) => { 
            this.message = msg             
        })
        .catch((err) => console.log(err.message));
    }
    
    timeout(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    currentIndex(){
        var index = this.championsAvailable.map((champion) => {
            return champion.name 
        }).indexOf(this.currentChampion.name);
        return index;
    }
    
    registerAnswer(hunch){
        var isCorrect = hunch.content.toLowerCase() == this.currentChampion.name;
        hunch.delete(0).catch((err) => console.log(err));
        
        if (!this.guessEnabled){
            return;
        }

        this.guessEnabled = false;
        
        api.postAnswer(this.user.id, this.currentChampion.id, isCorrect, this.hinted).then((response) => { 
            return messenger.feedbackMessage(this.channel, this.user, this.message, isCorrect)
        }).then((fbmsg) => {
            return this.timeout(500);
        }).then(() => {
            if(isCorrect){
                this.championsAvailable.splice(this.currentIndex(), 1);
                return this.nextChampion(this.getRandomChampion(this.championsAvailable))
            } else {
                this.guessEnabled = true;
                return messenger.editChampionMessage(this.user, this.message, this.currentChampion.representation)
            }
        }).catch((err) => console.log(err.message));
    }
}