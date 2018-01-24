var axios = require("axios");
var authorization;

module.exports.getChampions = async (userID) => {
    try {
        await checkToken();
        let champions = await axios.get(process.env.API_URL + `/api/v1/champions?user_id=${userID}`)
        return champions;
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
    axios.post(process.env.API_URL + '/oauth/token', {
        grant_type: client_credentials,
        client_id: process.env.UID,
        client_secret: process.env.SECRET
    })
    .then((response) => {authorization = response})
    .catch((err) => console.log(err));    
}