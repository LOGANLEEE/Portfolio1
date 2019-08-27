const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const info = console.info;

function fetching() {
    const url = 'http://mlbpark.donga.com/mp/b.php?p=1&m=list&b=bullpen&query=&select=&user=';
    axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((err) => info(err));

    async function Processor(html) {
        // 6 ~ 35.
        // #container > div.contents > div.left_cont > div.tbl_box > table > tbody > tr:nth-child(6)
        // #container > div.contents > div.left_cont > div.tbl_box > table > tbody > tr:nth-child(35)
        for (let i = 6; i < 36; i++) {
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
                from: 'Bullpen',
            };

            await prisma.createPost(data);
            await prisma.createBullpen(data);
        }
        info("£££ MLB Done");
    }
    return true;
}

module.exports = {
    fetching
}