const Clien = require('./Clien');
const Bobae = require('./Bobae');
const Bullpen = require('./Bullpen');
const Ilbe = require('./Ilbe');
const Etoland = require('./Etoland');
const SLR = require('./SLR');
const TodayHumor = require('./TodayHumor');
const Cook = require('./Cook');
const Gasengi = require('./Gasengi');
const RuliWeb = require('./RuliWeb');
const PpomPu = require('./PpomPu');
const Instiz = require('./Instiz');
const TheQoo = require('./TheQoo');
const FmKorea = require('./FmKorea');
const DogDrip = require('./DogDrip');
const HumorUniv = require('./HumorUniv');

const { info } = console;


function init() {

    const start = new Promise((resolve, reject) => {
        try {
            const siteList = [Clien, Bobae, Bullpen, Ilbe, Etoland, SLR, TodayHumor, Cook, Gasengi, RuliWeb, PpomPu, Instiz, TheQoo, FmKorea, DogDrip];
            // const siteList = [Clien];
            const errList = [];

            siteList.map(site => {
                const result = site.fetching();
                if (result.isErrorOccured === true) {
                    errList.push(result);
                }
            });

            resolve(errList);



            // if (siteList.length > 0) {
            //     siteListExecutor().then((e) => { info('£££ 3 ', e); return errList });
            // }


            // DCinside // TODO
            // NATEPANN // TODO
            // YGOSU // TODO
            // DDANZI // TODO

            // HumorUniv.fetching(); // not working
        } catch (err) {
            reject(err);
        }
    });
    return start;
}

module.exports = {
    init
};