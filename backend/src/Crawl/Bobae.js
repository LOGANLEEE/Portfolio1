const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');
const https = require('https');

const { info } = console;

function fetching() {
    const url = 'https://www.bobaedream.co.kr/list?code=best';

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    axios.get(url, { httpsAgent: agent }).then((res) => {
        if (res.status === 200) {
            info("£££ data", res.data);
            Processor(res.data);
        }
    }).catch((err) => info(err));

    async function Processor(html) {
        // 1~30
        for (let i = 1; i < 31; i++) {
            const target = `#boardlist > tbody > tr:nth-child(${i})`;
            const $ = cheerio.load(html);
            const title = $(target + ' > td.pl14 > a.bsubject').text();
            const link = $(target + ' > td.pl14 > a.bsubject').attr('href');
            const time = $(target + ' > td.date').text();
            const author = $(target + ' > td.author02 > span.author').text();
            const hitCount = $(target + ' > td.count').text();
            const data = {
                title,
                author,
                hitCount: parseInt(hitCount),
                registeredAt: time,
                from: 'Bobae',
                link: 'https://www.bobaedream.co.kr' + link,
            };

            await prisma.createPost(data);
            await prisma.createBobae(data);
        }
    }
}

module.exports = {
    fetching
}