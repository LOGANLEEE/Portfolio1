const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

async function fetching() {
    const url = 'http://www.todayhumor.co.kr/board/list.php?table=humorbest';
    let isErrorOccured = false;
    const from = 'TodayHumor';

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
            for (let i = 2; i < 32; i++) {
                const target = `body > div.whole_box > div > div > table > tbody > tr:nth-child(${i})`;
                const $ = cheerio.load(html);
                const link = $(target + '> td.subject > a').attr('href');
                const title = $(target + '> td.subject > a').text();
                const time = $(target + '> td.date').text();
                const author = $(target + '> td.name > a').text();
                const hitCount = $(target + '> td.hits').text();
                const data = {
                    title,
                    author,
                    link: 'http://www.todayhumor.co.kr' + link,
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
    }
    info(`£££ ${from} is ${isErrorOccured} done`);

    return { from, isErrorOccured };
}

module.exports = {
    fetching
}