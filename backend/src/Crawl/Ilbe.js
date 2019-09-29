const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

async function fetching() {
    const url = 'https://www.ilbe.com/list/ilbe';
    let isErrorOccured = false;
    const from = 'Ilbe';

    return await axios.get(url).then( async (res) => {
        if (res.status === 200) {
            return Processor(res.data);
        }
    }).catch(async (e) => {
        await prisma.createErrorLog({
            reason: e.toString(),
            from,
            isRead: false,
            type: 'F',
        });
        isErrorOccured = true;
        throw e;
    });

    async function Processor(html) {
        // 7~36
        try {
            for (let i = 7; i < 37; i++) {
                const target = `#content-wrap > div.board-wrap > div.board-list > ul > li:nth-child(${i})`;
                const $ = cheerio.load(html);
                const link = $(target + ' > span.title > a').attr('href');
                const title = $(target + ' > span.title > a').text();
                const time = $(target + ' > span.date').text();
                const author = $(target + '> span.global-nick.nick > a').text();
                const hitCount = $(target + '> span.view').text();
                const data = {
                    title,
                    author,
                    link: 'https://www.ilbe.com/' + link,
                    hitCount: parseInt(hitCount),
                    registeredAt: time,
                    from,
                };
                await prisma.createPrePost(data);
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
        //info(`£££ is ${from}  has Error? :  ${isErrorOccured}`);
        return new Promise((resolve, reject) => {
            resolve({ from, isErrorOccured });
            reject({ from, isErrorOccured });
        });
    }
}

module.exports = {
    fetching
}