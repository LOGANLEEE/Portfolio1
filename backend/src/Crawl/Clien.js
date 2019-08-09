const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

function fetching() {
    const url = 'https://www.clien.net/service/board/park';

    axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((err) => info(err));

    async function Processor(html) {
        for (let i = 7; i < 37; i++) {
            const target = `#div_content > div:nth-child(${i})`;
            const $ = cheerio.load(html);
            const link = $(target + ' > div.list_title > a').attr('href');
            const title = $(target + ' > div.list_title > a.list_subject > span').text();
            const time = $(target + ' > div.list_time > span > span').text();
            const writer = $(target + ' > div.list_author > span.nickname > span').text();
            const imgWriter = $(target + ' > div.list_author > span.nickname > img').attr('alt');
            const hitCount = $(target + ' > div.list_hit > span').text();
            const author = writer !== '' ? writer : imgWriter;

            const data = {
                title,
                author,
                hitCount: parseInt(hitCount),
                registeredAt: time,
                link: 'https://www.clien.net/service/board/park' + link,
                from: 'clien',
            };

            await prisma.createPost(data);
            await prisma.createClien(data);

        }
    }
}

module.exports = {
    fetching
}