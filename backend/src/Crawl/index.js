const Clien = require('./Clien');
const Bobae = require('./Bobae');
const Bullpen = require('./Bullpen');
const Ilbe = require('./Ilbe');
const Etoland = require('./Etoland');

const { info } = console;


function start() {

    // Clien.fetching(); //Done
    // Bobae.fetching(); //Done
    // Bullpen.fetching(); //Done
    Ilbe.fetching(); //Done
    // Etoland.fetching(); // TODO
    return false;
}

module.exports = {
    start
}