const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;


async function init() {
    const crawledData = prisma.prePosts();
    crawledData.then(data => {
        if (data.length > 0) {
            data.forEach(e => {
                e.from
            })
        }
    });
}

module.exports = {
    init,
}
