const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

function fetching() {
    const url = 'https://www.clien.net/service/board/park';
    let isErrorOccured = false;
    const from = 'Clien';

    axios.get(url).then((res) => {
        if (res.status === 200) {
            info("1");
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

    function Processor(html) {
        try {
            info("2");
            for (let i = 7; i < 37; i++) {
                const target = `#div_content > div:nth-child(${i})`;
                const $ = cheerio.load(html);
                const link = $(target + ' > div.list_title > a').attr('href');
                const title = $(target + ' > div.list_title > a.list_subject > span').text();
                const time = $(target + ' > div.list_time > span > span').text();
                const writer = $(target + ' > div.list_author > span.nickname > span').text();
                const imgWriter = $(target + ' > div.list_author > span.nickname > img').attr('alt');
                const hitCount = $(target + ' > div.list_hit > span').text();
                const author = writer !== '' ? writer : imgWriter;

                const data = {
                    title,
                    author,
                    hitCount: parseInt(hitCount),
                    registeredAt: time,
                    link: 'https://www.clien.net/' + link,
                    from,
                };
                prisma.createPrePost(data);
            }
        } catch (e) {
            prisma.createErrorLog({
                reason: e.toString(),
                from,
                isRead: false,
                type: 'Q',
            });
            isErrorOccured = true;
            throw e;
        }
    }
    info("3");
    info(`£££ ${from} is ${isErrorOccured} done`);
    return { from, isErrorOccured };
}

module.exports = {
    fetching
}