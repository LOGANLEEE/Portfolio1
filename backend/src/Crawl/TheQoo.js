const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const info = console.info;

async function fetching() {
    const url = 'https://theqoo.net/hot?filter_mode=normal';
    let isErrorOccured = false;
    const from = 'TheQoo';

    await axios.get(url).then((res) => {
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
            for (let i = 5; i < 34; i++) {
                const target = `#bd_801402415_0 > div > table > tbody > tr:nth-child(${i})`;
                const $ = cheerio.load(html);
                const title = $(target + '> td.title > a:nth-child(1) > span').text();
                const link = $(target + '> td.title > a:nth-child(1)').attr('href');
                const time = $(target + '> td.time').text().replace('.', '-').trim();
                const hitCount = $(target + '> td.m_no').text().replace('만', '0000').replace('.', '');
                const data = {
                    title,
                    link: 'https://theqoo.net/' + link,
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
        };
    }
    info(`£££ ${from} is ${isErrorOccured} done`);
    return { from, isErrorOccured };
}

module.exports = {
    fetching
}