const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

async function fetching() {
    const url = 'https://web.humoruniv.com/board/humor/list.html?table=pick';
    let isErrorOccured = false;
    const from = 'HumorUniv';

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
        info("html", html);
        try {
            for (let i = 1; i < 21; i++) {
                const target = `#cnts_list_new > div:nth-child(1) > table:nth-child(3) > tbody > tr:nth-child(${i})`;
                const $ = cheerio.load(html);
                // #li_chk_pick-898898 > td.li_sbj > a
                const link = $(target + '> td.li_sbj > a').attr('href');
                const title = $(target + '> td.li_sbj > a').text();
                const time = $(target + '> td.li_date > span.w_time').text();
                const author = $(target + '> td.li_icn > table > tbody > tr > td.g6 > span > span').text();
                const hitCount = $(target + '> td:nth-child(5)').text();
                const data = {
                    title,
                    author,
                    link: 'http://www.todayhumor.co.kr' + link,
                    hitCount: parseInt(hitCount),
                    registeredAt: time,
                    from,
                };

                // info('£££', data);
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