const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');
const iconv = require('iconv-lite');

const info = console.info;

async function fetching() {
    const url = 'http://www.ppomppu.co.kr/hot.php';
    let isErrorOccured = false;

    await axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((e) => {
        prisma.createErrorLog({
            reason: e.toString(),
            from: 'PpompPu',
            isRead: false,
            type: 'F',
        });
        isErrorOccured = true;
    });

    async function Processor(html) {
        try {
            for (let i = 4; i < 24; i++) {
                const target = `body > div.wrapper > div.contents > div.container > div:nth-child(3) > div.board_box > table.board_table > tbody > tr:nth-child(${i})`;
                const $ = cheerio.load(html);
                const title = $(target + '> td:nth-child(4) > a').text();
                const link = $(target + '> td:nth-child(4) > a').attr('href');
                const time = $(target + '> td:nth-child(4) > a').text().trim();
                const author = $(target + '> td:nth-child(2)').text().trim();
                const hitCount = $(target + '> td:nth-child(7)').text();
                const data = {
                    title,
                    author,
                    link: 'http://www.ppomppu.co.kr' + link,
                    hitCount: parseInt(hitCount),
                    registeredAt: time,
                    from: 'PpompPu',
                };
                await prisma.createPrePost(data);
                // await prisma.createPpompPu(data);
            }
        } catch (e) {
            await prisma.createErrorLog({
                reason: e.toString(),
                from: 'PpompPu',
                isRead: false,
                type: 'Q',
            });
            isErrorOccured = true;
        }
        info("£££ PpompPu Done");
    }
    return isErrorOccured;
}

module.exports = {
    fetching
}