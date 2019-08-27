const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

function fetching() {
    const url = 'http://www.slrclub.com/bbs/zboard.php?id=best_article';
    axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((err) => info(err));

    async function Processor(html) {
        for (let i = 1; i < 31; i++) {
            const target = `#bbs_list > tbody > tr:nth-child(${i})`;
            const $ = cheerio.load(html);
            const link = $(target + '> td.sbj > a').attr('href');
            const title = $(target + '> td.sbj > a').text();
            const time = $(target + '> td.list_date.no_att').text();
            const author = $(target + '> td.list_name > span').text();
            const hitCount = $(target + '> td.list_click.no_att').text();
            const data = {
                title,
                author,
                link: 'http://www.slrclub.com/' + link,
                hitCount: parseInt(hitCount),
                registeredAt: time,
                from: 'SLR',
            };

            await prisma.createPost(data);
            await prisma.createSLRClub(data);
        }
        info("£££ SLR Done");
    }
}

module.exports = {
    fetching
}