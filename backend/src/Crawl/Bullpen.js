const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

async function fetching() {
    const url = 'http://mlbpark.donga.com/mp/b.php?p=1&m=list&b=bullpen&query=&select=&user=';
    let isErrorOccured = false;
    const from = 'Bullpen';

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
        // 6 ~ 35.
        try {
            for (let i = 5; i < 34; i++) {
                const target = `#container > div.contents > div.left_cont > div.tbl_box > table > tbody > tr:nth-child(${i})`;
                const $ = cheerio.load(html);
                const link = $(target + ' > td.t_left > a.bullpenbox').attr('href');
                const title = $(target + ' > td.t_left > a.bullpenbox').attr(
                    'title',
                );
                const time = $(target + ' > td > span.date').text();
                const author = $(target + '> td > span.nick').text();
                const hitCount = $(target + '> td.t_right > span').text();
                const data = {
                    title,
                    author,
                    link,
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