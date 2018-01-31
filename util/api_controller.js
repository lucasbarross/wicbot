var axios = require("axios");
var config = require("../config")
var authorization;
axios.defaults.baseURL = process.env.API_URL;

module.exports.getChampions = async (userID) => {
    try {
        await checkToken();
        let champions = await axios.get(`/api/v1/champions?user_id=${userID}`);
        return champions.data;
    } catch(err){
        console.log(err);
    }
}

module.exports.getPlayerStats = async (userID) => {
    try{
        await checkToken();
        let status = await axios.get(`/api/v1/status?user_id=${userID}`);
        return status.data;  
    } catch (err) {
        console.log(err);
    }
}

module.exports.getText = async (hash, lang) => {
    try{
        await checkToken();
        let localization = await axios.get(`/api/v1/localization?hash=${hash}&lang=${lang}`);
        return localization.data;  
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
            getToken().then(() => {
                resolve();
            }).catch((err) => reject(err));
        } else {
            resolve();
        }
    })
}

async function getToken(){
    return new Promise((resolve, reject) => {
        axios.post('/oauth/token', {
            grant_type: "client_credentials",
            client_id: config.client.secret,
            client_secret: config.client.uid
        })
        .then((response) => {
            authorization = response.data
            axios.defaults.headers.common['Authorization'] = "Bearer " + authorization.token;
            resolve();
        })
        .catch((err) => {
            reject(err);
        });    
    })
}