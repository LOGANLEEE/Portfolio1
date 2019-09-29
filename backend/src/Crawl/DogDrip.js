
const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const info = console.info;

async function fetching() {
    const url = 'https://www.dogdrip.net/dogdrip';
    let isErrorOccured = false;
    const from = 'DogDrip';

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
                    from,
                };
                await prisma.createPrePost(data);
            }
        } catch (e) {
            await prisma.createErrorLog({
                reason: e.toString(),
                from,
                isRead: false,
                type: 'F',
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