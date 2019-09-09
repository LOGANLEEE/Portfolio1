const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');
const iconv = require('iconv-lite');

const info = console.info;

async function fetching() {
    const url = 'https://www.instiz.net/pt/';
    let isErrorOccured = false;
    const from = 'Instiz';

    await axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((e) => {
        prisma.createErrorLog({
            reason: e.toString(),
            from,
            isRead: false,
            type: 'F',
        });
        isErrorOccured = true;
        throw e;
    });

    async function Processor(html) {
        try {
            for (let i = 10; i < 21; i += 10) {
                for (let j = 1; j < 11; j++) {
                    const $ = cheerio.load(html);
                    const title = $(`#focus${j}`).text();
                    const link = $(`#focus${j}`).attr('href');
                    const data = {
                        title,
                        link,
                        from,
                    };
                    await prisma.createPrePost(data);
                }
            }
        } catch (e) {
            await prisma.createErrorLog({
                reason: e.toString(),
                from,
                isRead: false,
                type: 'Q',
            });
            isErrorOccured = true;
            throw e;
        }
    }
    info(`£££ ${from} done`);
    return { from, isErrorOccured };
}

module.exports = {
    fetching
}