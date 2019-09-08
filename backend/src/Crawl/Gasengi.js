const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

async function fetching() {
    const url = 'https://www.gasengi.com/main/board.php?bo_table=commu';
    let isErrorOccured = false;

    await axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((e) => {
        prisma.createErrorLog({
            reason: e.toString(),
            from: 'RuliWeb',
            isRead: false,
            type: 'F',
        });
        isErrorOccured = true;
    });

    async function Processor(html) {
        try {
            for (let i = 1; i < 3; i++) {
                for (let j = 1; j < 6; j++) {
                    const target = `#rightcolumn > div.rank_div > div.rank_dbox > ol > span:nth-child(${i}) > li:nth-child(${j})`;
                    const $ = cheerio.load(html);
                    const link = $(target + '> a').attr('href');
                    const title = $(target + '> a').text();
                    const data = {
                        title,
                        link: 'https://www.gasengi.com/' + link,
                        from: 'Gasengi',
                    };

                    await prisma.createPrePost(data);
                    // await prisma.createGasengi(data);
                }
            }
        } catch (e) {
            await prisma.createErrorLog({
                reason: e.toString(),
                from: 'Gasengi',
                isRead: false,
                type: 'Q',
            });
        }
        isErrorOccured = true;
        info("£££ Gasengi Done")
    }
    return isErrorOccured;
}

module.exports = {
    fetching
}