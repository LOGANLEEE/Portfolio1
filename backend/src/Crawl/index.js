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


async function start() {
    const list = [];
    const errList = [];

    await Clien.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });

    await Bobae.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await Bullpen.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await Ilbe.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await SLR.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await TodayHumor.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await Cook.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await Gasengi.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await Etoland.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await RuliWeb.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await PpomPu.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await Instiz.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await TheQoo.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await FmKorea.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });
    await DogDrip.fetching().then(e => {
        if (e.isErrorOccured === true) {
            errList.push(e.from);
        }
    });

    // DCinside // TODO
    // NATEPANN // TODO
    // YGOSU // TODO
    // DDANZI // TODO

    // HumorUniv.fetching(); // not working

    return errList;

}

module.exports = {
    start
};