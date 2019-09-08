
const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const info = console.info;

async function fetching() {
    const url = 'https://www.dogdrip.net/dogdrip';
    let isErrorOccured = false;

    await axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((e) => {
        prisma.createErrorLog({
            reason: e.toString(),
            from: 'DogDrip',
            isRead: false,
            type: 'F',
        });
        isErrorOccured = true;
    });

    async function Processor(html) {
        try {
            for (let i = 1; i < 21; i++) {
                const target = `#main > div > div.eq.section.secontent.background-color-content > div > div.ed.board-list > table > tbody > tr:nth-child(${i})`;
                const $ = cheerio.load(html);
                const title = $(target + '> td.title > a > span.ed.title-link').text().trim();
                const link = $(target + '> td.title > a').attr('href');
                const author = $(target + '> td.author > a').text().trim();
                const data = {
                    title,
                    author,
                    link,
                    from: 'DogDrip',
                };
                info("£££ data : ", data);
                await prisma.createPrePost(data);
            }
        } catch (e) {
            await prisma.createErrorLog({
                reason: e.toString(),
                from: 'DogDrip',
                isRead: false,
                type: 'F',
            });
            isErrorOccured = true;
        }
        info('£££ DogDrip Done');
    }
    return isErrorOccured;
}

module.exports = {
    fetching
}