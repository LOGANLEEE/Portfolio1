const Clien = require('./Clien');
const Bobae = require('./Bobae');
const Bullpen = require('./Bullpen');
const Ilbe = require('./Ilbe');
const Etoland = require('./Etoland');
const SLR = require('./SLR');
const TodayHumor = require('./TodayHumor');
const Cook = require('./Cook');
const Gasengi = require('./Gasengi');

const { info } = console;


function start() {

    Clien.fetching(); //o
    Bobae.fetching(); //o
    Bullpen.fetching(); //o
    Ilbe.fetching(); //o
    SLR.fetching(); //o
    TodayHumor.fetching(); //o
    Cook.fetching(); //o
    Gasengi.fetching(); //o
    // // Etoland.fetching(); // TODO
    // DCinside
    // FMKROEA
    // RURIWEB
    // BBOMBBO
    // NATEPANN
    // YGOSU
    // INSTIZ
    return false;
}

module.exports = {
    start
}