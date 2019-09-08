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

const { info } = console;


function start() {

    Clien.fetching();
    Bobae.fetching();
    Bullpen.fetching();
    lbe.fetching();
    SLR.fetching();
    TodayHumor.fetching();
    Cook.fetching();
    Gasengi.fetching();
    Etoland.fetching();
    RuliWeb.fetching()
    PpomPu.fetching();
    Instiz.fetching();
    TheQoo.fetching();
    FmKorea.fetching();
    DogDrip.fetching();



    // DCinside // TODO
    // NATEPANN // TODO
    // YGOSU // TODO
    // DDANZI // TODO
    return false;
}

module.exports = {
    start
};