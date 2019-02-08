var api = require("../util/api_controller");
var messenger = require("../util/messenger");
var client = require("../server");

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const checkChampionLocalization = (currentChampion, lang) => {
    if(currentChampion.name == "bard" && lang == "br"){
        currentChampion.name = "bardo";
    }
    return currentChampion;
}

const completeGame = async (message, user, channel) => {
        
    client.games.delete(user.id);

    [text, stats] = await Promise.all([api.getText("completeGameText", user.lang), api.getPlayerStats(user.id, user.lang)]);
    
    if(message){
        return messenger.editChampionMessage(user, message, text.data.text.replace("%d", stats.data.total_tries));
    } else {
        return messenger.championMessage(channel, user, text.data.text.replace("%d", stats.data.total_tries));
    }
}

const start = async (bot, gameState) => {
    const statusRes = await api.getPlayerStats(gameState.user.id, gameState.user.lang);
    
    //Caso o usuário tenha 0 respostas corretas e logo provavelmente é novo no jogo, mostrar a mensagem de começo
    if(statusRes.data.status.count == 0) {
        await messenger.startMessage(gameState.channel, gameState.user);
    }

    gameState.message = await messenger.loadingMessage(gameState.channel, gameState.user);

    const response = await api.getRandomChampion(gameState.user.id);
    
    console.log("response data", response.data)
    
    if(response.data.complete){
        return completeGame(gameState.message, gameState.user, gameState.channel);
    }

    client.games.set(gameState.user.id, gameState);

    console.log("CREATED A GAME INSTANCE");
    console.log("COLLECTION.GAMES:", bot.games.size);

    return renderNextChampion(gameState, response.data);
}


const registerAnswer = async (hunch, gameState) => {
    var isCorrect = hunch.content.toLowerCase() == gameState.currentChampion.name;
    
    try {
        await hunch.delete(0);
    } catch (err) {
        console.log("ERROR DELETING HUNCH:", err);
    }
    
    await api.postAnswer(gameState.user.id, gameState.currentChampion.id, isCorrect, gameState.hinted);
    await messenger.feedbackMessage(gameState.channel, gameState.user, gameState.message, isCorrect);
    await timeout(1000);
    
    if(isCorrect){
        const championRes = await api.getRandomChampion(gameState.user.id);
        return renderNextChampion(gameState, championRes.data);
    } else {
        return messenger.editChampionMessage(gameState.user, gameState.message, gameState.currentChampion.representation).catch((err) => console.log("ERROR REGISTER ANSWER -> EDIT CHAMPION MESSAGE " + err));
    }
}

const renderNextChampion = async (gameState, champion) => {
    gameState.hinted = false;

    if(!champion.complete){
        gameState.currentChampion = checkChampionLocalization(champion.info, gameState.user.lang);
        console.log(gameState.currentChampion);
        return messenger.editChampionMessage(gameState.user, gameState.message, gameState.currentChampion.representation);  
    } else {
        return completeGame(gameState.message, gameState.user, gameState.channel);
    }
}

const skipChampion = async (gameState) => {
    const champion = await api.getRandomChampion(gameState.user.id, gameState.currentChampion.id);
    console.log(champion.data);
    if(!champion.data.complete) {
        renderNextChampion(gameState, champion.data);
    }
}

const showHint = async (gameState) => {
    var hintRes = await api.getHint(gameState.user.id, gameState.currentChampion.name+"Text", gameState.user.lang);
    gameState.hinted = hintRes.data.hint;
    return messenger.hintMessage(gameState.message, gameState.channel, gameState.user, hintRes.data.message.text);
}

module.exports = {
    start,
    registerAnswer,
    skipChampion,
    showHint
}
