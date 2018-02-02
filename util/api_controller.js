var axios = require("axios");
var config = require("../config")
var authorization;
axios.defaults.baseURL = process.env.API_URL;

module.exports.getChampions = async (userID) => {
    try {
        await checkToken();
        return axios.get(`/api/v1/champions?user_id=${userID}`);
    } catch(err){
        console.log(err.message);
        throw err;
    }
}

module.exports.getPlayerStats = async (userID) => {
    try{
        await checkToken();
        return axios.get(`/api/v1/status?user_id=${userID}`); 
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

module.exports.getText = async (hash, lang) => {
    try{
        await checkToken();
        return axios.get(`/api/v1/localization?hash=${hash}&lang=${lang}`);  
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

module.exports.postAnswer = async (userID, championID, correct, hinted) => {
    try{
        await checkToken();
        return axios.post(`/api/v1/answers`, {
            player: userID,
            champion_id: championID,
            correct: correct,
            hinted: hinted
        });
    } catch(err){
        console.log(err.message);
        throw err;
    }
}

async function checkToken(){
    return new Promise((resolve, reject) => {
        if(!authorization || authorization.created_at + authorization.expires_in >= new Date().getTime()){
            getToken().then((response) => {
                authorization = response.data
                axios.defaults.headers.common['Authorization'] = "Bearer " + authorization.access_token;
                resolve();
            }).catch((err) => console.log(err))
        } else {
            resolve();
        }
    })
}

async function getToken(){
    return axios.post('/oauth/token', {
        grant_type: "client_credentials",
        client_id: config.client.uid,
        client_secret: config.client.secret
    })
}