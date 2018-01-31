var axios = require("axios");
var authorization;
var header;
axios.defaults.baseURL = process.env.API_URL;

module.exports.getChampions = async (userID) => {
    try {
        await checkToken();
        let champions = await axios.get(`/api/v1/champions?user_id=${userID}`);
        return champions;
    } catch(err){
        console.log(err);
    }
}

module.exports.getPlayerStats = async (userID) => {
    try{
        await checkToken();
        let status = await axios.get(`/api/v1/status?user_id=${userID}`);
        return status;  
    } catch (err) {
        console.log(err);
    }
}

module.exports.getText = async (hash, lang) => {
    try{
        await checkToken();
        let localization = await axios.get(`/api/v1/localization?hash=${hash}&lang=${lang}`);
        return localization;  
    } catch (err) {
        console.log(err);
    }
}

module.exports.postAnswer = async (userID, championID, correct, hinted) => {
    try{
        await checkToken();
        await axios.post(`/api/v1/answers`, {
            player: userID,
            champion_id: championID,
            correct: correct,
            hinted: hinted
        });
    } catch(err){
        console.log(err);
    }
}

async function checkToken(){
    return new Promise((resolve, reject) => {
        if(authorization.created_at + authorization.expires_in >= new Date().getTime()){
            getToken().then((response) => {
                authorization = response
                resolve();
            }).catch((err) => reject(err));
        } else {
            resolve();
        }
    })
}

async function getToken(){
    axios.post('/oauth/token', {
        grant_type: "client_credentials",
        client_id: process.env.UID,
        client_secret: process.env.SECRET
    })
    .then((response) => {
        authorization = response
        axios.defaults.headers.common['Authorization'] = "Bearer " + authorization.token;
    })
    .catch((err) => console.log(err));    
}