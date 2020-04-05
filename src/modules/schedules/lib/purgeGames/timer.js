const moment = require('moment'), CronJob = require('cron').CronJob;
const Execute = require("./execute");


module.exports = function (bot) {
    try {
        console.log("CRON PURGE ON");

        let job = new CronJob({
            cronTime: '00 00 05 * * *',
            onTick: () => Execute(bot),
            start: true,
            runOnInit: true,
            timeZone: 'America/Fortaleza'
        });

        console.log('CRON PURGE IS RUNNING? ', job.running);
    } catch (err) {
        console.log(err.message);
    }
};