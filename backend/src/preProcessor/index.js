const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');
const Constants = require('../Constants');
const SelectorOfSite = require('../preProcessor/SelectorOfSite');
const iconv = require('iconv-lite');
const https = require('https');

const { info } = console;

async function exec() {
    info("£££ preProcessor.exec() started ");

    await prisma.prePosts().then(data => {

        data.map(e => {
            switch (e.from) {
                case Constants.Etoland: {
                    approacher(e);
                };
                case Constants.Bobae: {
                    approacher(e);
                };
                case Constants.Clien: {
                    approacher(e);
                };
            }
        });
    }).then(info("£££ preProcessor.exec() terminated "));

};

function approacher(target) {
    let config = {};
    let isNeedEncodingConfig = false;
    let isClien = false;


    switch (target.from) {
        case Constants.Etoland: {
            config = { responseType: 'arraybuffer' }
            isNeedEncodingConfig = true;
            break;
        };
        case Constants.Bobae: {
            const agent = new https.Agent({
                rejectUnauthorized: false
            });
            config = { httpsAgent: agent }
            break;
        };
        case Constants.Clien: {
            isClien = true;
            break;
        };

        default:
            break;
    };

    axios.get(target.link, config).then(res => {
        if (res.status === 200) {
            let result = '';
            // Encoding & Decoding
            isNeedEncodingConfig ? result = iconv.decode(res.data, 'euc-kr') : res.data;
            let $ = cheerio.load(result);
            const title = $(SelectorOfSite[target.from].title).text().trim();
            let author = '';

            if (isClien) {
                const writer = $(SelectorOfSite[target.from].author).text().trim();
                const imgWriter = $(SelectorOfSite[target.from].imgAuthor).attr('alt');
                author = writer !== '' ? writer : imgWriter;
            } else {
                author = $(SelectorOfSite[target.from].author).text().trim();
            }

            let date = $(SelectorOfSite[target.from].date).text().trim();
            // for Clien.
            date.includes("수정일") ? date = date.substring(date.indexOf("수정일"), -1) : null;
            const hitCount = parseInt($(SelectorOfSite[target.from].hitCount).text().trim().replace(',', ''));

            const data = {
                title,
                author,
                hitCount,
                registeredAt: date,
                link: target.link,
                from: target.from,
            };
            prisma.createTempPost(data);
            prisma.deletePrePost({ id: target.id });
        };
    }).catch(err => {
        throw err;
    });
};

module.exports = {
    exec,
};

